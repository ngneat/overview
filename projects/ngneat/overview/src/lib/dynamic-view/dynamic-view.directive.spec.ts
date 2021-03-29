import { Component, Inject, Injector, Optional } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { DynamicViewModule } from './dynamic-view.directive';

@Component({
  selector: 'app-hello',
  template: '{{ name }} app-hello',
})
export class HelloComponent {
  constructor(@Optional() @Inject('name') public name: string) {}
}

@Component({
  template: `
    <section id="component">
      <h5>Component</h5>
      <ng-container *dynamicView="component; injector: injector"></ng-container>
    </section>

    <section id="template">
      <h5>Template</h5>
      <ng-template #mytpl let-title
        ><b>{{ title }}</b></ng-template
      >
      <ng-container *dynamicView="mytpl; context: { $implicit: 'my title' }"></ng-container>
    </section>

    <section id="string">
      <h5>String</h5>
      <ng-container *dynamicView="'<h1>hello world</h1>'"></ng-container>
    </section>

    <section id="defaultTpl">
      <h5>Default Template</h5>
      <ng-container *dynamicView="null"> default tpl </ng-container>
    </section>
  `,
})
class TestComponent {
  component = HelloComponent;
  injector = Injector.create({
    providers: [
      {
        provide: 'name',
        useValue: 'Netanel',
      },
    ],
    parent: this.parent,
  });
  constructor(private parent: Injector) {}
}

describe('DynamicViewDirective', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    imports: [DynamicViewModule],
    component: TestComponent,
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create a view with component', () => {
    expect(spectator.query('#component').innerHTML).toContain('Netanel');
  });

  it('should create a view with template', () => {
    expect(spectator.query('#template').innerHTML).toContain('my title');
  });

  it('should create a view with string', () => {
    expect(spectator.query('#string').innerHTML).toContain('hello world');
  });

  it('should create default template', () => {
    expect(spectator.query('#defaultTpl').innerHTML).toContain('default tpl');
  });
});
