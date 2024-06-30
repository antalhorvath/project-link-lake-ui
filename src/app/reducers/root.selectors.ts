import {createFeatureSelector, createSelector} from "@ngrx/store";
import {RootState} from "./index";

export const rootState = createFeatureSelector<RootState>('root');

export const selectCurrentNotification = createSelector(rootState, state => state.currentNotification);
