import { Directive, Injector, Input, NgModule, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Content, ViewRef, isString } from '../views/types';
import { ViewService } from '../views/view';
import { CompRef } from '../views/comp-ref';
import { DynamicViewComponent } from './dynamic-view.component';

@Directive({
  selector: '[dynamicView]',
})
export class DynamicViewDirective implements OnInit, OnDestroy {
  @Input('dynamicView') view: Content;
  @Input('dynamicViewInjector') injector: Injector;
  @Input('dynamicViewContext') context: any;

  private viewRef: ViewRef;

  constructor(private defaultTpl: TemplateRef<any>, private vcr: ViewContainerRef, private viewService: ViewService) {}

  ngOnInit() {
    if (isString(this.view)) {
      this.viewRef = this.viewService.createComponent(DynamicViewComponent, {
        vcr: this.vcr,
        injector: this.injector,
      });
      (this.viewRef as CompRef<DynamicViewComponent>).setInput('content', this.view).detectChanges();
    } else {
      this.viewRef = this.viewService.createView(this.view || this.defaultTpl, {
        vcr: this.vcr,
        injector: this.injector,
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
