import {ChangeDetectionStrategy, Component, inject, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import { TIPPY_REF } from '../tippy.service';
import { Instance } from 'tippy.js';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ListComponent implements OnInit, OnDestroy {
  tippy = inject(TIPPY_REF);

  @Input() value: string;

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
