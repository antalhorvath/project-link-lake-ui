import {NgModule} from '@angular/core';
import {AuthHttpInterceptor, AuthModule} from "@auth0/auth0-angular";
import {HTTP_INTERCEPTORS } from "@angular/common/http";
import {authConfig} from '../../enviroments/environment.local';

@NgModule({
  declarations: [],
  imports: [
    AuthModule.forRoot({
      ...authConfig
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    }
  ]
})

export class AuthenticationModule {
}
