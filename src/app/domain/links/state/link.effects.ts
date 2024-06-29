import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, delay, map} from 'rxjs/operators';
import {of, switchMap} from 'rxjs';
import {LinkApiEvents, LinkPageActions} from './link.actions';
import {LinkService} from "../link.service";
import {Router} from "@angular/router";

@Injectable()
export class LinkEffects {

  loadLinks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.loadLinks),
      switchMap(() =>
        this.linkService.loadLinks().pipe(
          map(links => LinkApiEvents.loadLinksSuccess({links})),
          catchError(error => of(LinkApiEvents.loadLinksFailure({error: this.unpackError(error)})))
        )
      )
    );
  });

  addLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.addLink),
      switchMap((action) =>
        this.linkService.addLink(action.link).pipe(
          map(link => LinkApiEvents.addLinkSuccess({link})),
          catchError(error => of(LinkApiEvents.addLinkFailure({error: this.unpackError(error)})))
        )
      )
    )
  });

  addLinkSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(LinkApiEvents.addLinkSuccess),
        // delay(200),
        switchMap(() => this.router.navigate(['/links']))
      );
    }, {
      dispatch: false
    }
  );

  constructor(private actions$: Actions,
              private linkService: LinkService,
              private router: Router) {
  }

  unpackError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else {
      return 'error occurred';
    }
  }
}
