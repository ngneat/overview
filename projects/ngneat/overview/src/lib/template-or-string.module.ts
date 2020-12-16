import { Directive, Input, NgModule, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[templateOrString]',
})
export class TemplateOrStringDirective implements OnInit {
  @Input() set lmgTemplateOrStringContext(context: unknown) {
    this.context = context;
  }

  @Input('templateOrString') content: string | TemplateRef<any>;

  private context: unknown;

  constructor(private defaultTpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnInit() {
    const template = this.content instanceof TemplateRef ? this.content : this.defaultTpl;
    this.vcr.createEmbeddedView(template, this.context);
  }
}

@NgModule({
  declarations: [TemplateOrStringDirective],
  exports: [TemplateOrStringDirective],
})
export class TemplateOrStringDirectiveModule {}
