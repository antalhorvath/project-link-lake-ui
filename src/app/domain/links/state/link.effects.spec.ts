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
import {ResourceService, TaggedResource} from "../../../shared/services/resource.service";

@Component({template: ''})
class DummyComponent {
}

describe('LinkEffects', () => {
  let actions$: Observable<any>;
  let effects: LinkEffects;
  let linkService: jasmine.SpyObj<LinkService>;
  let resourceService: jasmine.SpyObj<ResourceService>;
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
        }, {
          provide: ResourceService,
          useValue: jasmine.createSpyObj('ResourceService', [
              'saveTaggedResource'
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
    linkService = TestBed.inject(LinkService) as jasmine.SpyObj<LinkService>;
    resourceService = TestBed.inject(ResourceService) as jasmine.SpyObj<ResourceService>;
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
        link: 'https://test.it',
        tags: []
      }];
      linkService.loadLinks.and.returnValue(of(links));

      effects.loadLinks$.subscribe(action => {
        expect(action).toEqual(LinkApiEvents.loadLinksSuccess({links}));
        done();
      })
    });

    it('dispatches failure', (done) => {
      actions$ = of(LinkPageActions.loadLinks());

      const apiErrorMessage = 'some api error';
      linkService.loadLinks.and.returnValue(throwError(() => new Error(apiErrorMessage)));

      effects.loadLinks$.subscribe(action => {
        expect(action).toEqual(LinkApiEvents.loadLinksFailure({error: apiErrorMessage}));
        done();
      })
    });
  });

  describe('on save link page action', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com', tags: []};

    describe('on API call success', () => {

      it('dispatches success event', (done) => {

        linkService.saveLink.and.returnValue(of(link));

        actions$ = of(LinkPageActions.saveLink({link}));

        effects.saveLink$.subscribe(action => {
          expect(linkService.saveLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.saveLinkSuccess({link}));
          done();
        });
      });

      it('dispatches success notification', (done) => {
        const link = {linkId: 'id', name: 'test link', link: 'https://test.com', tags: []};

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

    });

    describe('on API call failure', () => {

      it('dispatches failure event', (done) => {
        const apiErrorMessage = 'some api error';
        linkService.saveLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.saveLink({link}));

        effects.saveLink$.subscribe(action => {
          expect(linkService.saveLink).toHaveBeenCalledWith(link);
          expect(action).toEqual(LinkApiEvents.saveLinkFailure({error: apiErrorMessage}));
          done();
        });
      });

      it('dispatches failure notification', (done) => {
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

  describe('on save link success API event', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com', tags: []};
    const resource: TaggedResource = {resourceId: link.linkId, name: link.name, tags: link.tags};

    it('dispatches tag link success event', (done) => {

      resourceService.saveTaggedResource.and.returnValue(of(resource));

      actions$ = of(LinkApiEvents.saveLinkSuccess({link}));

      effects.tagLink$.subscribe(action => {
        expect(resourceService.saveTaggedResource).toHaveBeenCalledWith(resource);
        expect(action).toEqual(LinkApiEvents.tagLinkSuccess({resource}));
        done();
      });
    });

    it('dispatches tag link failure event', (done) => {
      const apiErrorMessage = 'some api error';
      resourceService.saveTaggedResource.and.returnValue(throwError(() => new Error(apiErrorMessage)));

      actions$ = of(LinkApiEvents.saveLinkSuccess({link}));

      effects.tagLink$.subscribe(action => {
        expect(resourceService.saveTaggedResource).toHaveBeenCalledWith(resource);
        expect(action).toEqual(LinkApiEvents.tagLinkFailure({error: apiErrorMessage}));
        done();
      });
    });
  });

  describe('on tag link reactive action', () => {

    describe('on API call success', () => {
      it('redirects to list of links', (done) => {
        const resource: TaggedResource = {resourceId: 'id', name: 'test link', tags: []};

        actions$ = of(LinkApiEvents.tagLinkSuccess({resource}));

        effects.tagLinkCompleteToRedirect$.subscribe(() => {
          expect(location.path()).toBe('/links');
          done();
        });
      });
    });

    describe('on API call failure', () => {

      it('redirects to list of links', (done) => {

        actions$ = of(LinkApiEvents.tagLinkFailure({error: 'any error'}));

        effects.tagLinkCompleteToRedirect$.subscribe(() => {
          expect(location.path()).toBe('/links');
          done();
        });
      });

      it('dispatches failure notification', (done) => {
        actions$ = of(LinkApiEvents.tagLinkFailure({error: 'some error'}));

        effects.tagLinkFailure$.subscribe(action => {
          const notification: NotificationModel = {
            type: 'error',
            message: 'Failed to tag link, please retry later.',
          };
          expect(action).toEqual(Notification({notification}));
          done();
        });
      });

    });
  });

  describe('on delete link page action', () => {

    const link = {linkId: 'id', name: 'test link', link: 'https://test.com'};

    describe('on API call success', () => {

      it('dispatches success', (done) => {
        linkService.deleteLink.and.returnValue(of(link.linkId));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(linkService.deleteLink).toHaveBeenCalledWith(link.linkId);
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
        linkService.deleteLink.and.returnValue(throwError(() => new Error(apiErrorMessage)));

        actions$ = of(LinkPageActions.deleteLink({linkId: link.linkId}));

        effects.deleteLink$.subscribe(action => {
          expect(linkService.deleteLink).toHaveBeenCalledWith(link.linkId);
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
});
