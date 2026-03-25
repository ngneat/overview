import { ApplicationRef, EmbeddedViewRef, Injector, TemplateRef, ViewContainerRef } from '@angular/core';
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
      // Creating through a ViewContainerRef inserts the view into the Angular view tree,
      // giving it automatic change detection via its host component's cycle.
      this.ref = this.args.vcr.createEmbeddedView(this.args.tpl, this.args.context || {}, { injector: args.injector });
      this.ref.detectChanges();
    } else {
      // Without a ViewContainerRef the view sits outside the component tree, so we attach
      // it to ApplicationRef to keep it inside Angular's change detection — then trigger
      // an initial check since no parent cycle will do it for us.
      this.ref = this.args.tpl.createEmbeddedView(this.args.context || ({} as C), args.injector);
      this.ref.detectChanges();
      this.args.appRef.attachView(this.ref);
    }
  }

  detectChanges() {
    this.ref.detectChanges();

    return this;
  }

  getElement(): Element {
    const rootNodes = this.ref.rootNodes;
    if (rootNodes.length === 1 && rootNodes[0] === Node.ELEMENT_NODE) {
      this.element = rootNodes[0];
    } else {
      // Templates can project multiple root nodes (e.g. siblings or ng-container contents).
      // Wrapping them ensures callers always receive a single element they can append,
      // remove, or measure without handling multi-root edge cases themselves.
      this.element = document.createElement('div');
      this.element.append(...rootNodes);
    }

    return this.element;
  }

  destroy() {
    if (this.ref.rootNodes[0] !== 1) {
      // Only remove the wrapper element from the DOM if it was actually inserted there.
      // Skipping this for VCR-managed views avoids double-removal, since Angular tears
      // those down through the view tree itself.
      this.element?.parentNode.removeChild(this.element);
      this.element = null;
    }

    if (!this.args.vcr) {
      // Mirror the manual attachView from construction — Angular won't clean this up
      // on its own for views that live outside the component tree.
      this.args.appRef.detachView(this.ref);
    }

    this.ref.destroy();
    this.ref = null;
  }

  updateContext(context: C) {
    // Mutating the existing context object (rather than replacing it) preserves
    // any template variable bindings that already hold a reference to the context.
    Object.assign(this.ref.context, context);

    return this;
  }
}
