import { Directive, EmbeddedViewRef, TemplateRef, effect, inject, model } from '@angular/core';
import { Subscription } from 'rxjs';

import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportTo]',
})
export class TeleportDirective {
  readonly teleportTo = model<string | null | undefined>();

  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | null = null;

  private tpl = inject(TemplateRef);
  private service = inject(TeleportService);

  constructor() {
    effect(() => {
      const teleportTo = this.teleportTo();

      if (!!teleportTo) {
        this.dispose();

        this.subscription = this.service.outlet$(teleportTo).subscribe((outlet) => {
          if (outlet) {
            this.viewRef = outlet.createEmbeddedView(this.tpl);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.dispose();
  }

  private dispose(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.viewRef?.destroy();
  }
}
