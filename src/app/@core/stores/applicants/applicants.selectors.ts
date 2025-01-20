import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromApplicants from './applicants.reducer';

const getApplicantsState = (state: fromApp.AppState) => state.applicants;

export const getApplicantsIsLoading = createSelector(
  getApplicantsState,
  (state: fromApplicants.State) => state.isLoading
);

export const getAllApplicants = createSelector(
  getApplicantsState,
  (state: fromApplicants.State) => state.allApplicants
);

export const getSingleApplicants = createSelector(
  getApplicantsState,
  (state: fromApplicants.State) => state.singleApplicants
);

export const getCreatedApplicant = createSelector(
  getApplicantsState,
  (state: fromApplicants.State) => state.createdApplicant
);
