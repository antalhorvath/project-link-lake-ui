import {isDevMode} from '@angular/core';
import {ActionReducerMap, createReducer, MetaReducer, on} from '@ngrx/store';
import {NotificationModel} from "../shared/models/notification.model";
import {Notification} from "./root.actions";
import {state} from "@angular/animations";

export interface RootState {
  currentNotification?: NotificationModel;
}

export const initialState: RootState = {
  currentNotification: undefined,
}

export interface AppState {
  root: RootState;
}

export const reducer = createReducer(
  initialState,
  on(Notification, (state, action) => ({
    ...state,
    currentNotification: action.notification
  }))
)

export const reducers: ActionReducerMap<AppState> = {
  root: reducer
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
