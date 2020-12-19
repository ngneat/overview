import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { NavComponent } from './nav/nav.component';
import { TeleportModule } from '@ngneat/overview';

@NgModule({
  declarations: [AppComponent, ListComponent, NavComponent],
  imports: [BrowserModule, AppRoutingModule, TeleportModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
