import {
  ApplicationRef,
  type Binding,
  ComponentRef,
  createComponent,
  type DirectiveWithBindings,
  EnvironmentInjector,
  Injector,
  Type,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { ExcludeFunctions, ExtractInputTypes, InferInputSignalType, ViewRef } from './types';

interface Options<Comp, Context> {
  component: Type<Comp>;
  injector: Injector;
  environmentInjector: EnvironmentInjector;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
  contextSignal?: WritableSignal<Context>;
  bindings?: Binding[];
  directives?: (Type<unknown> | DirectiveWithBindings<unknown>)[];
}

export class CompRef<Comp, Context = any> implements ViewRef {
  ref: ComponentRef<Comp>;

  constructor(private options: Options<Comp, Context>) {
    if (options.vcr) {
      // Creating through a ViewContainerRef inserts the component into the existing
      // Angular view tree, so it participates in the host's change detection naturally.
      this.ref = options.vcr.createComponent(options.component, {
        index: options.vcr.length,
        injector: options.injector || options.vcr.injector,
        bindings: options.bindings,
        directives: options.directives,
      });
    } else {
      // Without a ViewContainerRef the component is created detached from any view tree.
      // Attaching to ApplicationRef keeps it inside Angular's change detection cycle so
      // it still updates — otherwise the view would be permanently stale.
      this.ref = createComponent<Comp>(options.component, {
        elementInjector: options.injector,
        environmentInjector: options.environmentInjector,
        bindings: options.bindings,
        directives: options.directives,
      });
      options.appRef.attachView(this.ref.hostView);
    }
  }

  setInput<K extends keyof ExcludeFunctions<Comp>>(input: K, value: InferInputSignalType<Comp[K]>) {
    this.ref.setInput(input as string, value);

    return this;
  }

  setInputs(inputs: Partial<ExtractInputTypes<ExcludeFunctions<Comp>>>) {
    Object.keys(inputs).forEach((input) => {
      this.ref.setInput(input, inputs[input]);
    });

    return this;
  }

  detectChanges() {
    this.ref.hostView.detectChanges();

    return this;
  }

  updateContext(context: Context) {
    // Context is held in a signal so the component can react to updates reactively
    // without requiring an explicit change detection call from the outside.
    this.options.contextSignal?.set(context);

    return this;
  }

  appendTo(container: Element) {
    container.appendChild(this.getElement());

    return this;
  }

  removeFrom(container: Element) {
    container.removeChild(this.getElement());

    return this;
  }

  getRawContent() {
    return this.getElement().outerHTML;
  }

  getElement<T extends Element>(): T {
    return this.ref.location.nativeElement;
  }

  destroy() {
    this.ref.destroy();
    // When there's no ViewContainerRef we manually attached to ApplicationRef,
    // so we must also manually detach — otherwise Angular keeps running change
    // detection on a destroyed view, causing errors.
    !this.options.vcr && this.options.appRef.detachView(this.ref.hostView);
    this.ref = null;
  }
}
