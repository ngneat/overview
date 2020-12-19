import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { TIPPY_REF } from '../tippy.service';
import { Instance } from 'tippy.js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  @Input() value: string;

  constructor(@Inject(TIPPY_REF) public tippy: Instance) {}

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
