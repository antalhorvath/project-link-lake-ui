import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./views/home/home.component";
import {UserSettingsComponent} from "./views/user-settings/user-settings.component";

const routes: Routes = [
  {
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
    loadChildren: () => import('../domain/links/links-routing.module').then(m => m.LinksRoutingModule)
  },
  {
    path: 'tags',
    loadChildren: () => import('../domain/tags/tags-routing.module').then(m => m.TagsRoutingModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class CoreRoutingModule {
}
