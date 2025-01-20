import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromAuth from './auth.reducer';

const getAuthState = (state: fromApp.AppState) => state.auth;

export const getAuthIsLoading = createSelector(
  getAuthState,
  (state: fromAuth.State) => state.isLoading
);

export const getDeveloperTokenStatus = createSelector(
  getAuthState,
  (state: fromAuth.State) => state.developerTokenExists
);

export const getAccessTokenStatus = createSelector(
  getAuthState,
  (state: fromAuth.State) => state.accessTokenExists
);

export const getUser = createSelector(
  getAuthState,
  (state: fromAuth.State) => state.user
);

export const getUserPermissions = createSelector(
  getAuthState,
  (state: fromAuth.State) => state.permissions
);
