import { Component, inject } from '@angular/core';
import { injectViewContext } from '@ngneat/overview';
import { JsonPipe } from '@angular/common';
import { NAME_TOKEN } from '../name.provider';

@Component({
  selector: 'app-hello',
  template: `
    <p>{{ name }} app-hello</p>
    <p>Provided context: {{ context() | json }}</p>
  `,
  styleUrls: ['./hello.component.scss'],
  imports: [JsonPipe],
})
export class HelloComponent {
  name = inject(NAME_TOKEN);
  context = injectViewContext();
}
