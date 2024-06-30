import {isDevMode} from '@angular/core';
import {ActionReducerMap, createReducer, MetaReducer, on} from '@ngrx/store';
import {ToastMessageModel} from "../shared/components/toast-message/toast-message.model";
import {ShowToastMessage} from "./root.actions";
import {state} from "@angular/animations";

export interface RootState {
  currentNotification?: ToastMessageModel;
}

export const initialState: RootState = {
  currentNotification: undefined,
}

export interface AppState {
  root: RootState;
}

export const reducer = createReducer(
  initialState,
  on(ShowToastMessage, (state, action) => ({
    ...state,
    currentNotification: action.notification
  }))
)

export const reducers: ActionReducerMap<AppState> = {
  root: reducer
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
