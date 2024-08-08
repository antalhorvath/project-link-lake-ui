import {initialState, reducer, selectAll, selectExistingTags, selectSelectedLink} from './link.reducer';
import {LinkApiEvents, LinkPageActions, ResourceApiEvents} from "./link.actions";
import {TaggedResource} from "../../../shared/services/resource.service";
import {Link} from "./link.model";

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

    it('load resources success', () => {
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


      let resources: TaggedResource[] = [{
        resourceId: '1',
        name: 'test link 1',
        tags: [{
          tagId: 'tag1',
          name: 'name of tag 2'
        }]
      }, {
        resourceId: '2',
        name: 'test link 2',
        tags: [{
          tagId: 'tag2',
          name: 'name of tag 2'
        }]
      }];

      const action = ResourceApiEvents.loadResourcesSuccess({resources});

      let updatedState = reducer(initialState, action);

      expect(updatedState.entities).toEqual(
        {
          '1': {
            linkId: '1',
            name: 'test link 1',
            link: 'https://test.it',
            tags: [{
              tagId: 'tag1',
              name: 'name of tag 2'
            }]
          },
          '2': {
            linkId: '2',
            name: 'test link 2',
            link: 'https://test.it',
            tags: [{
              tagId: 'tag2',
              name: 'name of tag 2'
            }]
          }
        }
      )
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

  describe('selected link id', () => {

    it('gets cleared on addLink page action', () => {
      initialState.selectedLinkId = 'someId';

      const updatedState = reducer(initialState, LinkPageActions.addLink());

      expect(updatedState.selectedLinkId).toBe('');
    });

    it('gets initialised on edit link page action', () => {
      const link: Link = {linkId: 'linkToEditId', name: '', link: '', tags: []};
      initialState.selectedLinkId = '';

      const updatedState = reducer(initialState, LinkPageActions.editLink({link}));

      expect(updatedState.selectedLinkId).toBe('linkToEditId');
    });
  });
});

describe('Link Selector', () => {

  it('selects selected link', () => {
    initialState.ids = ['1'];
    const linkInStore = {
      linkId: '1',
      name: 'test link 1',
      link: 'https://test.it',
      tags: []
    };
    initialState.entities = {
      '1': linkInStore
    };

    initialState.selectedLinkId = '1';

    const selectedLink = selectSelectedLink.projector(initialState);
    expect(selectedLink).toEqual(linkInStore);
  });

  it('selects unique set of existing tags', () => {
    const links = [
      {
        linkId: '1',
        name: 'test link 1',
        link: 'https://test.it',
        tags: [
          {
            tagId: 'tag1',
            name: 'name of tag 1'
          },
          {
            tagId: 'tag2',
            name: 'name of tag 2'
          }
        ]
      },
      {
        linkId: '2',
        name: 'test link 2',
        link: 'https://test.it',
        tags: [
          {
            tagId: 'tag2',
            name: 'name of tag 2'
          },
          {
            tagId: 'tag3',
            name: 'name of tag 3'
          }
        ]
      }
    ];
    const existingTags = selectExistingTags.projector(links);
    expect(existingTags).toEqual([
      {
        tagId: 'tag1',
        name: 'name of tag 1'
      },
      {
        tagId: 'tag2',
        name: 'name of tag 2'
      },
      {
        tagId: 'tag3',
        name: 'name of tag 3'
      }
    ]);
  });
});
