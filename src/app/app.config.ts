import {ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {AuthHttpInterceptor, AuthModule} from "@auth0/auth0-angular";
import {authConfig} from "../enviroments/environment.local";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideState, provideStore} from '@ngrx/store';
import {metaReducers, reducer, reducers} from './reducers';
import {provideEffects} from '@ngrx/effects';
import {provideRouterStore} from '@ngrx/router-store';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(AuthModule.forRoot({
      ...authConfig
    })),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
    provideStore(reducers, {metaReducers}),
    provideState('root', reducer),
    provideEffects([]),
    provideRouterStore(),
    provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()})
  ]
};
