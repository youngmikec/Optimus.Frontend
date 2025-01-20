import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as ApplicationPhaseReducer from './application-phase.reducers';

const selectApplicationPhase = (state: fromApp.AppState) =>
  state.applicationPhase;

export const phasesSuccessSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.applicationPhases
);

export const phasesErrorSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.applicationPhasesError
);

export const phasesLoadingSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.isLoading
);

export const startOnboardingSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.startingOnboarding
);

export const callApplicantSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.callApplicant
);

export const startCollationSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.startingCollation
);

export const startProcessingSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.startingProcessing
);

export const startSupportSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.startingSupport
);

export const startAuditSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.startingAudit
);

export const assignCMASelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.assigningSM
);

export const assignOthersSelector = createSelector(
  selectApplicationPhase,
  (state: ApplicationPhaseReducer.State) => state.assigningOthers
);
