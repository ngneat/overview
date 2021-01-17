import { Directive, EmbeddedViewRef, Input, NgModule, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TeleportService } from './teleport.service';
import { TeleportOutletDirective } from './teleport-outlet.directive';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[teleportTo]',
})
export class TeleportDirective implements OnInit, OnDestroy {
  @Input() teleportTo: string;
  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | undefined;

  constructor(private tpl: TemplateRef<any>, private service: TeleportService) {}

  ngOnInit() {
    this.subscription = this.service.outlet$(this.teleportTo).subscribe((outlet) => {
      if(outlet) {
        this.viewRef = outlet.createEmbeddedView(this.tpl);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.viewRef?.destroy();
  }
}

@NgModule({
  declarations: [TeleportDirective, TeleportOutletDirective],
  exports: [TeleportDirective, TeleportOutletDirective],
})
export class TeleportModule {}
