import {Routes} from "@angular/router";
import {ListLinksComponent} from "./list-links/list-links.component";
import {provideState} from "@ngrx/store";
import {reducer} from "./state/link.reducer";
import {provideEffects} from "@ngrx/effects";
import {LinkEffects} from "./state/link.effects";
import {EditLinkComponent} from "./edit-link/edit-link.component";

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState('links', reducer),
      provideEffects([LinkEffects])
    ],
    children: [
      {
        path: '',
        component: ListLinksComponent,
      },
      {
        path: 'add',
        component: EditLinkComponent,
      },
      {
        path: ':id/edit',
        component: EditLinkComponent,
      }
    ]
  }
];
