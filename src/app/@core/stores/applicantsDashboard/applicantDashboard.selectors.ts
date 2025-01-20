import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromApplicantsDashboard from './applicantDashboard.reducer';

const getApplicantsDashboardState = (state: fromApp.AppState) =>
  state.applicantsDashboard;

export const getApplicantsDashboardIsLoading = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.isLoading
);

export const getApplicantsDashboard = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.applicantDashboard
);

export const getMainApplicantsDashboard = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.mainApplicantDashboard
);

export const getTopApplicants = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.topApplicant
);

export const getApplicantsCountByCountry = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.applicantCountByCountry
);

export const getTopCountryByApplicant = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.topCountryByApplicant
);

export const getSingleApplicantDashboardQuery = createSelector(
  getApplicantsDashboardState,
  (state: fromApplicantsDashboard.State) => state.singleApplicantDashboard
);
