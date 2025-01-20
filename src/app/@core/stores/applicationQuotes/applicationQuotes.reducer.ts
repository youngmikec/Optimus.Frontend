import { createReducer, on, Action } from '@ngrx/store';
import * as ApplicationQuotesActions from './applicationQuotes.actions';
import {
  ApplicationResponseSchema,
  CreateApplicationResponseSchema,
} from './applicationQuotes.actions';

export interface State {
  isLoading: boolean;
  successAction: boolean;
  allApplicationQuotes: ApplicationResponseSchema[] | null;
  applicationQuoteById: ApplicationResponseSchema | null;
  applicationQuotesCreateResponse: CreateApplicationResponseSchema | null;
  createdApplication: any | null;
  applicantsApplication: [];
  applicationQuotesAuthorization: any[] | null;
  applicationQuotesAuthorizationSummary: any | null;
  isLoadingSummary: boolean;
}

const initialState: State = {
  isLoading: false,
  successAction: false,
  allApplicationQuotes: null,
  applicationQuoteById: null,
  applicationQuotesCreateResponse: null,
  createdApplication: null,
  applicantsApplication: [],
  applicationQuotesAuthorization: null,
  applicationQuotesAuthorizationSummary: null,
  isLoadingSummary: true,
};

const applicationQuotesReducerInternal = createReducer(
  initialState,

  on(ApplicationQuotesActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(ApplicationQuotesActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(ApplicationQuotesActions.SuccessAction, (state, { payload }) => ({
    ...state,
    successAction: payload,
  })),
  on(
    ApplicationQuotesActions.SaveAllApplicationQuotes,
    (state, { payload }) => ({
      ...state,
      allApplicationQuotes: payload,
    })
  ),
  on(
    ApplicationQuotesActions.SaveApplicationQuoteById,
    (state, { payload }) => ({
      ...state,
      applicationQuoteById: payload,
    })
  ),
  on(ApplicationQuotesActions.SaveCreatedApplication, (state, { payload }) => ({
    ...state,
    createdApplication: payload,
  })),
  on(
    ApplicationQuotesActions.SaveApplicationQuotesCreateResponse,
    (state, { payload }) => ({
      ...state,
      applicationQuotesCreateResponse: payload,
    })
  ),
  on(
    ApplicationQuotesActions.SaveApplicantsApplication,
    (state, { payload }) => ({
      ...state,
      applicantsApplication: payload,
    })
  ),
  on(
    ApplicationQuotesActions.SaveApplicationQuotesAuthorizations,
    (state, { payload }) => ({
      ...state,
      applicationQuotesAuthorization: payload,
    })
  ),
  on(
    ApplicationQuotesActions.SaveApplicationQuotesAuthorizationsSummary,
    (state, { payload }) => ({
      ...state,
      applicationQuotesAuthorizationSummary: payload,
      isLoadingSummary: false,
    })
  ),
  on(
    ApplicationQuotesActions.SaveApplicationQuotesAuthorizationsSummaryError,
    (state) => ({
      ...state,
      applicationQuotesAuthorizationSummary: null,
      isLoadingSummary: false,
    })
  ),
  on(ApplicationQuotesActions.ClearApplicationQuoteById, (state) => ({
    ...state,
    applicationQuoteById: null,
  })),
  on(ApplicationQuotesActions.Clear, () => initialState)
);

export function applicationQuotesReducer(
  state: State | undefined,
  action: Action
) {
  return applicationQuotesReducerInternal(state, action);
}
