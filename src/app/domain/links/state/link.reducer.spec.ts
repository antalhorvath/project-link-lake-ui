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
        link: 'https://test.it'
      }, {
        linkId: '2',
        name: 'test link 2',
        link: 'https://test.it'
      }];

      const action = LinkApiEvents.loadLinksSuccess({links});

      const updatedState = reducer(initialState, action);

      expect(updatedState.ids).toEqual(['1', '2']);
      expect(updatedState.entities).toEqual({'1': links[0], '2': links[1]});
    });

    it('adds one link', () => {
      let link = {
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it'
      };

      const action = LinkApiEvents.addLinkSuccess({link});

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
          link: 'https://test.it'
        }
      };

      let link = {
        linkId: '1',
        name: 'updated test link 1',
        link: 'https://new.test.it'
      };

      const action = LinkApiEvents.updateLinkSuccess({link: {id: link.linkId, changes: {...link}}});

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
          link: 'https://test.it'
        },
        '2': {
          linkId: '2',
          name: 'test link 2',
          link: 'https://test.it'
        }
      };

      const action = LinkApiEvents.deleteLinkSuccess({ linkId: '2'});

      const updatedState = reducer(initialState, action);

      const link = {
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it'
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
        LinkApiEvents.addLinkFailure({error}),
        LinkApiEvents.updateLinkFailure({error}),
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
      const link = {linkId: '', name: '', link: ''};
      [
        LinkPageActions.loadLinks(),
        LinkPageActions.addLink({link: link}),
        LinkPageActions.updateLink({link: {id: link.linkId, changes: {...link}}}),
        LinkPageActions.deleteLink({linkId: link.linkId}),
      ].forEach(action => {
        initialState.error = 'some error message';

        const updatedState = reducer(initialState, action);

        expect(updatedState.error).toBe('');
      })
    });
  });
});
