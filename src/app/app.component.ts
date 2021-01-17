import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TippyService } from './tippy.service';
import { ListComponent } from './list/list.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('button', { static: true }) button: ElementRef;
  @ViewChild(TemplateRef, { static: true }) tpl: TemplateRef<any>;
  interval = interval(1000).pipe(finalize(() => console.log('tpl destroyed')));
  show = true;
  constructor(private tippy: TippyService) {}

  ngOnInit() {
    this.tippy.create(this.button.nativeElement, ListComponent, {
      interactive: true,
    });
  }

  click() {
    console.log('click from app');
  }
}
