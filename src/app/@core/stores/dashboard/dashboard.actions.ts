import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Dashboard] Reset Store');

export const IsLoading = createAction(
  '[Dashboard] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllSummary = createAction(
  '[Dashboard] Get All Dashboard Summary',
  props<{
    payload: {
      filter: Date;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllSummary = createAction(
  '[Dashboard] Save All Dashboard Summary',
  props<{
    payload: any;
  }>()
);

export const GetApplicantsByGenderForDashboard = createAction(
  '[Dashboard] Get Applicants By Gender For Dashboard',
  props<{
    payload: {
      filter: string;
    };
  }>()
);

export const SaveApplicantsByGenderForDashboard = createAction(
  '[Dashboard] Save Applicants By Gender For Dashboard',
  props<{
    payload: any;
  }>()
);
