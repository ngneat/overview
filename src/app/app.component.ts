import { Component, ElementRef, inject, Injector, TemplateRef, ViewChild } from '@angular/core';
import { TippyService } from './tippy.service';
import { ListComponent } from './list/list.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HelloComponent } from './hello/hello.component';
import { CommonModule } from '@angular/common';
import { DynamicViewDirective, TeleportDirective, TeleportOutletDirective } from '@ngneat/overview';
import { NAME_TOKEN } from './name.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, DynamicViewDirective, TeleportOutletDirective, TeleportDirective, ListComponent],
})
export class AppComponent {
  tippy = inject(TippyService);
  injector = inject(Injector);

  @ViewChild('button', { static: true }) button: ElementRef;
  @ViewChild(TemplateRef, { static: true }) tpl: TemplateRef<any>;

  interval = interval(1000).pipe(finalize(() => console.log('tpl destroyed')));
  show = true;
  component = HelloComponent;
  customInjector = Injector.create({
    providers: [
      {
        provide: NAME_TOKEN,
        useValue: 'Netanel',
      },
    ],
    parent: this.injector,
  });
  str = 'Hello';
  context = 'some context';

  ngOnInit() {
    this.tippy.create(this.button.nativeElement, ListComponent, {
      interactive: true,
    });
    setTimeout(() => {
      this.str = 'Hi';
    }, 3000);
  }

  toggleContext() {
    this.context = this.context === 'some context' ? 'This is a different context' : 'some context';
  }
}
