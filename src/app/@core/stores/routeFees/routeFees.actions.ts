import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[RouteFees] Reset Store');

export const IsLoading = createAction(
  '[RouteFees] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const SuccessAction = createAction(
  '[RouteFees] Success Action',
  props<{
    payload: boolean;
  }>()
);

export const GetAllRouteFees = createAction('[routeFees] Get All Route Fees');

export const SaveAllRouteFees = createAction(
  '[RouteFees] Save All Route Fees',
  props<{
    payload: any;
  }>()
);

export const GetAllRouteFeesByMigrationId = createAction(
  '[RouteFees] Get Route Fees By Migration Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllRouteFeesByMigrationId = createAction(
  '[RouteFees] Save Get Route Fees By Migration Id',
  props<{
    payload: any;
  }>()
);

export const CreateRouteFees = createAction(
  '[RouteFees] Create Route Fees',
  props<{
    payload: {
      name: string;
      description: string;
      migrationRouteId: number;
      familyMemberId: number;
      feeType: number;
      // feeTypeDesc: string;
      feeBasis: number;
      feeCategory: number;
      // feeBasisDesc: string;
      amount: number;
      routeFeeItems: any[];
      currencyCode: string;
      serialNumber: number | null;

      feeCategoryAForComputeOperation: number;
      feeCategoryBForComputeOperation: number;
      feeCategoryCForComputeOperation: number;
      firstComputeOperation: number;
      secondComputeOperation: number;

      feeCapAmount: number;
      numberOfFamilyMembersFeeCap: number;
      hasRealEstateInvestmentTier: boolean;
      applicationIncludesSpouse: boolean;
    };
  }>()
);

export const EditRouteFees = createAction(
  '[RouteFees] Edit Route Fees',
  props<{
    payload: {
      id: number;
      name: string;
      description: string;
      migrationRouteId: number;
      familyMemberId: number;
      feeType: number;
      // feeTypeDesc: string;
      feeBasis: number;
      feeCategory: number;
      // feeBasisDesc: string;
      amount: number;
      routeFeeItems: any[];
      currencyCode: string;
      serialNumber: number | null;

      feeCategoryAForComputeOperation: number;
      feeCategoryBForComputeOperation: number;
      feeCategoryCForComputeOperation: number;
      firstComputeOperation: number;
      secondComputeOperation: number;

      feeCapAmount: number;
      numberOfFamilyMembersFeeCap: number;
      hasRealEstateInvestmentTier: boolean;
      applicationIncludesSpouse: boolean;
    };
  }>()
);

export const DeleteRouteFee = createAction(
  '[RouteFee] Delete Route Fee',
  props<{
    payload: {
      id: number;
      migrationRouteId: number;
    };
  }>()
);

export const EditMultipleRouteFee = createAction(
  '[RouteFee] Edit Multiple RouteFee',
  props<{
    payload: {
      migrationRouteId: number;
      routeFees: any[];
    };
  }>()
);

export const ActivateRouteFees = createAction(
  '[RouteFees] Activate Route Fees',
  props<{
    payload: {
      id: number;
      migrationId: number;
    };
  }>()
);

export const DeactivateRouteFees = createAction(
  '[RouteFees] Deactivate Route Fees',
  props<{
    payload: {
      id: number;
      migrationId: number;
    };
  }>()
);

export const UpdateRouteFeesSerialNumber = createAction(
  '[RouteFees] Update Route Fee Serial Number',
  props<{
    payload: {
      routeFees: UpdateSerialNumberInterface[];
      migrationRouteId: number;
    };
  }>()
);

export const UpdateRouteFeesSerialNumberSuccess = createAction(
  '[RouteFees] Update Route Fees Serial Number Success',
  props<{
    payload: any;
  }>()
);

export const UpdateRouteFeesSerialNumberFail = createAction(
  '[RouteFees] Update Route Fees Serial Number Fail',
  props<{
    payload: any;
  }>()
);

interface UpdateSerialNumberInterface {
  routeId: number;
  serialNumber: number;
}

// export interface RouteFeeItemData {
//   familyGroup?: number;
//   familyGroupDesc?: string;
//   fixedNoOfPeople?: number;
//   familyMemberId?: number;
//   minimumAge?: number;
//   maximumAge?: number;
//   amount?: number;
//   isDeleted?: number;
//   id?: number;
//   name?: string;
//   description?: string;
//   userId?: string;
// }
