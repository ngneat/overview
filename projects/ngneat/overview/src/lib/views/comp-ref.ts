import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ExcludeFunctions, ViewRef } from './types';

interface Options<C> {
  component: Type<C>;
  injector: Injector;
  resolver: ComponentFactoryResolver;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
}

export class CompRef<T> implements ViewRef {
  private compRef: ComponentRef<T>;

  constructor(private options: Options<T>) {
    if (options.vcr) {
      this.compRef = options.vcr.createComponent(options.component, {
        index: options.vcr.length,
        injector: options.injector || options.vcr.injector,
      });
    } else {
      const factory = options.resolver.resolveComponentFactory<T>(options.component);
      this.compRef = factory.create(options.injector);
      options.appRef.attachView(this.compRef.hostView);
    }
  }

  get ref() {
    return this.compRef;
  }

  setInput<K extends keyof ExcludeFunctions<T>>(input: K, value: T[K]) {
    this.compRef.instance[input] = value;

    return this;
  }

  setInputs(inputs: Partial<ExcludeFunctions<T>>) {
    Object.keys(inputs).forEach((input) => {
      this.compRef.instance[input] = inputs[input];
    });

    return this;
  }

  detectChanges() {
    this.compRef.hostView.detectChanges();
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
    return this.compRef.location.nativeElement;
  }

  destroy() {
    this.compRef.destroy();
    !this.options.vcr && this.options.appRef.detachView(this.compRef.hostView);
    this.compRef = null;
  }
}
