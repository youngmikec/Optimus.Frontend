import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction(
  '[FamilyMembersTypeSettings] Reset Store'
);

export const IsLoading = createAction(
  '[FamilyMembersTypeSettings] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllFamilyMembersTypeSettingsByCountryId = createAction(
  '[FamilyMembersTypeSettings] Get All Family Members Type Settings By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllFamilyMembersTypeSettingsByCountryId = createAction(
  '[FamilyMembersTypeSettings] Save All Family Members Type Settings By Country Id',
  props<{
    payload: any;
  }>()
);

export const CreateFamilyMemberTypeSettings = createAction(
  '[FamilyMembersTypeSettings] Create Family Members Type Settings',
  props<{
    payload: {
      countryId: number;
      name: string;
      description: string;
      familyMemberType: number;
      familyMemberTypeDesc: string;
      familyGroup: number;
      familyGroupDesc: string;
      maximumAllowed: number;
    };
  }>()
);

export const EditFamilyMemberTypeSettings = createAction(
  '[FamilyMembersTypeSettings] Edit Family Members Type Settings',
  props<{
    payload: {
      id: number;
      countryId: number;
      name: string;
      description: string;
      familyMemberType: number;
      familyMemberTypeDesc: string;
      familyGroup: number;
      familyGroupDesc: string;
      maximumAllowed: number;
    };
  }>()
);

export const ActivateFamilyMembers = createAction(
  '[FamilyMembersTypeSettings] Activate Family Members Type Settings',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const DeactivateFamilyMembers = createAction(
  '[FamilyMembersTypeSettings] Deactivate Family Members Type Settings',
  props<{
    payload: {
      id: number;
    };
  }>()
);
