import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ExcludeFunctions, ViewRef } from './types';

interface Args<C> {
  component: Type<C>;
  injector: Injector;
  resolver: ComponentFactoryResolver;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
}

export class CompRef<T> implements ViewRef {
  private compRef: ComponentRef<T>;

  constructor(private args: Args<T>) {
    const factory = this.args.resolver.resolveComponentFactory<T>(this.args.component);
    if (this.args.vcr) {
      this.compRef = this.args.vcr.createComponent(
        factory,
        this.args.vcr.length,
        args.injector || this.args.vcr.injector
      );
    } else {
      this.compRef = factory.create(this.args.injector);
      this.args.appRef.attachView(this.compRef.hostView);
    }
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
    !this.args.vcr && this.args.appRef.detachView(this.compRef.hostView);
    this.compRef = null;
  }
}
