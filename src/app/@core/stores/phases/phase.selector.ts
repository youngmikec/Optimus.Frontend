import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as PhaseReducer from './phase.reducers';

const selectPhase = (state: fromApp.AppState) => state.phases;

export const isPhaseLoadingSelector = createSelector(
  selectPhase,
  (state: PhaseReducer.State) => state.isLoading
);
export const phasesSuccessSelector = createSelector(
  selectPhase,
  (state: PhaseReducer.State) => state.phases
);
export const phasesFailureSelector = createSelector(
  selectPhase,
  (state: PhaseReducer.State) => state.error
);
export const phaseSelector = createSelector(
  selectPhase,
  (state: PhaseReducer.State) => state.phase
);
