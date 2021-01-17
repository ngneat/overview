import { Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportOutlet]',
})
export class TeleportOutletDirective implements OnInit, OnDestroy {
  @Input() teleportOutlet: string;

  constructor(private vcr: ViewContainerRef, private service: TeleportService) {}

  ngOnInit() {
    this.service.ports.set(this.teleportOutlet, this.vcr);
    this.service.newOutlet(this.teleportOutlet);
  }

  ngOnDestroy() {
    this.service.ports.delete(this.teleportOutlet);
  }
}
