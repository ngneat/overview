import {
  ApplicationRef,
  ComponentRef, createComponent,  EnvironmentInjector,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ExcludeFunctions, ViewRef } from './types';

interface Options<C> {
  component: Type<C>;
  injector: Injector;
  environmentInjector: EnvironmentInjector;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
}

export class CompRef<T> implements ViewRef {
  ref: ComponentRef<T>;

  constructor(private options: Options<T>) {
    if (options.vcr) {
      this.ref = options.vcr.createComponent(options.component, {
        index: options.vcr.length,
        injector: options.injector || options.vcr.injector,
      });
    } else {
      this.ref = createComponent<T>(options.component, {
        elementInjector: options.injector,
        environmentInjector: options.environmentInjector
      });
      options.appRef.attachView(this.ref.hostView);
    }
  }

  setInput<K extends keyof ExcludeFunctions<T>>(input: K, value: T[K]) {
    this.ref.instance[input] = value;

    return this;
  }

  setInputs(inputs: Partial<ExcludeFunctions<T>>) {
    Object.keys(inputs).forEach((input) => {
      this.ref.instance[input] = inputs[input];
    });

    return this;
  }

  detectChanges() {
    this.ref.hostView.detectChanges();
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
