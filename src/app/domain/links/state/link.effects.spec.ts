import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of, throwError} from 'rxjs';

import {LinkEffects} from './link.effects';
import {LinkService} from "../link.service";
import {LinkApiEvents, LinkPageActions} from "./link.actions";

describe('LinkEffects', () => {
  let actions$: Observable<any>;
  let effects: LinkEffects;
  let service: jasmine.SpyObj<LinkService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkEffects,
        provideMockActions(() => actions$),
        {
          provide: LinkService,
          useValue: jasmine.createSpyObj('LinkService', ['loadLinks']),
        }
      ]
    });

    effects = TestBed.inject(LinkEffects);
    service = TestBed.inject(LinkService) as jasmine.SpyObj<LinkService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadLinks', () => {
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
