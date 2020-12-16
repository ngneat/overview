import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  NgZone,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
interface View {
  getElement(): Element | string;

  destroy(): void;
}

class TemplateView implements View {
  private viewRef: EmbeddedViewRef<{}>;
  private element: Element;

  private wrapper: Element | null = null;

  constructor(private appRef: ApplicationRef, private vcr: ViewContainerRef, tpl: TemplateRef<{}>) {
    if (vcr) {
      this.viewRef = vcr.createEmbeddedView(tpl, {});
    } else {
      this.viewRef = tpl.createEmbeddedView({});
      this.viewRef.detectChanges();
      this.appRef.attachView(this.viewRef);
    }
  }

  destroy() {
    if (this.wrapper !== null) {
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
    }

    if (!this.vcr) {
      this.appRef.detachView(this.viewRef);
    }

    this.viewRef.destroy();
  }

  getElement(): Element {
    if (this.viewRef.rootNodes.length === 1) {
      this.element = this.viewRef.rootNodes[0];
    } else {
      this.wrapper = document.createElement('div');
      // The `node` might be an instance of the `Comment` class,
      // which is an `ng-container` element. We shouldn't filter it
      // out since there can be `ngIf` or any other directive bound
      // to the `ng-container`.
      this.wrapper.append(...this.viewRef.rootNodes);
      this.element = this.wrapper;
    }

    return this.element;
  }
}

class ComponentView<T> implements View {
  private compRef: ComponentRef<T>;

  constructor(
    component: Type<T>,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private vcr: ViewContainerRef,
    private appRef: ApplicationRef
  ) {
    const factory = this.resolver.resolveComponentFactory(component);
    if (vcr) {
      this.compRef = this.vcr.createComponent(factory);
    } else {
      this.compRef = factory.create(injector);
      appRef.attachView(this.compRef.hostView);
      this.compRef.hostView.detectChanges();
    }
  }

  destroy() {
    this.compRef.destroy();
    !this.vcr && this.appRef.detachView(this.compRef.hostView);
    this.compRef = null;
  }

  getElement(): Element {
    return this.compRef.location.nativeElement;
  }
}

class StrView implements View {
  constructor(private str: string) {}

  destroy() {}

  getElement(): string {
    return this.str;
  }
}

function resolveView(content: Content) {
  let view: View;
  if (content instanceof TemplateRef) {
    view = new TemplateView(this.appRef, options.vcr, content);
  } else if (typeof content === 'function') {
    view = new ComponentView(content, this.resolver, options.injector || this.injector, options.vcr, this.appRef);
  } else if (typeof content === 'string') {
    view = new StrView(content);
  } else {
    throw 'Type of content is not supported';
  }

  return view;
}

export type Content = string | TemplateRef<any> | Type<any>;
