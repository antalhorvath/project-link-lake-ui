import { Routes } from '@angular/router';
import {HomeComponent} from "./core/views/home/home.component";
import {UserSettingsComponent} from "./core/views/user-settings/user-settings.component";

export const routes: Routes = [ {
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent
  },
  {
    path: 'links',
    loadChildren: () => import('./domain/links/link.routes').then(m => m.routes)
  },
  {
    path: 'tags',
    loadChildren: () => import('./domain/tags/tag.routes').then(m => m.routes)
  }];
