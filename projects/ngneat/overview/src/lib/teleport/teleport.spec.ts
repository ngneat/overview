import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
      standalone: false,
    })
    class TestComponent {}

    const createComponent = createComponentFactory({
      component: TestComponent,
      imports: [TeleportDirective, TeleportOutletDirective],
      providers: [provideZonelessChangeDetection()],
    });

    it('should render the view as sibling to the given outlet', () => {
      // Arrange & act
      const spectator = createComponent();
      // Assert
      expect(spectator.query('section')).toHaveText('Some view');
    });
  });

  describe('FormGroup inside teleportTo', () => {
    // Verifies that reactive form directives work correctly when rendered through a
    // teleport — their injector context (ControlContainer, ControlValueAccessor) must
    // survive being rendered into a foreign ViewContainerRef.
    @Component({
      selector: 'app-sidebar-host',
      template: `<ng-container teleportOutlet="sidebar"></ng-container>`,
      imports: [TeleportOutletDirective],
    })
    class SidebarHostComponent {}

    @Component({
      template: `
        <ng-container *teleportTo="'sidebar'">
          <ng-container [formGroup]="formGroup">
            <input formControlName="name" />
          </ng-container>
          test
        </ng-container>
        <app-sidebar-host />
      `,
      imports: [TeleportDirective, SidebarHostComponent, ReactiveFormsModule],
    })
    class SourceComponent {
      formGroup = new FormGroup({ name: new FormControl('initial') });
    }

    const createComponent = createComponentFactory({
      component: SourceComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should render teleported content containing a formGroup', () => {
      const spectator = createComponent();
      // The outlet is inside SidebarHostComponent, not SourceComponent's own template,
      // so text/input appearing there proves the view crossed the component boundary.
      expect(spectator.query('app-sidebar-host')).toHaveText('test');
      expect(spectator.query('app-sidebar-host input')).toExist();
    });

    it('should reflect the initial form control value in the teleported input', () => {
      const spectator = createComponent();
      const input = spectator.query<HTMLInputElement>('app-sidebar-host input');
      expect(input.value).toBe('initial');
    });

    it('should reflect programmatic form control value updates in the teleported input', async () => {
      const spectator = createComponent();
      spectator.component.formGroup.setValue({ name: 'updated' });
      await spectator.fixture.whenStable();
      const input = spectator.query<HTMLInputElement>('app-sidebar-host input');
      expect(input.value).toBe('updated');
    });

    it('should update the FormControl when the teleported input is changed by the user', async () => {
      const spectator = createComponent();
      const input = spectator.query<HTMLInputElement>('app-sidebar-host input');
      // Simulate user typing — the value accessor inside the teleported view must
      // still dispatch back to the original FormControl via ControlContainer.
      spectator.typeInElement('typed', input);
      await spectator.fixture.whenStable();
      expect(spectator.component.formGroup.value).toEqual({ name: 'typed' });
    });
  });

  describe('Multiple outlets registered before teleportTo subscribes', () => {
    // Regression: BehaviorSubject replays only the last emitted outlet name, so when
    // two outlets are registered ('title' and 'actions'), a teleportTo for 'title'
    // would never receive the outlet because 'actions' was emitted last.
    // The fix (startWith) ensures each subscription immediately checks current ports.
    @Component({
      selector: 'app-shell',
      template: `
        <header><ng-container teleportOutlet="title"></ng-container></header>
        <nav><ng-container teleportOutlet="actions"></ng-container></nav>
        <ng-content />
      `,
      imports: [TeleportOutletDirective],
    })
    class ShellComponent {}

    @Component({
      template: `
        <app-shell>
          <span *teleportTo="'title'">page title</span>
          <span *teleportTo="'actions'">page actions</span>
        </app-shell>
      `,
      imports: [ShellComponent, TeleportDirective],
    })
    class PageComponent {}

    const createComponent = createComponentFactory({
      component: PageComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should render content in both outlets even though they were registered before teleportTo subscribed', () => {
      const spectator = createComponent();
      expect(spectator.query('header')).toHaveText('page title');
      expect(spectator.query('nav')).toHaveText('page actions');
    });
  });

  describe('Multiple sources teleporting to the same outlet', () => {
    @Component({
      template: `
        <div *teleportTo="'shared'">first</div>
        <div *teleportTo="'shared'">second</div>
        <section>
          <ng-container teleportOutlet="shared"></ng-container>
        </section>
      `,
      imports: [TeleportDirective, TeleportOutletDirective],
    })
    class TestComponent {}

    const createComponent = createComponentFactory({
      component: TestComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should render all teleported views at the same outlet', () => {
      const spectator = createComponent();
      expect(spectator.query('section')).toHaveText('first');
      expect(spectator.query('section')).toHaveText('second');
    });
  });

  describe('Outlet destroyed before source component', () => {
    // When the outlet element is conditionally removed from the DOM, the teleported
    // view should be destroyed so we don't leak detached view references.
    @Component({
      template: `
        <div *teleportTo="'conditional'">leaked?</div>
        <section>
          @if (showOutlet()) {
            <ng-container teleportOutlet="conditional"></ng-container>
          }
        </section>
      `,
      imports: [TeleportDirective, TeleportOutletDirective],
    })
    class TestComponent {
      showOutlet = signal(true);
    }

    const createComponent = createComponentFactory({
      component: TestComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should render the teleported content when the outlet is present', () => {
      const spectator = createComponent();
      expect(spectator.query('section')).toHaveText('leaked?');
    });

    it('should remove teleported content when the outlet is destroyed', async () => {
      const spectator = createComponent();
      spectator.component.showOutlet.set(false);
      await spectator.fixture.whenStable();
      expect(spectator.query('section')).not.toHaveText('leaked?');
    });
  });

  describe('Dynamic teleportTo target', () => {
    // Covers the case where the target outlet name changes at runtime — the content
    // should leave the old outlet and appear at the new one without duplication.
    @Component({
      template: `
        <div *teleportTo="target()">content</div>
        <section id="a"><ng-container teleportOutlet="a"></ng-container></section>
        <section id="b"><ng-container teleportOutlet="b"></ng-container></section>
      `,
      imports: [TeleportDirective, TeleportOutletDirective],
    })
    class TestComponent {
      target = signal<string>('a');
    }

    const createComponent = createComponentFactory({
      component: TestComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should initially render at the first target', () => {
      const spectator = createComponent();
      expect(spectator.query('#a')).toHaveText('content');
      expect(spectator.query('#b')).not.toHaveText('content');
    });

    it('should move content to the new target when teleportTo changes', async () => {
      const spectator = createComponent();
      spectator.component.target.set('b');
      await spectator.fixture.whenStable();
      expect(spectator.query('#a')).not.toHaveText('content');
      expect(spectator.query('#b')).toHaveText('content');
    });
  });

  describe('Asynchronous behavior', () => {
    @Component({
      selector: 'app-hello',
      template: '<div>Some view</div>',
      standalone: true,
    })
    class HelloComponent implements OnInit, OnDestroy {
      ngOnInit(): void {}
      ngOnDestroy(): void {}
    }

    @Component({
      template: `
        <app-hello *teleportTo="teleportTo()"></app-hello>
        <section>
          <ng-template [teleportOutlet]="teleportTo()"></ng-template>
        </section>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [HelloComponent, TeleportDirective, TeleportOutletDirective],
    })
    class AsynchronousTestComponent {
      teleportTo = signal<string | null>(null);

      async setTeleportToAsynchronously(): Promise<void> {
        await Promise.resolve();
        this.teleportTo.set('projectHere');
      }
    }

    const createComponent = createComponentFactory({
      component: AsynchronousTestComponent,
      providers: [provideZonelessChangeDetection()],
    });

    it('should render the view as sibling to the given outlet asynchronously', async () => {
      // Arrange
      const spectator = createComponent();
      // Act
      const ngOnInitSpy = spyOn(HelloComponent.prototype, 'ngOnInit').and.callThrough();
      const ngOnDestroySpy = spyOn(HelloComponent.prototype, 'ngOnDestroy').and.callThrough();
      await spectator.component.setTeleportToAsynchronously();
      await spectator.fixture.whenStable();
      // Assert
      expect(spectator.query('app-hello')).toExist();
      expect(spectator.query('app-hello')).toContainText('Some view');
      spectator.fixture.destroy();
      expect(ngOnInitSpy).toHaveBeenCalled();
      expect(ngOnDestroySpy).toHaveBeenCalled();
    });
  });
});
