import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, effect, inject, input } from '@angular/core';
import { Subscription } from 'rxjs';

import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportTo]',
  standalone: true,
})
export class TeleportDirective implements OnDestroy {
  readonly teleportTo = input<string | null | undefined>();

  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | null = null;

  private tpl = inject(TemplateRef);
  private service = inject(TeleportService);

  constructor() {
    effect(() => {
      const teleportTo = this.teleportTo();

      if (typeof teleportTo === 'string') {
        this.dispose();

        this.subscription = this.service.outlet$(teleportTo).subscribe((outlet) => {
          if (outlet) {
            this.viewRef = outlet.createEmbeddedView(this.tpl);
          }
        });
      }
    });
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
