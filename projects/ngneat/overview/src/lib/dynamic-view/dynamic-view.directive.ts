import {
  Directive,
  Injector,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Content, isComponent, isString, ViewRef } from '../views/types';
import { ViewService } from '../views/view';
import { CompRef } from '../views/comp-ref';
import { DynamicViewComponent } from './dynamic-view.component';

@Directive({
  selector: '[dynamicView]',
})
export class DynamicViewDirective implements OnInit, OnChanges, OnDestroy {
  @Input('dynamicView') view: Content;
  @Input('dynamicViewInjector') injector: Injector;
  @Input('dynamicViewContext') context: any;
  @Input('dynamicViewInputs') inputs: Record<any, any>;

  private viewRef: ViewRef;

  constructor(private defaultTpl: TemplateRef<any>, private vcr: ViewContainerRef, private viewService: ViewService) {}

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
    } else if (inputsChanged) {
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

@NgModule({
  declarations: [DynamicViewDirective, DynamicViewComponent],
  exports: [DynamicViewDirective],
})
export class DynamicViewModule {}
