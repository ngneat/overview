import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TeleportService {
  ports = new Map<string, ViewContainerRef>();
}
