import { Directive, OnDestroy, ViewContainerRef, effect, inject, input } from '@angular/core';
import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportOutlet]',
})
export class TeleportOutletDirective {
  readonly teleportOutlet = input<string | null | undefined>();
  private vcr = inject(ViewContainerRef);
  private service = inject(TeleportService);

  constructor() {
    effect(() => {
      const teleportOutlet = this.teleportOutlet();
      if (teleportOutlet) {
        this.service.ports.set(teleportOutlet, this.vcr);
        this.service.newOutlet(teleportOutlet);
      }
    });
  }

  ngOnDestroy() {
    this.service.ports.delete(this.teleportOutlet());
  }
}
