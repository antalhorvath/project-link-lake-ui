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
  let linkService: jasmine.SpyObj<LinkService>;
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
              'saveLink',
              'deleteLink'
            ]
          ),
        },
        provideRouter([
          {path: 'links', component: DummyComponent},
          {path: 'links/add', component: DummyComponent},
          {path: 'links/:id/edit', component: DummyComponent}
        ])
      ]
    });
    effects = TestBed.inject(LinkEffects);
    linkService = TestBed.inject(LinkService) as jasmine.SpyObj<LinkService>;
    location = TestBed.inject(Location);
  });

  it('gets created', () => {
    expect(effects).toBeTruthy();
  });

  describe('on Load Links PAGE Action', () => {

    describe('when API call succeeds', () => {
      it('dispatches Load Links Success API Event', (done) => {
        actions$ = of(LinkPageActions.loadLinks());

        let links = [{
          linkId: 'id',
          name: 'test link',
          link: 'https://test.it',
          tags: []
        }];
        linkService.loadLinks.and.returnValue(of(links));

        effects.loadLinks$.subscribe(action => {
          expect(action).toEqual(LinkApiEvents.loadLinksSuccess({links}));
          done();
        })
      });
    });

    describe('when API call fails', () => {
      it('dispatches Load Links Failure API Event', (done) => {
        actions$ = of(LinkPageActions.loadLinks());

        const apiErrorMessage = 'some api error';
        linkService.loadLinks.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        effects.loadLinks$.subscribe(action => {
          expect(action).toEqual(LinkApiEvents.loadLinksFailure({error: apiErrorMessage}));
          done();
        })
      });
    });
  });


  describe('on Add Link PAGE Action', () => {
    it('redirects to add link PAGE', (done) => {
      actions$ = of(LinkPageActions.addLink());

      effects.addLink$.subscribe(() => {
        expect(location.path()).toBe(`/links/add`);
        done();
      });
    });
  });


  describe('on Save Link PAGE Action', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com', tags: []};

    describe('when API call succeeds', () => {
      it('dispatches Save Link Success API Event', (done) => {

        linkService.saveLink.and.returnValue(of(link));

        actions$ = of(LinkPageActions.saveLink({link}));

        effects.saveLink$.subscribe(action => {
          expect(linkService.saveLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.saveLinkSuccess({link}));
          done();
        });
      });

      describe('on Save Link Success API Event', () => {
        it('dispatches success Notification Message', (done) => {
          actions$ = of(LinkApiEvents.saveLinkSuccess({link}));

          effects.saveLinkSuccess$.subscribe(action => {
            const notification: NotificationModel = {
              type: 'info',
              message: 'Link has been saved.',
            };
            expect(action).toEqual(Notification({notification}));
            done();
          });
        });

        it('redirects to list of links PAGE', (done) => {
          actions$ = of(LinkApiEvents.saveLinkSuccess({link}));

          effects.saveLinkSuccessToRedirect$.subscribe(() => {
            expect(location.path()).toBe('/links');
            done();
          });
        });
      });
    });

    describe('when API call fails', () => {
      it('dispatches Save Link Failure API Event', (done) => {
        const apiErrorMessage = 'some api error';
        linkService.saveLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.saveLink({link}));

        effects.saveLink$.subscribe(action => {
          expect(linkService.saveLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.saveLinkFailure({error: apiErrorMessage}));
          done();
        });
      });

      describe('on Save Link Failure API Event', () => {
        it('dispatches failure Notification message', (done) => {
          actions$ = of(LinkApiEvents.saveLinkFailure({error: 'some error'}));

          effects.saveLinkFailure$.subscribe(action => {
            const notification: NotificationModel = {
              type: 'error',
              message: 'Failed to save link.',
            };
            expect(action).toEqual(Notification({notification}));
            done();
          });
        });
      });
    });
  });


  describe('on Delete Link PAGE Action', () => {
    const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

    describe('when API call succeeds', () => {
      it('dispatches Delete Link Success API Event', (done) => {
        linkService.deleteLink.and.returnValue(of(link.linkId));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(linkService.deleteLink).toHaveBeenCalledWith(link.linkId);
          expect(action).toEqual(LinkApiEvents.deleteLinkSuccess({linkId: link.linkId}));
          done();
        });
      });

      describe('on Delete Link Success API Event', () => {
        it('dispatches success Notification Message', (done) => {
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
    });

    describe('when API call fails', () => {
      it('dispatches Delete Link Failure API Event', (done) => {
        const apiErrorMessage = 'some api error';
        linkService.deleteLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(linkService.deleteLink).toHaveBeenCalledWith(link.linkId);
          expect(action).toEqual(LinkApiEvents.deleteLinkFailure({error: apiErrorMessage}));
          done();
        });
      });

      describe('on Delete Link Failure API Event', () => {
        it('dispatches failure Notification Message', (done) => {
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
  });


  describe('on Edit Link PAGE Action', () => {
    it('redirects to edit link PAGE', (done) => {
      const link = {linkId: 'id', name: 'test link', link: 'https://test.com', tags: []};

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
})
;
