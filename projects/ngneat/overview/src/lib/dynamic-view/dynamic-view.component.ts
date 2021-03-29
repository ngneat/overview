import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-view',
  template: ` <div [innerHTML]="content"></div> `,
})
export class DynamicViewComponent {
  @Input() content: string;
}
