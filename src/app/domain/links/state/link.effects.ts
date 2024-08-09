import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map} from 'rxjs/operators';
import {of, switchMap} from 'rxjs';
import {LinkApiEvents, LinkPageActions, ResourceApiEvents} from './link.actions';
import {LinkService} from "../link.service";
import {Router} from "@angular/router";
import {Notification} from "../../../reducers/root.actions";
import {ResourceService} from "../../../shared/services/resource.service";

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

  loadLinksSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.loadLinksSuccess),
      switchMap(() =>
        this.resourceService.queryResources().pipe(
          map(resources => ResourceApiEvents.loadResourcesSuccess({resources})),
          catchError(error => of(ResourceApiEvents.loadResourcesFailure({error: this.unpackError(error)})))
        ))
    )
  });

  addLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.addLink),
      switchMap(() => this.router.navigate(['/links/add']))
    );
  }, {
    dispatch: false
  });

  saveLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.saveLink),
      switchMap((action) =>
        this.linkService.saveLink(action.link).pipe(
          map(link => LinkApiEvents.saveLinkSuccess({link})),
          catchError(error => of(LinkApiEvents.saveLinkFailure({error: this.unpackError(error)})))
        )
      )
    )
  });

  saveLinkSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(LinkApiEvents.saveLinkSuccess),
        switchMap(() => of(Notification({
            notification: {
              type: 'info',
              message: 'Link has been saved.'
            }
          })
        ))
      );
    }
  );

  saveLinkFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.saveLinkFailure),
      switchMap(() => of(Notification({
          notification: {
            type: 'error',
            message: 'Failed to save link.'
          }
        }))
      )
    );
  });

  tagLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.saveLinkSuccess),
      switchMap(({link}) => this.resourceService.saveTaggedResource({
          resourceId: link.linkId,
          name: link.name,
          tags: link.tags
        }).pipe(
          map(resource => LinkApiEvents.tagLinkSuccess({resource})),
          catchError(error => of(LinkApiEvents.tagLinkFailure({error: this.unpackError(error)})))
        )
      )
    )
  })

  tagLinkCompleteToRedirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.tagLinkSuccess, LinkApiEvents.tagLinkFailure),
      switchMap(() => this.router.navigate(['/links']))
    );
  }, {
    dispatch: false
  });

  tagLinkFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.tagLinkFailure),
      switchMap(() => of(Notification({
          notification: {
            type: 'error',
            message: 'Failed to tag link, please retry later.'
          }
        }))
      )
    );
  });

  deleteLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.deleteLink),
      switchMap(action => this.linkService.deleteLink(action.linkId).pipe(
        map(linkId => LinkApiEvents.deleteLinkSuccess({linkId: linkId})),
        catchError(error => of(LinkApiEvents.deleteLinkFailure({error: this.unpackError(error)})))
      ))
    )
  })

  deleteLinkSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.deleteLinkSuccess),
      switchMap(() => of(Notification({
          notification: {
            type: 'info',
            message: 'Link has been deleted.'
          }
        })
      ))
    );
  });

  deleteLinkFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.deleteLinkFailure),
      switchMap(() => of(Notification({
          notification: {
            type: 'error',
            message: 'Failed to delete link.'
          }
        }))
      )
    );
  })

  untagLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkApiEvents.deleteLinkSuccess),
      switchMap(({linkId}) => this.resourceService.deleteTaggedResource(linkId))
    )
  }, {
    dispatch: false
  })

  editLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LinkPageActions.editLink),
      switchMap((action) => this.router.navigate([`/links/${action.link.linkId}/edit`]))
    );
  }, {
    dispatch: false
  });

  constructor(private actions$: Actions,
              private linkService: LinkService,
              private resourceService: ResourceService,
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
