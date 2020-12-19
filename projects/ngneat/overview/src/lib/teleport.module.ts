import { Directive, EmbeddedViewRef, Input, NgModule, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TeleportService } from './teleport.service';
import { TeleportOutletDirective } from './portal-outlet.directive';

@Directive({
  selector: '[teleportTo]',
})
export class TeleportDirective implements OnInit, OnDestroy {
  @Input() teleportTo: string;
  private viewRef: EmbeddedViewRef<any>;

  constructor(private tpl: TemplateRef<any>, private service: TeleportService) {}

  ngOnInit() {
    const outlet = this.service.ports.get(this.teleportTo);
    if (outlet) {
      this.viewRef = outlet.createEmbeddedView(this.tpl);
    }
  }

  ngOnDestroy() {
    this.viewRef?.destroy();
  }
}

@NgModule({
  declarations: [TeleportDirective, TeleportOutletDirective],
  exports: [TeleportDirective, TeleportOutletDirective],
})
export class TeleportModule {}
