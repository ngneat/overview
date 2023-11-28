import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injector,
  Type,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { ExcludeFunctions, ViewRef } from './types';

interface Options<Comp, Context> {
  component: Type<Comp>;
  injector: Injector;
  environmentInjector: EnvironmentInjector;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
  contextSignal?: WritableSignal<Context>;
}

export class CompRef<Comp, Context = any> implements ViewRef {
  ref: ComponentRef<Comp>;

  constructor(private options: Options<Comp, Context>) {
    if (options.vcr) {
      this.ref = options.vcr.createComponent(options.component, {
        index: options.vcr.length,
        injector: options.injector || options.vcr.injector,
      });
    } else {
      this.ref = createComponent<Comp>(options.component, {
        elementInjector: options.injector,
        environmentInjector: options.environmentInjector,
      });
      options.appRef.attachView(this.ref.hostView);
    }
  }

  setInput<K extends keyof ExcludeFunctions<Comp>>(input: K, value: Comp[K]) {
    this.ref.setInput(input as string, value);

    return this;
  }

  setInputs(inputs: Partial<ExcludeFunctions<Comp>>) {
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
    !this.options.vcr && this.options.appRef.detachView(this.ref.hostView);
    this.ref = null;
  }
}
