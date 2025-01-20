import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Applicants] Reset Store');

export const IsLoading = createAction(
  '[Applicants] Is Loading',
  props<{
    payload: boolean;
  }>()
);
export const GetAllApplicants = createAction(
  '[Applicants] Get All Applicants',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllApplicants = createAction(
  '[Applicants] Save All Applicants',
  props<{
    payload: any[];
  }>()
);

export const GetSingleApplicants = createAction(
  '[Applicants] Get Single Applicants',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveSingleApplicants = createAction(
  '[Applicants] Save Single Applicants',
  props<{
    payload: any;
  }>()
);

export const CreateApplicant = createAction(
  '[Applicants] Create Applicant',
  props<{
    payload: {
      rmId: string;
      firstName: string;
      lastName: string;
      email: string;
      mobileNo: string;
      mobileNo2: string;
      gender: number;
      maritalStatus: number;
      address: string;
      city: string;
      postalCode: string;
      state: string;
      country: string;

      countryCode: string;
      countryCode2: string;
      area: string;
      street: string;
      building: string;
    };
  }>()
);

export const SaveCreatedApplicant = createAction(
  '[Applicants] Save Created Applicant',
  props<{
    payload: any;
  }>()
);

export const UpdateApplicant = createAction(
  '[Applicants] Update Applicant',
  props<{
    payload: {
      id: number;
      rmId: string;
      firstName: string;
      lastName: string;
      email: string;
      mobileNo: string;
      mobileNo2: string;
      gender: number;
      maritalStatus: number;
      address: string;
      city: string;
      postalCode: string;
      state: string;
      country: string;

      countryCode: string;
      countryCode2: string;
      area: string;
      street: string;
      building: string;
    };
  }>()
);

export const ChangeApplicantstatus = createAction(
  '[Applicants] Change Applicant Status',
  props<{
    payload: {
      applicantId: number;
    };
  }>()
);

export const ActivateApplicant = createAction(
  '[Applicants] Activate Applicant',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeactivateApplicant = createAction(
  '[Applicants] Deactivate Applicant',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeleteApplicant = createAction(
  '[Applicants] Delete Applicant',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);
