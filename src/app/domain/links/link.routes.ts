import {Routes} from "@angular/router";
import {ListLinksComponent} from "./list-links/list-links.component";
import {provideState} from "@ngrx/store";
import {reducer} from "./state/link.reducer";
import {provideEffects} from "@ngrx/effects";
import {LinkEffects} from "./state/link.effects";

export const routes: Routes = [
  {
    path: '',
    component: ListLinksComponent,
    providers: [
      provideState('links', reducer),
      provideEffects([LinkEffects])
    ]
  }
];
