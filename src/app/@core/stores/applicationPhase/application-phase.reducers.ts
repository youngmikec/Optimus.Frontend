import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationPhaseActions from './application-phase.actions';

export interface State {
  applicationPhases: any[];
  applicationPhasesError: string | null;
  isLoading: boolean;

  startingOnboarding: boolean;
  callApplicant: boolean;
  startingCollation: boolean;
  startingProcessing: boolean;
  startingSupport: boolean;
  startingAudit: boolean;

  assigningSM: boolean;
  assigningOthers: boolean;
}

export const initialState: State = {
  applicationPhases: [],
  applicationPhasesError: null,
  isLoading: false,

  startingOnboarding: false,
  callApplicant: false,
  startingCollation: false,
  startingProcessing: false,
  startingSupport: false,
  startingAudit: false,

  assigningSM: false,
  assigningOthers: false,
};

export const applicationPhaseReducerInternal = createReducer(
  initialState,
  on(ApplicationPhaseActions.loadApplicationPhases, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ApplicationPhaseActions.applicationPhaseSuccess, (state, action) => ({
    ...state,
    applicationPhases: action.applicationPhases,
    applicationPhasesError: null,
    isLoading: false,

    startingOnboarding: false,
    callApplicant: false,
    startingCollation: false,
    startingProcessing: false,
    startingSupport: false,
    startingAudit: false,

    assigningSM: false,
    assigningOthers: false,
  })),
  on(ApplicationPhaseActions.applicationPhaseError, (state, action) => ({
    ...state,
    applicationPhases: [],
    applicationPhasesError: action.error,
    isLoading: false,
  })),
  on(ApplicationPhaseActions.updateApplicationPhase, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ApplicationPhaseActions.startOnboarding, (state) => ({
    ...state,
    startingOnboarding: true,
  })),
  on(ApplicationPhaseActions.callApplicant, (state) => ({
    ...state,
    callApplicant: true,
  })),
  on(ApplicationPhaseActions.startCollation, (state) => ({
    ...state,
    startingCollation: true,
  })),
  on(ApplicationPhaseActions.startProcessing, (state) => ({
    ...state,
    startingProcessing: true,
  })),
  on(ApplicationPhaseActions.startSupport, (state) => ({
    ...state,
    startingSupport: true,
  })),
  on(ApplicationPhaseActions.startAudit, (state) => ({
    ...state,
    startingAudit: true,
  })),
  on(ApplicationPhaseActions.completeApplicationPhase, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ApplicationPhaseActions.assignSM, (state) => ({
    ...state,
    assigningSM: true,
  })),
  on(ApplicationPhaseActions.assignOthers, (state) => ({
    ...state,
    assigningOthers: true,
  }))
);

export function applicationPhaseReducer(
  state: State | undefined,
  action: Action
) {
  return applicationPhaseReducerInternal(state, action);
}
