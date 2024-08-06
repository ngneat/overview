import {
  Directive,
  EmbeddedViewRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TeleportService } from './teleport.service';

@Directive({
  selector: '[teleportTo]',
  standalone: true,
})
export class TeleportDirective implements OnChanges, OnDestroy {
  readonly teleportTo = input<string | null | undefined>();

  private viewRef: EmbeddedViewRef<any>;
  private subscription: Subscription | null = null;

  private tpl = inject(TemplateRef);
  private service = inject(TeleportService);

  ngOnChanges(changes: SimpleChanges): void {
    // Note: Do not use `effect` to observe changes to `teleportTo`, as
    // this would result in running `createEmbeddedView` within that effect.
    // `createEmbeddedView` may create a component whose constructor might
    // trigger another effect or write to some signals, given that we are
    // operating within a reactive context.
    if (changes.teleportTo && typeof this.teleportTo() === 'string') {
      this.dispose();

      this.subscription = this.service.outlet$(this.teleportTo()).subscribe((outlet) => {
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
