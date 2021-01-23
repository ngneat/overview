import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '{{ name }}',
  styleUrls: ['./hello.component.scss'],
})
export class HelloComponent implements OnInit {
  constructor(@Inject('name') public name: string) {}

  ngOnInit(): void {}
}
