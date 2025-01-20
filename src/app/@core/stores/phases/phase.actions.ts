import { createAction, props } from '@ngrx/store';

export const loadPhases = createAction('[Phase] Load Phases');
export const phaseSuccess = createAction(
  '[Phase] Load Phases Success',
  props<{ phases: [] }>()
);
export const phaseFailure = createAction(
  '[Phase] Load Phases Failure',
  props<{ error: string }>()
);
export const getPhaseById = createAction(
  '[Phase] Get Phase By ID',
  props<{ phaseId: number }>()
);
export const singlePhase = createAction(
  '[Phase] Load Single Phase Success',
  props<{ phase: any }>()
);
export const updatePhase = createAction(
  '[Phase] Update Phase',
  props<{
    id: number;
    name: string;
    description: string;
    duration: number;
    durationFrequency: number;
  }>()
);
