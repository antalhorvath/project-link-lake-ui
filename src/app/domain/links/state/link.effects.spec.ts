import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of, throwError} from 'rxjs';

import {LinkEffects} from './link.effects';
import {LinkService} from "../link.service";
import {LinkApiEvents, LinkPageActions} from "./link.actions";
import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {provideRouter} from '@angular/router';
import {Notification} from "../../../reducers/root.actions";
import {NotificationModel} from "../../../shared/models/notification.model";

@Component({template: ''})
class DummyComponent {
}

describe('LinkEffects', () => {
  let actions$: Observable<any>;
  let effects: LinkEffects;
  let service: jasmine.SpyObj<LinkService>;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkEffects,
        provideMockActions(() => actions$),
        {
          provide: LinkService,
          useValue: jasmine.createSpyObj('LinkService', [
              'loadLinks',
              'addLink',
              'deleteLink'
            ]
          ),
        },
        provideRouter([
          {path: 'links', component: DummyComponent},
          {path: 'links/:id/edit', component: DummyComponent}
        ])
      ]
    });
    effects = TestBed.inject(LinkEffects);
    service = TestBed.inject(LinkService) as jasmine.SpyObj<LinkService>;
    location = TestBed.inject(Location);
  });

  it('gets created', () => {
    expect(effects).toBeTruthy();
  });

  describe('on load links page action', () => {
    it('dispatches success', (done) => {
      actions$ = of(LinkPageActions.loadLinks());

      let links = [{
        linkId: 'id',
        name: 'test link',
        link: 'https://test.it'
      }];
      service.loadLinks.and.returnValue(of(links));

      effects.loadLinks$.subscribe(action => {
        expect(action).toEqual(LinkApiEvents.loadLinksSuccess({links}));
        done();
      })
    });

    it('dispatches failure', (done) => {
      actions$ = of(LinkPageActions.loadLinks());

      const apiErrorMessage = 'some api error';
      service.loadLinks.and.returnValue(throwError(() => new Error(apiErrorMessage)));

      effects.loadLinks$.subscribe(action => {
        expect(action).toEqual(LinkApiEvents.loadLinksFailure({error: apiErrorMessage}));
        done();
      })
    });
  });

  describe('on add link page action', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

    describe('on API call success', () => {

      it('dispatches success event', (done) => {

        service.addLink.and.returnValue(of(link));

        actions$ = of(LinkPageActions.addLink({link}));

        effects.addLink$.subscribe(action => {
          expect(service.addLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.addLinkSuccess({link}));
          done();
        });
      });

      it('redirects to list of links', (done) => {
        const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

        actions$ = of(LinkApiEvents.addLinkSuccess({link}));

        effects.addLinkSuccessToRedirect$.subscribe(() => {
          expect(location.path()).toBe('/links');
          done();
        });
      });

      it('dispatches success notification', (done) => {
        const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

        actions$ = of(LinkApiEvents.addLinkSuccess({link}));

        effects.addLinkSuccess$.subscribe(action => {
          const notification: NotificationModel = {
            type: 'info',
            message: 'Link has been added.',
          };
          expect(action).toEqual(Notification({notification}));
          done();
        });
      });

    });

    describe('on API call failure', () => {

      it('dispatches failure event', (done) => {
        const apiErrorMessage = 'some api error';
        service.addLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.addLink({link}));

        effects.addLink$.subscribe(action => {
          expect(service.addLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.addLinkFailure({error: apiErrorMessage}));
          done();
        });
      });

      it('dispatches failure notification', (done) => {
        actions$ = of(LinkApiEvents.addLinkFailure({error: 'some error'}));

        effects.addLinkFailure$.subscribe(action => {
          const notification: NotificationModel = {
            type: 'error',
            message: 'Failed to add link.',
          };
          expect(action).toEqual(Notification({notification}));
          done();
        });
      });

    });

  })


  describe('on delete link page action', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

    describe('on API call success', () => {

      it('dispatches success', (done) => {
        service.deleteLink.and.returnValue(of(link.linkId));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(service.deleteLink).toHaveBeenCalledWith(link.linkId);
          expect(action).toEqual(LinkApiEvents.deleteLinkSuccess({linkId: link.linkId}));
          done();
        });
      });

      it('dispatches success notification', (done) => {
        actions$ = of(LinkApiEvents.deleteLinkSuccess({linkId: link.linkId}));

        effects.deleteLinkSuccess$.subscribe(action => {
          const notification: NotificationModel = {
            type: 'info',
            message: 'Link has been deleted.',
          };
          expect(action).toEqual(Notification({notification}));
          done();
        });
      });

    });

    describe('on API call failure', () => {

      it('dispatches failure', (done) => {
        const apiErrorMessage = 'some api error';
        service.deleteLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(service.deleteLink).toHaveBeenCalledWith(link.linkId);
          expect(action).toEqual(LinkApiEvents.deleteLinkFailure({error: apiErrorMessage}));
          done();
        });
      });

      it('dispatches failure notification', (done) => {
        actions$ = of(LinkApiEvents.deleteLinkFailure({error: 'some error'}));

        effects.deleteLinkFailure$.subscribe(action => {
          const notification: NotificationModel = {
            type: 'error',
            message: 'Failed to delete link.',
          };
          expect(action).toEqual(Notification({notification}));
          done();
        });
      });

    });

  });

  describe('on edit link page action', () => {
    it('redirects to edit link', (done) => {
      const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

      actions$ = of(LinkPageActions.editLink({link}));

      effects.editLink$.subscribe(() => {
        expect(location.path()).toBe(`/links/${link.linkId}/edit`);
        done();
      });
    });

  });

  describe('unpack error', () => {

    it('returns string error message as it is', () => {
      const errorString = 'error message';
      const result = effects.unpackError(errorString);
      expect(result).toBe(errorString);
    });

    it('returns unpacks message from Error', () => {
      const errorString = 'error message';
      const result = effects.unpackError(new Error(errorString));
      expect(result).toBe(errorString);
    });

    it('return default error message in case of unknown error type', () => {
      const errorString = 'error message';
      let customErrorObject = {
        code: 'myFancyErrorCore001',
        message: 'Unknown error message'
      };
      const result = effects.unpackError(customErrorObject);
      expect(result).toBe('error occurred');
    });

  });

});
