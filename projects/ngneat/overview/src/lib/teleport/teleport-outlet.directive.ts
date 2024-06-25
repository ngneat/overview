import { Directive, OnDestroy, ViewContainerRef, effect, inject, input } from '@angular/core';
import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportOutlet]',
  standalone: true,
})
export class TeleportOutletDirective implements OnDestroy {
  // We could've also used the `ngAcceptInputType`, but it's being deprecated in newer Angular versions.
  readonly teleportOutlet = input<string | null | undefined>();
  private vcr = inject(ViewContainerRef);
  private service = inject(TeleportService);

  constructor() {
    effect(() => {
      const teleportOutlet = this.teleportOutlet();
      if (typeof teleportOutlet === 'string') {
        this.service.ports.set(teleportOutlet, this.vcr);
        this.service.newOutlet(teleportOutlet);
      }
    });
  }

  ngOnDestroy(): void {
    this.service.ports.delete(this.teleportOutlet());
  }
}
