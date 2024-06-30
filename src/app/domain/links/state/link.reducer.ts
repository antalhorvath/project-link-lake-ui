import {ActionCreator, createFeature, createReducer, on, ReducerTypes} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Link} from './link.model';
import {LinkApiEvents, LinkPageActions} from './link.actions';

export const linksFeatureKey = 'links';

export interface LinkState extends EntityState<Link> {
  // additional entities state properties
  isLoading: boolean;
  error: string;
}

export const adapter: EntityAdapter<Link> = createEntityAdapter<Link>(
  {
    selectId: (link: Link) => link.linkId
  }
);

const onApiSuccessEvents: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkApiEvents.loadLinksSuccess,
    (state, action) => adapter.setAll(action.links, {
      ...state,
      isLoading: false,
      error: ''
    })
  ),
  on(LinkApiEvents.addLinkSuccess,
    (state, action) => adapter.addOne(action.link, {
      ...state,
      isLoading: false,
      error: ''
    })
  ),
  on(LinkApiEvents.updateLinkSuccess,
    (state, action) => adapter.updateOne(action.link, {
      ...state,
      isLoading: false,
      error: ''
    })
  )
];

const onApiFailureEvents: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkApiEvents.loadLinksFailure,
    LinkApiEvents.addLinkFailure,
    LinkApiEvents.updateLinkFailure,
    LinkApiEvents.deleteLinkFailure,
    (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error
    }))
];

const onPageActions: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkPageActions.loadLinks,
    LinkPageActions.addLink,
    LinkPageActions.updateLink,
    LinkPageActions.deleteLink,
    (state, action) => ({
      ...state,
      isLoading: true,
      error: ''
    })),
];

export const initialState: LinkState = adapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: ''
});

export const reducer = createReducer(
  initialState,

  ...onApiSuccessEvents,
  ...onApiFailureEvents,
  ...onPageActions,
);

export const linksFeature = createFeature({
  name: linksFeatureKey,
  reducer,
  extraSelectors: ({selectLinksState}) => ({
    ...adapter.getSelectors(selectLinksState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = linksFeature;
