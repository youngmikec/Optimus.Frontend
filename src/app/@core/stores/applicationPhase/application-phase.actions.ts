import { createAction, props } from '@ngrx/store';

export const loadApplicationPhases = createAction(
  '[Application Phase] Load Application Phases',
  props<{ applicationId: number }>()
);

export const applicationPhaseSuccess = createAction(
  '[Application Phase] Load Application Phases Success',
  props<{ applicationPhases: [] }>()
);

export const applicationPhaseError = createAction(
  '[Application Phase] Load Application Phases Failed',
  props<{ error: string }>()
);

export const getApplicationPhase = createAction(
  '[Application Phase] Gets details of a single phase under the phase application ',
  props<{ applicationId: number; phaseId: number }>()
);

export const getApplicationPhaseSuccess = createAction(
  '[Application Phase] Gets details of a single phase under the phase application suvvessfully',
  props<{ phase: object }>()
);

export const startApplicationPhase = createAction(
  '[Application Phase] Start An Application Phase',
  props<{ id: number; applicationId: number }>()
);

export const updateApplicationPhase = createAction(
  '[Application Phase] Gets details of a single phase under the phase application ',
  props<{
    applicationId: number;
    applicationPhaseId: number;
    subPhase: string;
    description?: string;
    serialNo?: number;
  }>()
);

export const completeApplicationPhase = createAction(
  '[Application Phase] Complete An Application Phases',
  props<{ id: number; applicationId: number }>()
);

export const callApplicantTask = createAction(
  '[Application Phase] Create Call Applicant Task',
  props<{ applicationId: number }>()
);

export const assignSMOfficer = createAction(
  '[Application Phase] Assign SM Officers To Application Phase',
  props<{ applicationId: number }>()
);

export const assignOtherOfficer = createAction(
  '[Application Phase] Assign Other Officers to Application Phase',
  props<{ applicationId: number }>()
);

export const startOnboarding = createAction(
  '[Application Phase] Start Onboarding Application Phase'
);

export const callApplicant = createAction(
  '[Application Phase] Call Applicant on Onboarding Application Phase'
);

export const startCollation = createAction(
  '[Application Phase] Start Collation Application Phase'
);

export const startProcessing = createAction(
  '[Application Phase] Start Processing Application Phase'
);

export const startSupport = createAction(
  '[Application Phase] Start Support Application Phase'
);

export const startAudit = createAction(
  '[Application Phase] Start Audit Application Phase'
);

export const assignSM = createAction('[Application Phase] Assign SM officer');

export const assignOthers = createAction(
  '[Application Phase] Assign Other officer'
);
