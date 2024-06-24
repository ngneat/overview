import { Component, input } from '@angular/core';

@Component({
  selector: 'dynamic-view',
  standalone: true,
  template: ` <div [innerHTML]="content()"></div> `,
})
export class DynamicViewComponent {
  readonly content = input<string>();
}
