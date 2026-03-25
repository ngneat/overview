import { Directive, type EmbeddedViewRef, TemplateRef, effect, inject, model, untracked } from '@angular/core';

import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportTo]',
})
export class TeleportDirective {
  readonly teleportTo = model<string | null | undefined>();

  private viewRef: EmbeddedViewRef<any> | null = null;

  private tpl = inject(TemplateRef);
  private service = inject(TeleportService);

  constructor() {
    effect((onCleanup) => {
      const teleportTo = this.teleportTo();
      if (!teleportTo) return;

      // outlet$() emits immediately if the outlet is already registered, or
      // waits for it to appear — covering both sync and async outlet creation.
      const subscription = this.service.outlet$(teleportTo).subscribe((outlet) => {
        if (!outlet) return;

        // untracked() prevents signals read during view creation (e.g. in the
        // teleported template's directives) from being tracked as dependencies
        // of this effect, which would cause spurious re-runs and view recreation.
        this.viewRef = untracked(() => {
          return outlet.createEmbeddedView(this.tpl);
        });
      });

      // onCleanup runs before the next effect execution and on directive destroy,
      // ensuring the subscription and the remote view are always released together.
      onCleanup(() => {
        subscription.unsubscribe();
        this.viewRef?.destroy();
        this.viewRef = null;
      });
    });
  }
}
