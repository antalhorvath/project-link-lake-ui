import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from "../app.component";
import {RouterOutlet} from "@angular/router";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {AuthenticationModule} from "./authentication.module";
import {BrowserModule} from "@angular/platform-browser";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterOutlet,
    NavbarComponent,
    AuthenticationModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
