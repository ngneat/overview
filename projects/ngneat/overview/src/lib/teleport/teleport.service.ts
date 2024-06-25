import { Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeleportService {
  private outlets = new BehaviorSubject<string>('');
  private asObservable = this.outlets.asObservable();

  outlet$(name: string) {
    return this.asObservable.pipe(
      filter((current) => current === name),
      map((name) => this.ports.get(name))
    );
  }

  ports = new Map<string, ViewContainerRef>();

  newOutlet(name: string) {
    this.outlets.next(name);
  }
}
