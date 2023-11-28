import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { createComponentFactory } from '@ngneat/spectator';
import { TeleportDirective } from './teleport.directive';
import { TeleportOutletDirective } from './teleport-outlet.directive';

describe('TeleportDirective', () => {
  describe('Synchronous behavior', () => {
    @Component({
      template: `
        <div *teleportTo="'projectHere'">Some view</div>
        <section>
          <ng-container teleportOutlet="projectHere"></ng-container>
        </section>
      `,
    })
    class TestComponent {}

    const createComponent = createComponentFactory({
      component: TestComponent,
      imports: [TeleportDirective, TeleportOutletDirective],
    });

    it('should render the view as sibling to the given outlet', () => {
      // Arrange & act
      const spectator = createComponent();
      // Assert
      expect(spectator.query('section')).toHaveText('Some view');
    });
  });

  describe('Asynchronous behavior', () => {
    @Component({
      selector: 'app-hello',
      template: '<div>Some view</div>',
    })
    class HelloComponent implements OnInit, OnDestroy {
      ngOnInit(): void {}
      ngOnDestroy(): void {}
    }

    @Component({
      template: `
        <app-hello *teleportTo="teleportTo"></app-hello>
        <section>
          <ng-template [teleportOutlet]="teleportTo"></ng-template>
        </section>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class AsynchronousTestComponent {
      teleportTo: string | null = null;

      constructor(private ref: ChangeDetectorRef) {}

      setTeleportToAsynchronously(): Promise<void> {
        return Promise.resolve().then(() => {
          this.teleportTo = 'projectHere';
          // Run the change detection manually since we're inside an OnPush component.
          this.ref.detectChanges();
        });
      }
    }

    const createComponent = createComponentFactory({
      component: AsynchronousTestComponent,
      imports: [TeleportDirective, TeleportOutletDirective],
      declarations: [HelloComponent],
    });

    it('should render the view as sibling to the given outlet asynchronously', async () => {
      // Arrange
      const spectator = createComponent();
      // Act
      const ngOnInitSpy = spyOn(HelloComponent.prototype, 'ngOnInit').and.callThrough();
      const ngOnDestroySpy = spyOn(HelloComponent.prototype, 'ngOnDestroy').and.callThrough();
      await spectator.component.setTeleportToAsynchronously();
      // Assert
      expect(spectator.query('app-hello')).toExist();
      expect(spectator.query('app-hello')).toContainText('Some view');
      spectator.fixture.destroy();
      expect(ngOnInitSpy).toHaveBeenCalled();
      expect(ngOnDestroySpy).toHaveBeenCalled();
    });
  });
});
