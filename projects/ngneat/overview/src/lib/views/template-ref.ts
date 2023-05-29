import {
  ApplicationRef,
  EmbeddedViewRef,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ViewRef } from './types';

interface Args<C> {
  tpl: TemplateRef<C>;
  context: C;
  vcr: ViewContainerRef | undefined;
  appRef: ApplicationRef | undefined;
  injector: Injector | undefined;
}

export class TplRef<C> implements ViewRef {
  ref: EmbeddedViewRef<{}>;
  private element: Element;

  constructor(private args: Args<C>) {
    if (this.args.vcr) {
      this.ref = this.args.vcr.createEmbeddedView(this.args.tpl, this.args.context || {}, { injector: args.injector });
      this.ref.detectChanges();
    } else {
      this.ref = this.args.tpl.createEmbeddedView(this.args.context || ({} as C), args.injector);
      this.ref.detectChanges();
      this.args.appRef.attachView(this.ref);
    }
  }

  detectChanges() {
    this.ref.detectChanges();
  }

  getElement(): Element {
    const rootNodes = this.ref.rootNodes;
    if (rootNodes.length === 1 && rootNodes[0] === Node.ELEMENT_NODE) {
      this.element = rootNodes[0];
    } else {
      this.element = document.createElement('div');
      this.element.append(...rootNodes);
    }

    return this.element;
  }

  destroy() {
    if (this.ref.rootNodes[0] !== 1) {
      this.element?.parentNode.removeChild(this.element);
      this.element = null;
    }

    if (!this.args.vcr) {
      this.args.appRef.detachView(this.ref);
    }

    this.ref.destroy();
    this.ref = null;
  }

  updateContext(context: C) {
    this.ref.context = context;
    this.detectChanges();
  }
}
