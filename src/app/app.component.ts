import { Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { TippyService } from './tippy.service';
import { ListComponent } from './list/list.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HelloComponent } from './hello/hello.component';

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
  component = HelloComponent;
  injector = Injector.create({
    providers: [
      {
        provide: 'name',
        useValue: 'Netanel',
      },
    ],
    parent: this.parent,
  });
  str = 'Hello';
  constructor(private tippy: TippyService, private parent: Injector) {}

  ngOnInit() {
    this.tippy.create(this.button.nativeElement, ListComponent, {
      interactive: true,
    });
    setTimeout(() => {
      this.str = 'Hi';
    }, 3000);
  }

  click() {
    console.log('click from app');
  }
}
