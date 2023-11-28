import {
  Directive,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Content, isComponent, isString, ViewRef } from '../views/types';
import { ViewService } from '../views/view';
import { CompRef } from '../views/comp-ref';
import { DynamicViewComponent } from './dynamic-view.component';

@Directive({
  selector: '[dynamicView]',
  standalone: true,
})
export class DynamicViewDirective implements OnInit, OnChanges, OnDestroy {
  @Input('dynamicView') view: Content;
  @Input('dynamicViewInjector') injector: Injector;
  @Input('dynamicViewContext') context: any;
  @Input('dynamicViewInputs') inputs: Record<any, any>;

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
      this.viewRef.updateContext(this.context);
    } else if (isComponent(this.view) && inputsChanged) {
      (this.viewRef as CompRef<any>).setInputs(this.inputs || {});
    }
  }

  resolveContentType() {
    this.viewRef?.destroy();
    if (isString(this.view)) {
      this.viewRef = this.viewService.createComponent(DynamicViewComponent, {
        vcr: this.vcr,
        injector: this.injector,
      });
      (this.viewRef as CompRef<DynamicViewComponent>).setInput('content', this.view).detectChanges();
    } else if (isComponent(this.view)) {
      this.viewRef = this.viewService.createComponent(this.view, {
        vcr: this.vcr,
        injector: this.injector ?? this.vcr.injector,
        context: this.context,
      });

      if (this.inputs) {
        (this.viewRef as CompRef<any>).setInputs(this.inputs);
      }
    } else {
      this.viewRef = this.viewService.createView(this.view || this.defaultTpl, {
        vcr: this.vcr,
        injector: this.injector ?? this.vcr.injector,
        context: this.context,
      });
    }
  }

  ngOnDestroy() {
    this.viewRef?.destroy();
  }
}
