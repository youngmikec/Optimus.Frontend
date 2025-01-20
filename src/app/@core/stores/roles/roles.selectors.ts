import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDepartments from './roles.reducer';

const getRolesState = (state: fromApp.AppState) => state.roles;

export const getRolesIsLoading = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.isLoading
);

export const getAllRoles = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.allRoles
);

export const getAllActiveRoles = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.allActiveRoles
);

export const getRoleById = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.role
);

export const getRolePermissions = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.rolePermissions
);

export const getAllSuperUserRole = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.allSuperUserRole
);

export const getRoleStatus = createSelector(
  getRolesState,
  (state: fromDepartments.State) => state.roleStatus
);
