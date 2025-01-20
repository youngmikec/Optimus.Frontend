import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Roles] Reset Store');

export const IsLoading = createAction(
  '[Roles] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllRole = createAction(
  '[Roles] Get All Role',
  props<{
    payload: {
      skip: number;
      take: number;
      searchValue: string;
      filter: string[];
    };
  }>()
);

export const SaveAllRole = createAction(
  '[Roles] Save All Role',
  props<{
    payload: any;
  }>()
);

export const GetAllActiveRoles = createAction(
  '[Roles] Get All Active Role',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllActiveRoles = createAction(
  '[Roles] Save All Active Role',
  props<{
    payload: any;
  }>()
);

export const AssignRoleAndDepartment = createAction(
  '[Roles] Assign Role And Department',
  props<{
    payload: {
      userEmail: string;
      roleId: number;
      departmentId: number;
    };
  }>()
);

export const CreateRoleAndPermission = createAction(
  '[Roles] Create Role And Permission',
  props<{
    payload: {
      name: string;
      roleAccessLevel: number;
      rolePermissions: any;
    };
  }>()
);

export const EditRoleAndPermission = createAction(
  '[Roles] Edit Role And Permission',
  props<{
    payload: {
      roleId: number;
      name: string;
      roleAccessLevel: number;
      rolePermissions: any;
    };
  }>()
);

export const GetAllRoles = createAction(
  '[Roles] Get All Roles',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllRoles = createAction(
  '[Roles] Save All Roles',
  props<{
    payload: any;
  }>()
);

export const GetRoleById = createAction(
  '[Roles] Get Role By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetRoleById = createAction(
  '[Roles] Save Get Role By ID',
  props<{
    payload: any;
  }>()
);

export const GetRolePermissionById = createAction(
  '[Roles] Get Role Permission By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SvaeGetRolePermissionById = createAction(
  '[Roles] Save Get Role Permission By ID',
  props<{
    payload: any;
  }>()
);

export const ChangeRoleStatus = createAction(
  '[Roles] Change Role Status',
  props<{
    payload: {
      roleId: number;
    };
  }>()
);

export const SaveAllRoleStatus = createAction(
  '[Roles] Save Role Status',
  props<{
    payload: any;
  }>()
);

export const ActivateDeactivateRoles = createAction(
  '[Roles] Activate Role',
  props<{
    payload: {
      id: number;
      action: 'Activate' | 'Deactivate';
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteRole = createAction(
  '[Roles] Delete Role',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);
