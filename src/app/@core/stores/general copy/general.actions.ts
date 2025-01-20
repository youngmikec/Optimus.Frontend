import { createAction, props } from '@ngrx/store';

export const IsLoading = createAction(
  '[General] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllAccessLevels = createAction(
  '[General] Get All Access Levels'
);

export const SaveAllAccessLevels = createAction(
  '[General] Save All Access Levels',
  props<{
    payload: any[];
  }>()
);

export const GetCountryCodes = createAction('[General] Get Country Codes');

export const SaveCountryCodes = createAction(
  '[General] Save Country Codes',
  props<{
    payload: any[] | null;
  }>()
);

export const GetFamilyGroups = createAction('[General] Get Family Groups');

export const SaveFamilyGroups = createAction(
  '[General] Save Family Groups',
  props<{
    payload: any[] | null;
  }>()
);

export const GetFamilyTypes = createAction('[General] Get Family Types');

export const SaveFamilyTypes = createAction(
  '[General] Save Family Types',
  props<{
    payload: any[] | null;
  }>()
);

export const GetQuestionResponseType = createAction(
  '[General] Get Question Response Type'
);

export const SaveQuestionResponseType = createAction(
  '[General] Save Question Response Types',
  props<{
    payload: any[] | null;
  }>()
);

export const GetFeeType = createAction('[General] Get Fee Type');

export const SaveFeeType = createAction(
  '[General] Save Fee Types',
  props<{
    payload: any[] | null;
  }>()
);

export const GetFeeBases = createAction('[General] Get Fee Bases');

export const SaveFeeBases = createAction(
  '[General] Save Fee Bases',
  props<{
    payload: any[] | null;
  }>()
);

export const GetAllDeviceType = createAction('[General] Get All Device Type');

export const SaveAllDeviceType = createAction(
  '[General] Save All Device Type',
  props<{
    payload: any[];
  }>()
);
