import { Component, Inject, OnInit, Optional } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '{{ name }} app-hello',
  styleUrls: ['./hello.component.scss'],
})
export class HelloComponent implements OnInit {
  constructor(@Inject('name') public name: string) {}

  ngOnInit(): void {}
}
