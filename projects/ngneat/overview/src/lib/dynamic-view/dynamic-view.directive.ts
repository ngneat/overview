import {
  Directive,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { Content, isComponent, isString, ViewRef } from '../views/types';
import { ViewService } from '../views/view';
import { CompRef } from '../views/comp-ref';
import { DynamicViewComponent } from './dynamic-view.component';

@Directive({
  selector: '[dynamicView]',
})
export class DynamicViewDirective implements OnInit, OnChanges, OnDestroy {
  readonly view = input<Content>(undefined, { alias: 'dynamicView' });
  readonly injector = input<Injector>(undefined, { alias: 'dynamicViewInjector' });
  readonly context = input<any>(undefined, { alias: 'dynamicViewContext' });
  readonly inputs = input<Record<any, any>>(undefined, { alias: 'dynamicViewInputs' });

  private viewRef: ViewRef;
  private defaultTpl: TemplateRef<any> = inject(TemplateRef);
  private vcr = inject(ViewContainerRef);
  private viewService = inject(ViewService);

  ngOnInit() {
    this.resolveContentType();
  }

  ngOnChanges(changes: SimpleChanges) {
    const viewChanged = changes.view && !changes.view.isFirstChange();
    const contextChanged = changes.context && !changes.context.isFirstChange();
    const inputsChanged = changes.inputs && !changes.inputs.isFirstChange();

    if (viewChanged) {
      this.resolveContentType();
    } else if (contextChanged) {
      this.viewRef.updateContext(this.context());
    } else if (isComponent(this.view()) && inputsChanged) {
      (this.viewRef as CompRef<any>).setInputs(this.inputs() || {});
    }
  }

  resolveContentType() {
    this.viewRef?.destroy();

    const view = this.view();
    const injector = this.injector();
    const context = this.context();

    if (isString(view)) {
      const viewRef = (this.viewRef = this.viewService.createComponent(DynamicViewComponent, {
        vcr: this.vcr,
        injector,
      }));

      viewRef.setInput('content', view).detectChanges();
    } else if (isComponent(view)) {
      this.viewRef = this.viewService.createComponent(view, {
        vcr: this.vcr,
        injector: injector ?? this.vcr.injector,
        context,
      });

      const inputs = this.inputs();
      if (inputs) {
        (this.viewRef as CompRef<any>).setInputs(inputs);
      }
    } else {
      this.viewRef = this.viewService.createView(view || this.defaultTpl, {
        vcr: this.vcr,
        injector: injector ?? this.vcr.injector,
        context,
      });
    }
  }

  ngOnDestroy() {
    this.viewRef?.destroy();
  }
}
