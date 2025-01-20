import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[ApplicantsDashboard] Reset Store');

export const IsLoading = createAction(
  '[ApplicantsDashboard] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetApplicantsDashboardQuery = createAction(
  '[ApplicantsDashboard] Get Applicants Dashboard Query',
  props<{
    payload: {
      year: number;
    };
  }>()
);

export const SaveApplicantsDashboardQuery = createAction(
  '[ApplicantsDashboard] Save Applicants Dashboard Query',
  props<{
    payload: any;
  }>()
);

export const GetMainApplicantsDashboard = createAction(
  '[ApplicantsDashboard] Get Main Applicants Dashboard',
  props<{
    payload: {
      year: number;
    };
  }>()
);

export const SaveMainApplicantsDashboard = createAction(
  '[ApplicantsDashboard] Save Main Applicants Dashboard',
  props<{
    payload: any;
  }>()
);

export const GetTopApplicants = createAction(
  '[ApplicantsDashboard] Get Top Applicants',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveTopApplicants = createAction(
  '[ApplicantsDashboard] Save Top Applicants',
  props<{
    payload: any;
  }>()
);

export const GetApplicantsCountByCountry = createAction(
  '[ApplicantsDashboard] Get Applicants Count By Country'
);

export const SaveApplicantsCountByCountry = createAction(
  '[ApplicantsDashboard] Save Applicants Count By Country',
  props<{
    payload: any;
  }>()
);

export const GetTopCountryByApplicant = createAction(
  '[ApplicantsDashboard] Get Top Country By Applicant',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveTopCountryByApplicant = createAction(
  '[ApplicantsDashboard] Save Top Country By Applicant',
  props<{
    payload: any;
  }>()
);

export const GetSingleApplicantsDashboardQuery = createAction(
  '[ApplicantsDashboard] Get Single Applicants Dashboard Query',
  props<{
    payload: {
      applicantId: number;
    };
  }>()
);

export const SaveSingleApplicantsDashboardQuery = createAction(
  '[ApplicantsDashboard] Save Single Applicants Dashboard Query',
  props<{
    payload: any;
  }>()
);
