import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Users] Reset Store');

export const IsLoading = createAction(
  '[Users] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllUsers = createAction(
  '[Users] Get All User',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetActiveUsers = createAction(
  '[Users] Get All Active User',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllUser = createAction(
  '[Users] Save All User',
  props<{
    payload: any;
  }>()
);

export const SaveActiveUsers = createAction(
  '[Users] Save All User',
  props<{
    payload: any;
  }>()
);

export const UpdateUser = createAction(
  '[Users] Update User',
  props<{
    payload: {
      firstName: string;
      lastName: string;
      countryCode: string;
      phoneNumber: string;
      roleId: number;
      unitId: number;
      allowMobileAccess: boolean;
      allowWebAccess: boolean;
      // numberOfDevices: number;
      deviceId: string[];
      userId: string;
      branchId: number;
      jobTitleId: string;
      profilePicture: string;
      signature: string;
    };
  }>()
);

export const DeleteUser = createAction(
  '[Users] Delete User',
  props<{
    payload: {
      userId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const UpdateUserProfilePicture = createAction(
  '[Users] Update User Profile Picture',
  props<{
    payload: {
      profilePicture: string;
    };
  }>()
);

export const UpdateUserSignature = createAction(
  '[Users] Update User Signature',
  props<{
    payload: {
      signature: string;
    };
  }>()
);

export const ChangeUserStatus = createAction(
  '[Users] Change User Status',
  props<{
    payload: {
      userId: string;
      status: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const GetUserById = createAction(
  '[Users] Get User By Id',
  props<{
    payload: {
      userId: string;
      loggedInUser: string;
    };
  }>()
);

export const SaveUserById = createAction(
  '[Users] Save User By Id',
  props<{
    payload: any;
  }>()
);

export const GetUserByIdForEdit = createAction(
  '[Users] Get User By Id For Edit',
  props<{
    payload: {
      userId: string;
      loggedInUser: string;
    };
  }>()
);

export const SaveUserByIdForEdit = createAction(
  '[Users] Save User By Id',
  props<{
    payload: any;
  }>()
);

export const CreateUser = createAction(
  '[User] Create User',
  props<{
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      countryCode: string;
      phoneNumber: string;
      roleId: number;
      unitId: number;
      allowMobileAccess: boolean;
      allowWebAccess: boolean;
      //numberOfDevices: number;
      deviceId: string[];
      branchId: number;
      jobTitleId: string;
    };
  }>()
);

// export const ChangeUserStatus = createAction(
//   '[User] Change User Status',
//   props<{
//     payload: {
//       UserId: number;
//     };
//   }>()
// );

//department

export const CreateDepartment = createAction(
  '[User] Create department',
  props<{
    payload: {
      name: string;
    };
  }>()
);

export const UpdateDepartment = createAction(
  '[User] Update department',
  props<{
    payload: {
      departmentId: number;
      name: string;
    };
  }>()
);

export const ActivateDepartment = createAction(
  '[User] Activate department',
  props<{
    payload: {
      departmentId: number;
    };
  }>()
);

export const DeactivateDepartment = createAction(
  '[User] Deactivate department',
  props<{
    payload: {
      departmentId: number;
    };
  }>()
);

export const GetDepartmentById = createAction(
  '[User] Get department By Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetAllDepartment = createAction(
  '[User] Get All department',
  props<{
    payload: {
      skip: number;
      take: number;
      searchValue: string;
      filter: string[];
    };
  }>()
);

export const SaveAllDepartment = createAction(
  '[User] Save All department',
  props<{
    payload: any[];
  }>()
);

export const ChangeDepartmentStatus = createAction(
  '[User] Change Department Status',
  props<{
    payload: {
      departmentId: number;
    };
  }>()
);
