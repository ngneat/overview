import { Component, TemplateRef, ViewChild } from '@angular/core';
import { createComponentFactory, createHostFactory, Spectator, SpectatorHost } from '@ngneat/spectator';
import { Content } from '../views/types';
import { DynamicContentComponent } from './dynamic-content.component';

@Component({
  template: '',
})
class ComponentWTemplateRef {
  @ViewChild(TemplateRef, { static: true }) temp: TemplateRef<any>;
}
@Component({
  template: '<div>Something here</div>',
})
class TestComponent {}

describe('DynamicContentComponent', () => {
  let spectator: Spectator<DynamicContentComponent>;
  const createComponent = createComponentFactory(DynamicContentComponent);

  beforeEach(() => (spectator = createComponent()));

  it('should create a component with html', () => {
    const content: Content = '<b>Hello World</b>';
    spectator.setInput('content', content);
    expect(spectator.query('div').innerHTML).toBe(content);
  });

  it('should create a component with component', () => {
    const content: Content = TestComponent;
    spectator.setInput('content', content);
    expect(spectator.query('div').innerHTML).toBe('Something here');
  });
});

describe('DynamicContentComponent with template', () => {
  let spectator: SpectatorHost<DynamicContentComponent, ComponentWTemplateRef>;
  const createHost = createHostFactory({ component: DynamicContentComponent, host: ComponentWTemplateRef });

  it('should create a component with template', () => {
    spectator = createHost(
      `<ng-template #temp><div>Something here</div></ng-template>
    <dynamic-content [content]="temp"></dynamic-content>`
    );
    expect(spectator.query('div').innerHTML).toBe('Something here');
  });
});
