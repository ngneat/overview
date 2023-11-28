import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-view',
  standalone: true,
  template: ` <div [innerHTML]="content"></div> `,
})
export class DynamicViewComponent {
  @Input() content: string;
}
