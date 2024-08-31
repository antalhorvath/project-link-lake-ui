import {
  ActionCreator,
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  ReducerTypes
} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Link} from './link.model';
import {LinkApiEvents, LinkPageActions} from './link.actions';

import {ResourceTag} from "../../../shared/models/tag.model";

export const linksFeatureKey = 'links';

export interface LinkState extends EntityState<Link> {
  // additional entities state properties
  isLoading: boolean;
  error: string;
  selectedLinkId: string;
}

export const adapter: EntityAdapter<Link> = createEntityAdapter<Link>(
  {
    selectId: (link: Link) => link.linkId
  }
);

const completedSuccessfully = (state: LinkState) => {
  return {
    ...state,
    isLoading: false,
    error: ''
  }
};

const onApiSuccessEvents: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkApiEvents.loadLinksSuccess,
    (state, action) => adapter.setAll(action.links, completedSuccessfully(state))
  ),
  on(LinkApiEvents.saveLinkSuccess,
    (state, action) => adapter.upsertOne(action.link, completedSuccessfully(state))
  ),
  on(LinkApiEvents.deleteLinkSuccess,
    (state, action) => adapter.removeOne(action.linkId, completedSuccessfully(state))
  )
];

const onApiFailureEvents: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkApiEvents.loadLinksFailure,
    LinkApiEvents.saveLinkFailure,
    LinkApiEvents.deleteLinkFailure,
    (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error
    }))
];

const onPageActions: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkPageActions.loadLinks,
    LinkPageActions.saveLink,
    LinkPageActions.deleteLink,
    (state, action) => ({
      ...state,
      isLoading: true,
      error: ''
    })),
];

const onCustomPageActions: ReducerTypes<LinkState, readonly ActionCreator[]>[] = [
  on(LinkPageActions.addLink, (state, action) => ({
    ...state,
    selectedLinkId: ''
  })),

  on(LinkPageActions.editLink, (state, action) => ({
    ...state,
    selectedLinkId: action.link.linkId
  }))
];

export const initialState: LinkState = adapter.getInitialState({
  // additional entity state properties
  isLoading: false,
  error: '',
  selectedLinkId: ''
});

export const reducer = createReducer(
  initialState,

  ...onApiSuccessEvents,
  ...onApiFailureEvents,
  ...onPageActions,
  ...onCustomPageActions
);

export const linksFeature = createFeature({
  name: linksFeatureKey,
  reducer,
  extraSelectors: ({selectLinksState}) => ({
    ...adapter.getSelectors(selectLinksState)
  }),
});

export const linkState = createFeatureSelector<LinkState>(linksFeatureKey);

export const selectSelectedLink = createSelector(linkState, (state: LinkState) => {
  return state.selectedLinkId ? state.entities[state.selectedLinkId] : null;
})

const selectAllLinks = adapter.getSelectors(linkState).selectAll;

export const selectExistingTags = createSelector(selectAllLinks, (links: Link[]) => {
  const allTags = links.flatMap(link => link.tags);
  const tags = new Map<string, ResourceTag>();
  allTags.forEach((tag: ResourceTag) => tags.set(tag.tagId, tag));
  return [...tags.values()];
})

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = linksFeature;
