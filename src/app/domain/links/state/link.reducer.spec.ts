import {initialState, reducer} from './link.reducer';
import {LinkApiEvents, LinkPageActions} from "./link.actions";

describe('Link Reducer', () => {
  describe('on Unknown action', () => {
    it('does not affect state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('on API success', () => {

    beforeEach(() => {
      initialState.ids = [];
      initialState.entities = {};
    });

    it('sets all links', () => {
      let links = [{
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it',
        tags: []
      }, {
        linkId: '2',
        name: 'test link 2',
        link: 'https://test.it',
        tags: []
      }];

      const action = LinkApiEvents.loadLinksSuccess({links});

      const updatedState = reducer(initialState, action);

      expect(updatedState.ids).toEqual(['1', '2']);
      expect(updatedState.entities).toEqual({'1': links[0], '2': links[1]});
    });

    it('saves one link', () => {
      let link = {
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it',
        tags: []
      };

      const action = LinkApiEvents.saveLinkSuccess({link});

      const updatedState = reducer(initialState, action);

      expect(updatedState.ids).toEqual(['1']);
      expect(updatedState.entities).toEqual({'1': link});
    });

    it('updates one link', () => {
      initialState.ids = ['1'];
      initialState.entities = {
        '1': {
          linkId: '1',
          name: 'test link 1',
          link: 'https://test.it',
          tags: []
        }
      };

      let link = {
        linkId: '1',
        name: 'updated test link 1',
        link: 'https://uptesded.it',
        tags: []
      };

      const action = LinkApiEvents.saveLinkSuccess({link});

      const updatedState = reducer(initialState, action);

      expect(updatedState.ids).toEqual(['1']);
      expect(updatedState.entities).toEqual({'1': link});
    });

    it('removes one link', () => {
      initialState.ids = ['1', '2'];
      initialState.entities = {
        '1': {
          linkId: '1',
          name: 'test link 1',
          link: 'https://test.it',
          tags: []
        },
        '2': {
          linkId: '2',
          name: 'test link 2',
          link: 'https://test.it',
          tags: []
        }
      };

      const action = LinkApiEvents.deleteLinkSuccess({ linkId: '2'});

      const updatedState = reducer(initialState, action);

      const link = {
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it',
        tags: []
      };
      expect(updatedState.ids).toEqual(['1']);
      expect(updatedState.entities).toEqual({'1': link});
    });

  });

  describe('on API failures', () => {

    it('sets error', () => {
      const error = 'some api error';
      [
        LinkApiEvents.loadLinksFailure({error}),
        LinkApiEvents.saveLinkFailure({error}),
        LinkApiEvents.deleteLinkFailure({error}),
      ].forEach(action => {
        initialState.error = '';

        const updatedState = reducer(initialState, action);

        expect(updatedState.error).toBe(error);
      })
    });
  });

  describe('on Page actions', () => {

    it('clears error state', () => {
      const link = {linkId: '', name: '', link: '', tags: []};
      [
        LinkPageActions.loadLinks(),
        LinkPageActions.saveLink({link}),
        LinkPageActions.deleteLink({linkId: link.linkId}),
      ].forEach(action => {
        initialState.error = 'some error message';

        const updatedState = reducer(initialState, action);

        expect(updatedState.error).toBe('');
      })
    });
  });
});
