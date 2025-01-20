import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[FamilyMembers] Reset Store');

export const IsLoading = createAction(
  '[FamilyMembers] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllFamilyMembers = createAction(
  '[FamilyMembers] Get All Family Members'
);

export const GetAllFamilyMembersByCountryId = createAction(
  '[FamilyMembers] Get All Family Members By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllFamilyMembers = createAction(
  '[FamilyMembers] Save All Family Members',
  props<{
    payload: any;
  }>()
);

export const SaveAllFamilyMembersByCountryId = createAction(
  '[FamilyMembers] Save All Family Members By Country Id',
  props<{
    payload: any;
  }>()
);

export const CreateFamilyMembers = createAction(
  '[FamilyMembers] Create Family Members',
  props<{
    payload: {
      countryId: number;
      name: string;
      description: string;
      familyMemberType: number;
      // familyMemberTypeDesc: string;
      // familyGroup: number;
      // familyGroupDesc: string;
      maximumAllowed: number;
      minimumAge: number;
      maximumAge: number;
      isMentallyChallenged: boolean;
      // hasChildren: boolean;
      // isMarried: boolean;
      // isSchooling: boolean;
      // isQualified: boolean;
    };
  }>()
);

export const EditFamilyMembers = createAction(
  '[FamilyMembers] Edit Family Members',
  props<{
    payload: {
      id: number;
      countryId: number;
      name: string;
      description: string;
      familyMemberType: number;
      // familyMemberTypeDesc: string;
      // familyGroup: number;
      // familyGroupDesc: string;
      maximumAllowed: number;
      minimumAge: number;
      maximumAge: number;
      isMentallyChallenged: boolean;
      // hasChildren: boolean;
      // isMarried: boolean;
      // isSchooling: boolean;
      // isQualified: boolean;
    };
  }>()
);

export const ActivateFamilyMembers = createAction(
  '[FamilyMembers] Activate Family Members',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const DeactivateFamilyMembers = createAction(
  '[FamilyMembers] Deactivate Family Members',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const DeleteFamilyMember = createAction(
  '[FamilyMembers] Delete Family Member',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const GetActiveFamilyMembersByCountryId = createAction(
  '[FamilyMembers] Get Active Family Members By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveActiveFamilyMembers = createAction(
  '[FamilyMembers] Save Active Family Members',
  props<{
    payload: any;
  }>()
);

export const getFamilyMembersByApplicationId = createAction(
  '[FamilyMembers] Get All Family Members By An Application',
  props<{ applicationId: number }>()
);

export const getFamilyMembersByApplicationSuccess = createAction(
  '[FamilyMembers] Get All Family Members By an Application Successfully',
  props<{ familyMembers: any[] }>()
);
