import { Component } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TeleportModule } from './teleport.module';

@Component({
  template: ` <div *teleportTo="'projectHere'">Some view</div>

    <section>
      <ng-container teleportOutlet="projectHere"></ng-container>
    </section>`,
})
class TestComponent {}

describe('TeleportDirective', () => {
  let spectator: Spectator<TestComponent>;

  const createComponent = createComponentFactory({
    component: TestComponent,
    imports: [TeleportModule],
  });

  it('should render the view as sibling to the given outlet', () => {
    spectator = createComponent();
    expect(spectator.query('section')).toHaveText('Some view');
  });
});
