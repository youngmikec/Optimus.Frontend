import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Features] Reset Store');

export const IsLoading = createAction(
  '[Features] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const CreateFeature = createAction(
  '[Features] Create Feature',
  props<{
    payload: {
      parentFeatureId: number;
      name: string;
      permissionAccessLevels: any;
    };
  }>()
);

export const EditFeature = createAction(
  '[Features] Edit Feature',
  props<{
    payload: {
      id: number;
      parentFeatureId: number;
      name: string;
      permissionAccessLevels: any;
    };
  }>()
);

export const GetAllFeatures = createAction(
  '[Features] Get All Feature',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllFeatures = createAction(
  '[Features] Save All Feature',
  props<{
    payload: any[];
  }>()
);

export const ToggleFeatureStatus = createAction(
  '[Features] Toggle Permission Status',
  props<{
    payload: {
      featureId: number;
    };
  }>()
);

export const TogglePermissionStatus = createAction(
  '[Features] Toggle Permission Status',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetAllAccessLevels = createAction(
  '[Features] Get All Access Levels',
  props<{
    payload: {
      accesslevel: number;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllAccessLevels = createAction(
  '[Features] Save All Access Levels',
  props<{
    payload: any[];
  }>()
);

export const GetPermissionByAccessLevel = createAction(
  '[Features] Get Permission By Access Level',
  props<{
    payload: {
      skip: number;
      take: number;
      accessLevel: number;
    };
  }>()
);

export const SavePermissionByAccessLevel = createAction(
  '[Features] Save Permission By Access Level',
  props<{
    payload: any[];
  }>()
);
