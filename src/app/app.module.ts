import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { NavComponent } from './nav/nav.component';
import { TeleportModule, DynamicViewModule } from '@ngneat/overview';
import { HelloComponent } from './hello/hello.component';

@NgModule({
  declarations: [AppComponent, ListComponent, NavComponent, HelloComponent],
  imports: [BrowserModule, AppRoutingModule, TeleportModule, DynamicViewModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
