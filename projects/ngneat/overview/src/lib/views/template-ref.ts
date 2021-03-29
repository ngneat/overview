import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ViewRef } from './types';

interface Args<C> {
  tpl: TemplateRef<C>;
  context: C;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
}

export class TplRef<C> implements ViewRef {
  private viewRef: EmbeddedViewRef<{}>;
  private element: Element;
  private wrapper: Element | null = null;

  constructor(private args: Args<C>) {
    if (this.args.vcr) {
      this.viewRef = this.args.vcr.createEmbeddedView(this.args.tpl, this.args.context || {});
      this.viewRef.detectChanges();
    } else {
      this.viewRef = this.args.tpl.createEmbeddedView(this.args.context || ({} as C));
      this.viewRef.detectChanges();
      this.args.appRef.attachView(this.viewRef);
    }
  }

  detectChanges() {
    this.viewRef.detectChanges();
  }

  getElement(): Element {
    const rootNodes = this.viewRef.rootNodes;
    if (rootNodes.length === 1 && rootNodes[0] === Node.ELEMENT_NODE) {
      this.element = rootNodes[0];
    } else {
      this.element = document.createElement('div');
      this.element.append(...rootNodes);
    }

    return this.element;
  }

  destroy() {
    if (this.viewRef.rootNodes[0] !== 1) {
      this.element?.parentNode.removeChild(this.element);
      this.element = null;
    }

    if (!this.args.vcr) {
      this.args.appRef.detachView(this.viewRef);
    }

    this.viewRef.destroy();
    this.viewRef = null;
  }
}
