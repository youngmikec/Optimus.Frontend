import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromUsers from './users.reducer';

const getUsersState = (state: fromApp.AppState) => state.users;

export const getUsersIsLoading = createSelector(
  getUsersState,
  (state: fromUsers.State) => state.isLoading
);

export const getAllUsers = createSelector(
  getUsersState,
  (state: fromUsers.State) => state.allUsers
);

export const getUserById = createSelector(
  getUsersState,
  (state: fromUsers.State) => state.userById
);

export const getAllDepartment = createSelector(
  getUsersState,
  (state: fromUsers.State) => state.allDepartment
);

export const getActiveUsers = createSelector(
  getUsersState,
  (state: fromUsers.State) => state.activeUsers
);
