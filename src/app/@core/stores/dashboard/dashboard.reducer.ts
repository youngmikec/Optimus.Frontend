import { createReducer, on, Action } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface State {
  isLoading: boolean;
  allDashboardSummary: any[] | null;
  applicantByGenderForDashboard: any | null;
}

const initialState: State = {
  isLoading: false,
  allDashboardSummary: null,
  applicantByGenderForDashboard: null,
};

const dashboardReducerInternal = createReducer(
  initialState,
  on(DashboardActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(DashboardActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(DashboardActions.SaveAllSummary, (state, { payload }) => ({
    ...state,
    allDashboardSummary: payload,
  })),
  on(
    DashboardActions.SaveApplicantsByGenderForDashboard,
    (state, { payload }) => ({
      ...state,
      applicantByGenderForDashboard: payload,
    })
  )
);
export function DashboardReducer(state: State | undefined, action: Action) {
  return dashboardReducerInternal(state, action);
}
