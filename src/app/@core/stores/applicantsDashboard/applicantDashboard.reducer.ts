import { createReducer, on, Action } from '@ngrx/store';
import * as ApplicantsDashboardActions from './applicantDashboard.actions';

export interface State {
  isLoading: boolean;
  applicantDashboard: any | null;
  mainApplicantDashboard: any | null;
  topApplicant: any[] | null;
  applicantCountByCountry: any | null;
  topCountryByApplicant: any | null;
  singleApplicantDashboard: any | null;
}

const initialState: State = {
  isLoading: false,
  applicantDashboard: null,
  mainApplicantDashboard: null,
  topApplicant: null,
  applicantCountByCountry: null,
  topCountryByApplicant: null,
  singleApplicantDashboard: null,
};

const applicantsDashboardReducerInternal = createReducer(
  initialState,
  on(ApplicantsDashboardActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(ApplicantsDashboardActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(
    ApplicantsDashboardActions.SaveApplicantsDashboardQuery,
    (state, { payload }) => ({
      ...state,
      applicantDashboard: payload,
    })
  ),
  on(
    ApplicantsDashboardActions.SaveMainApplicantsDashboard,
    (state, { payload }) => ({
      ...state,
      mainApplicantDashboard: payload,
    })
  ),
  on(ApplicantsDashboardActions.SaveTopApplicants, (state, { payload }) => ({
    ...state,
    topApplicant: payload,
  })),
  on(
    ApplicantsDashboardActions.SaveApplicantsCountByCountry,
    (state, { payload }) => ({
      ...state,
      applicantCountByCountry: payload,
    })
  ),
  on(
    ApplicantsDashboardActions.SaveTopCountryByApplicant,
    (state, { payload }) => ({
      ...state,
      topCountryByApplicant: payload,
    })
  ),
  on(
    ApplicantsDashboardActions.SaveSingleApplicantsDashboardQuery,
    (state, { payload }) => ({
      ...state,
      singleApplicantDashboard: payload,
    })
  )
);

export function applicantsDashboardReducer(
  state: State | undefined,
  action: Action
) {
  return applicantsDashboardReducerInternal(state, action);
}
