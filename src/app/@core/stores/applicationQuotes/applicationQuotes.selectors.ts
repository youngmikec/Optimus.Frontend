import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromApplicationQuotes from './applicationQuotes.reducer';

const getApplicationQuotesState = (state: fromApp.AppState) =>
  state.applicationQuotes;

export const getApplicationQuotesIsLoading = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.isLoading
);

export const getApplicationQuotesSuccessAction = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.successAction
);

export const getAllApplicationQuote = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.allApplicationQuotes
);

export const getApplicationQuoteById = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.applicationQuoteById
);

export const getCreatedApplication = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.createdApplication
);

export const getCreatedApplicationResponse = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.applicationQuotesCreateResponse
);

export const getApplicantsApplication = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.applicantsApplication
);

export const getApplicationQuoteAuthorization = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.applicationQuotesAuthorization
);

export const getApplicationQuoteAuthorizationSummary = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) =>
    state.applicationQuotesAuthorizationSummary
);

export const getApplicationQuoteAuthorizationSummaryLoading = createSelector(
  getApplicationQuotesState,
  (state: fromApplicationQuotes.State) => state.isLoadingSummary
);
