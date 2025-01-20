import { createReducer, on, Action } from '@ngrx/store';
import * as DepartmentsActions from './departments.actions';

export interface State {
  isLoading: boolean;
  allDepartments: any[] | null;
  activeDepartments: any[] | null;
  divisions: any;
  activeDivisions: any;
  units: any;
  branches: any;
  departments: any;
  bankAccounts: any;
  activeBankAccounts: any;
  headOffice: any;
  jobTitle: any;
}

const initialState: State = {
  isLoading: false,
  allDepartments: null,
  activeDepartments: null,
  divisions: null,
  activeDivisions: null,
  units: null,
  branches: null,
  departments: null,
  bankAccounts: null,
  activeBankAccounts: null,
  headOffice: null,
  jobTitle: null,
};

const departmentsReducerInternal = createReducer(
  initialState,
  on(DepartmentsActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(DepartmentsActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(DepartmentsActions.SaveAllDepartments, (state, { payload }) => ({
    ...state,
    allDepartments: payload,
  })),
  on(DepartmentsActions.SaveActiveDepartments, (state, { payload }) => ({
    ...state,
    activeDepartments: payload,
  })),
  on(DepartmentsActions.SaveAllDivisions, (state, { payload }) => ({
    ...state,
    divisions: payload,
  })),
  on(DepartmentsActions.SaveActiveDivisions, (state, { payload }) => ({
    ...state,
    activeDivisions: payload,
  })),
  on(DepartmentsActions.SaveAllUnits, (state, { payload }) => ({
    ...state,
    units: payload,
  })),
  on(
    DepartmentsActions.SaveAllDivisionsByDepartmentId,
    (state, { payload }) => ({
      ...state,
      divisions: payload,
    })
  ),
  on(
    DepartmentsActions.SaveAllDepartmentsByDivisionId,
    (state, { payload }) => ({
      ...state,
      departments: payload,
    })
  ),

  on(DepartmentsActions.SaveAllUnitsByDepartmentId, (state, { payload }) => ({
    ...state,
    units: payload,
  })),

  on(DepartmentsActions.SaveAllBranches, (state, { payload }) => ({
    ...state,
    branches: payload,
  })),

  on(DepartmentsActions.SaveAllBankAccounts, (state, { payload }) => ({
    ...state,
    bankAccounts: payload,
  })),

  on(DepartmentsActions.SaveActiveBankAccounts, (state, { payload }) => ({
    ...state,
    activeBankAccounts: payload,
  })),

  on(DepartmentsActions.SaveHeadOffice, (state, { payload }) => ({
    ...state,
    headOffice: payload,
  })),

  on(DepartmentsActions.GetJobTitle, (state) => ({
    ...state,
  })),

  on(DepartmentsActions.SaveAllJobTitle, (state, { payload }) => ({
    ...state,
    jobTitle: payload,
  }))
);

export function departmentsReducer(state: State | undefined, action: Action) {
  return departmentsReducerInternal(state, action);
}
