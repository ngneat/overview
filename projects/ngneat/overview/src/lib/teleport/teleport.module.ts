import {
  Directive,
  EmbeddedViewRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TeleportService } from './teleport.service';
import { TeleportOutletDirective } from './teleport-outlet.directive';

@Directive({
  selector: '[teleportTo]',
})
export class TeleportDirective implements OnChanges, OnDestroy {
  @Input() teleportTo: string | null | undefined;

  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | null = null;

  constructor(private tpl: TemplateRef<any>, private service: TeleportService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.teleportTo && typeof this.teleportTo === 'string') {
      this.dispose();

      this.subscription = this.service.outlet$(this.teleportTo).subscribe((outlet) => {
        if (outlet) {
          this.viewRef = outlet.createEmbeddedView(this.tpl);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private dispose(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.viewRef?.destroy();
  }
}

@NgModule({
  declarations: [TeleportDirective, TeleportOutletDirective],
  exports: [TeleportDirective, TeleportOutletDirective],
})
export class TeleportModule {}
