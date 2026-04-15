import {
  Component,
  Directive,
  EventEmitter,
  input,
  Input,
  model,
  OnInit,
  Output,
  provideZonelessChangeDetection,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  inputBinding,
  outputBinding,
  twoWayBinding,
} from '@angular/core';
import { createComponentFactory, createServiceFactory } from '@ngneat/spectator';
import { ViewService } from './view';

// ─── Test fixtures ────────────────────────────────────────────────────────────

@Component({
  selector: 'app-greet',
  template: '{{ name() }} {{ age() }}',
})
class GreetComponent {
  name = input('');
  age = input(0);
}

@Component({
  selector: 'app-emitter',
  template: '',
})
class EmitterComponent implements OnInit {
  @Input() triggerOnInit = false;
  @Output() greet = new EventEmitter<string>();

  ngOnInit() {
    if (this.triggerOnInit) {
      this.greet.emit('hello');
    }
  }
}

@Component({
  selector: 'app-two-way',
  template: '{{ value() }}',
})
class TwoWayComponent {
  value = model('');
}

@Directive({
  selector: '[appMark]',
  host: { 'data-marked': 'true' },
})
class MarkDirective {}

// Host component used when a real ViewContainerRef is needed
@Component({
  template: '<ng-container #anchor></ng-container>',
})
class HostComponent {
  @ViewChild('anchor', { read: ViewContainerRef }) vcr!: ViewContainerRef;
}

// ─── ViewService (no VCR) ────────────────────────────────────────────────────

describe('ViewService — bindings (no VCR)', () => {
  const createService = createServiceFactory({
    service: ViewService,
    providers: [provideZonelessChangeDetection()],
  });

  it('inputBinding sets the input value at creation time', () => {
    const spectator = createService();
    const ref = spectator.service.createComponent(GreetComponent, {
      bindings: [inputBinding('name', () => 'Alice')],
    });

    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toBe('Alice 0');

    ref.destroy();
  });

  it('inputBinding getter is reactive — changing the captured signal updates the view', () => {
    const spectator = createService();
    const name = signal('Alice');

    const ref = spectator.service.createComponent(GreetComponent, {
      bindings: [inputBinding('name', () => name())],
    });

    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toContain('Alice');

    name.set('Bob');
    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toContain('Bob');

    ref.destroy();
  });

  it('multiple inputBindings are all applied', () => {
    const spectator = createService();
    const ref = spectator.service.createComponent(GreetComponent, {
      bindings: [inputBinding('name', () => 'Carol'), inputBinding('age', () => 30)],
    });

    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toBe('Carol 30');

    ref.destroy();
  });

  it('outputBinding wires up an output listener', () => {
    const spectator = createService();
    const received: string[] = [];

    const ref = spectator.service.createComponent(EmitterComponent, {
      bindings: [
        inputBinding('triggerOnInit', () => true),
        outputBinding<string>('greet', (value) => received.push(value)),
      ],
    });

    ref.detectChanges();
    expect(received).toEqual(['hello']);

    ref.destroy();
  });

  it('twoWayBinding reads from and writes to a WritableSignal', () => {
    const spectator = createService();
    const value: WritableSignal<string> = signal('initial');

    const ref = spectator.service.createComponent(TwoWayComponent, {
      bindings: [twoWayBinding('value', value as WritableSignal<unknown>)],
    });

    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toBe('initial');

    ref.destroy();
  });

  it('directives option attaches a directive to the component host', () => {
    const spectator = createService();

    const ref = spectator.service.createComponent(GreetComponent, {
      directives: [MarkDirective],
    });

    ref.detectChanges();
    expect(ref.getElement().getAttribute('data-marked')).toBe('true');

    ref.destroy();
  });

  it('bindings and directives can be combined', () => {
    const spectator = createService();

    const ref = spectator.service.createComponent(GreetComponent, {
      bindings: [inputBinding('name', () => 'Dave')],
      directives: [MarkDirective],
    });

    ref.detectChanges();
    expect(ref.getElement().textContent?.trim()).toContain('Dave');
    expect(ref.getElement().getAttribute('data-marked')).toBe('true');

    ref.destroy();
  });
});

// ─── ViewService (with VCR) ───────────────────────────────────────────────────

describe('ViewService — bindings (with VCR)', () => {
  const createHost = createComponentFactory({
    component: HostComponent,
    providers: [provideZonelessChangeDetection()],
  });

  it('inputBinding sets the input value when using a ViewContainerRef', () => {
    const spectator = createHost();
    const vcr = spectator.component.vcr;
    const service = spectator.inject(ViewService);

    const ref = service.createComponent(GreetComponent, {
      vcr,
      bindings: [inputBinding('name', () => 'Eve')],
    });

    spectator.detectChanges();
    expect(spectator.element.textContent?.trim()).toContain('Eve');

    ref.destroy();
  });

  it('outputBinding wires up an output listener when using a ViewContainerRef', () => {
    const spectator = createHost();
    const vcr = spectator.component.vcr;
    const service = spectator.inject(ViewService);
    const received: string[] = [];

    const ref = service.createComponent(EmitterComponent, {
      vcr,
      bindings: [
        inputBinding('triggerOnInit', () => true),
        outputBinding<string>('greet', (value) => received.push(value)),
      ],
    });

    spectator.detectChanges();
    expect(received).toEqual(['hello']);

    ref.destroy();
  });

  it('directives option attaches a directive when using a ViewContainerRef', () => {
    const spectator = createHost();
    const vcr = spectator.component.vcr;
    const service = spectator.inject(ViewService);

    const ref = service.createComponent(GreetComponent, {
      vcr,
      directives: [MarkDirective],
    });

    spectator.detectChanges();
    expect(ref.getElement().getAttribute('data-marked')).toBe('true');

    ref.destroy();
  });
});
