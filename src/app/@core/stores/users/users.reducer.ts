import { createReducer, on, Action } from '@ngrx/store';
import * as UsersActions from './users.actions';

export interface State {
  isLoading: boolean;
  allUsers: any[] | null;
  user: any[] | null;
  allDepartment: any | null;
  userById: any;
  activeUsers: any | null;
}

const initialState: State = {
  isLoading: false,
  allUsers: null,
  user: [],
  allDepartment: null,
  userById: null,
  activeUsers: null,
};

const usersReducerInternal = createReducer(
  initialState,
  on(UsersActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(UsersActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(UsersActions.SaveAllUser, (state, { payload }) => ({
    ...state,
    allUsers: payload,
  })),
  on(UsersActions.SaveActiveUsers, (state, { payload }) => ({
    ...state,
    activeUsers: payload,
  })),
  on(UsersActions.SaveUserById, (state, { payload }) => ({
    ...state,
    userById: payload,
  })),
  on(UsersActions.SaveAllDepartment, (state, { payload }) => ({
    ...state,
    user: payload,
  }))
);

export function usersReducer(state: State | undefined, action: Action) {
  return usersReducerInternal(state, action);
}
