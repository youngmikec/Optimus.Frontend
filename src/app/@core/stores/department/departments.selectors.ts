import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDepartments from './departments.reducer';

const getDepartmentsState = (state: fromApp.AppState) => state.departments;

export const getDepartmentsIsLoading = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.isLoading
);

export const getAllDepartments = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.allDepartments
);

export const getActiveDepartments = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.activeDepartments
);

export const getAllDivisions = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.divisions
);

export const getActiveDivisions = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.activeDivisions
);

export const getAllUnits = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.units
);

export const getDepartmentByDivisionId = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.departments
);

export const getUnitsByDepartmentId = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.units
);

export const getAllBranches = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.branches
);

export const getDepartmentsByDivisionId = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.departments
);

export const getAllBankAccounts = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.bankAccounts
);

export const getActiveBankAccounts = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.activeBankAccounts
);

export const getHeadOffice = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.headOffice
);

export const getAllJobTitle = createSelector(
  getDepartmentsState,
  (state: fromDepartments.State) => state.jobTitle
);
