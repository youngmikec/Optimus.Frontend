import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDashboard from './dashboard.reducer';

const getDashboardState = (state: fromApp.AppState) => state.dashboard;

export const getDashboardIsLoading = createSelector(
  getDashboardState,
  (state: fromDashboard.State) => state.isLoading
);

export const getAllSummary = createSelector(
  getDashboardState,
  (state: fromDashboard.State) => state.allDashboardSummary
);

export const getApplicantByGenderForDashboard = createSelector(
  getDashboardState,
  (state: fromDashboard.State) => state.applicantByGenderForDashboard
);
