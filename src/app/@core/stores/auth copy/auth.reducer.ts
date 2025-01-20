import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface State {
  isLoading: boolean;
  developerTokenExists: boolean;
  accessTokenExists: boolean;
  user: any;
  permissions: any;
}

const initialState: State = {
  isLoading: false,
  developerTokenExists: false,
  accessTokenExists: false,
  user: null,
  permissions: null,
};

const authReducerInternal = createReducer(
  initialState,
  on(AuthActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(AuthActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),

  on(AuthActions.UpdateDeveloperTokenStatus, (state, { payload }) => ({
    ...state,
    developerTokenExists: payload.status,
  })),

  on(AuthActions.UpdateAccessTokenStatus, (state, { payload }) => ({
    ...state,
    accessTokenExists: payload.status,
  })),

  on(AuthActions.AuthorizeUserLogin, (state, { payload }) => ({
    ...state,
    payload,
  })),

  // on(AuthActions.AuthenticateSuccess, (state, { payload }) => ({
  //   ...state,
  //   user: payload.user,
  //   isLoading: false,
  // })),

  on(AuthActions.AuthenticateSuccess, (state, { payload }) => ({
    ...state,
    user: payload.user,
    permissions: payload.permissionsArray,
    isLoading: false,
  })),
  on(AuthActions.RefreshTokenSuccess, (state, { payload }) => ({
    ...state,
    user: payload.user,
    permissions: payload.permissionsArray,
    isLoading: false,
  })),

  on(AuthActions.Logout, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.ClearUser, (state) => ({
    ...state,
    user: null,
    permissions: null,
    isLoading: false,
  }))
);

export function authReducer(state: State | undefined, action: Action) {
  return authReducerInternal(state, action);
}
