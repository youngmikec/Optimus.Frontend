import { createReducer, on, Action } from '@ngrx/store';
import * as RolesActions from './roles.actions';

export interface State {
  isLoading: boolean;
  allRoles: any[] | null;
  role: any;
  rolePermissions: any[];
  allSuperUserRole: any;
  roleStatus: any;
  allActiveRoles: any;
}

const initialState: State = {
  isLoading: false,
  allRoles: null,
  role: null,
  rolePermissions: [],
  allSuperUserRole: null,
  roleStatus: null,
  allActiveRoles: null,
};

const rolesReducerInternal = createReducer(
  initialState,
  on(RolesActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(RolesActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(RolesActions.SaveAllRole, (state, { payload }) => ({
    ...state,
    allRoles: payload,
  })),
  on(RolesActions.SaveGetRoleById, (state, { payload }) => ({
    ...state,
    role: payload,
  })),
  on(RolesActions.SaveAllRoleStatus, (state, { payload }) => ({
    ...state,
    roleStatus: payload,
  })),
  on(RolesActions.SvaeGetRolePermissionById, (state, { payload }) => ({
    ...state,
    rolePermissions: payload,
  })),
  on(RolesActions.SaveAllActiveRoles, (state, { payload }) => ({
    ...state,
    allActiveRoles: payload,
  }))
);

export function rolesReducer(state: State | undefined, action: Action) {
  return rolesReducerInternal(state, action);
}
