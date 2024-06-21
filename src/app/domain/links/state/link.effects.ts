import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {LinkApiEvents, LinkPageActions} from './link.actions';
import {LinkService} from "../link.service";

@Injectable()
export class LinkEffects {

  loadLinks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.loadLinks),
      concatMap(() =>
        this.linkService.loadLinks().pipe(
          map(links => LinkApiEvents.loadLinksSuccess({links})),
          catchError(error => of(LinkApiEvents.loadLinksFailure({error: this.unpackError(error)}))))
      )
    );
  });

  constructor(private actions$: Actions,
              private linkService: LinkService) {
  }

  unpackError(error: any): string {
    if(error instanceof Error) {
      return error.message;
    } else if(typeof error === 'string') {
      return error;
    } else {
      return 'error occurred';
    }
  }
}
