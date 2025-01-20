import { Action, createReducer, on } from '@ngrx/store';
import * as PhaseActions from './phase.actions';

export interface State {
  isLoading: boolean;
  phases: [];
  phase: {};
  error: string | null;
}

export const initialState: State = {
  isLoading: false,
  phases: [],
  phase: {},
  error: null,
};

export const phaseReducerInternal = createReducer(
  initialState,
  on(PhaseActions.loadPhases, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(PhaseActions.phaseSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    phases: action.phases,
    error: null,
  })),
  on(PhaseActions.phaseFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),
  on(PhaseActions.updatePhase, (state) => ({
    ...state,
    isLoading: true,
  }))
  // on(PhaseActions.updatePhaseSuccess, (state) => {})
);

export function phaseReducer(state: State | undefined, action: Action) {
  return phaseReducerInternal(state, action);
}
