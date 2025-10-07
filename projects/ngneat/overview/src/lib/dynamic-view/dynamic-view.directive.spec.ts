import { Component, Inject, Injector, Optional, signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { DynamicViewDirective } from './dynamic-view.directive';

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
      <ng-container *dynamicView="str()"></ng-container>
    </section>

    <section id="defaultTpl">
      <h5>Default Template</h5>
      <ng-container *dynamicView="null"> default tpl </ng-container>
    </section>
  `,
  standalone: false,
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
  str = signal('hello world');
  constructor(private parent: Injector) {
    setTimeout(() => {
      this.str.set('hello');
    }, 3000);
  }
}

describe('DynamicViewDirective', () => {
  let spectator: Spectator<TestComponent>;
  const createComponent = createComponentFactory({
    imports: [DynamicViewDirective],
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

  it('should update a view with dynamic string', fakeAsync(() => {
    tick(3001);
    expect(spectator.query('#string').innerHTML).toContain('hello');
  }));

  it('should create default template', () => {
    expect(spectator.query('#defaultTpl').innerHTML).toContain('default tpl');
  });
});
