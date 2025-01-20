import { createReducer, on, Action } from '@ngrx/store';
import * as ApplicantsActions from './applicants.actions';

export interface State {
  isLoading: boolean;
  allApplicants: any | null;
  singleApplicants: any | null;
  createdApplicant: any | null;
}

const initialState: State = {
  isLoading: false,
  allApplicants: null,
  singleApplicants: null,
  createdApplicant: null,
};

const applicantsReducerInternal = createReducer(
  initialState,
  on(ApplicantsActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(ApplicantsActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(ApplicantsActions.SaveAllApplicants, (state, { payload }) => ({
    ...state,
    allApplicants: payload,
  })),
  on(ApplicantsActions.SaveSingleApplicants, (state, { payload }) => ({
    ...state,
    singleApplicants: payload,
  })),
  on(ApplicantsActions.SaveCreatedApplicant, (state, { payload }) => ({
    ...state,
    createdApplicant: payload,
  }))
);

export function applicantsReducer(state: State | undefined, action: Action) {
  return applicantsReducerInternal(state, action);
}
