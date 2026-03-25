import { Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeleportService {
  private outlets = new BehaviorSubject<string>('');

  outlet$(name: string) {
    return this.outlets.pipe(
      // Immediately check current ports on subscription so that a teleportTo
      // registered after its outlet doesn't miss the already-emitted newOutlet event.
      // Without this, BehaviorSubject only replays one name, so only the last
      // registered outlet is visible to new subscribers.
      startWith(name),
      filter((current) => current === name),
      map((name) => this.ports.get(name))
    );
  }

  ports = new Map<string, ViewContainerRef>();

  newOutlet(name: string) {
    this.outlets.next(name);
  }
}
