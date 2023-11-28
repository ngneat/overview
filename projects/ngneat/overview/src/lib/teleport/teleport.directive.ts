import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportTo]',
  standalone: true,
})
export class TeleportDirective implements OnChanges, OnDestroy {
  @Input() teleportTo: string | null | undefined;

  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | null = null;

  private tpl = inject(TemplateRef);
  private service = inject(TeleportService);

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
