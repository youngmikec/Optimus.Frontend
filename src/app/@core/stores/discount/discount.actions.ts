import { createAction, props } from '@ngrx/store';
import { IDiscountRequestStats } from '../../models/discount-request.model';

export const ClearState = createAction('[Discount] Clear State');
export const ClearActiveDiscountState = createAction(
  '[Discount] Clear Active Discount State'
);

export const GetAllDiscount = createAction(
  '[Discount] Get All Discount',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetAllDiscountByCountryId = createAction(
  '[Discount] Get All Discount By Country Id',
  props<{
    payload: {
      skip: number;
      take: number;
      countryId: number;
    };
  }>()
);

export const GetActiveDiscountByCountryIdAndMigrationRouteId = createAction(
  '[Discount] Get Active Discount By Country Id And MigrationRouteId',
  props<{
    payload: {
      skip: number;
      take: number;
      countryId: number;
      migrationRouteId?: number;
    };
  }>()
);

export const SaveGetAllDiscount = createAction(
  '[Discount] Save Get All Discount',
  props<{
    payload: any;
  }>()
);

export const SaveGetAllDiscountByCountryId = createAction(
  '[Discount] Save Get All Discount Country Id',
  props<{
    payload: any;
  }>()
);

export const SaveGetActiveDiscountByCountryIdAndMigrationRouteId = createAction(
  '[Discount] Save Get Active Discount By Country Id And MigrationRouteId',
  props<{
    payload: any;
  }>()
);

export const GetAllDiscountRequest = createAction(
  '[Discount] Get All Discount Requests',
  props<{
    payload: {
      skip: number;
      take: number;
      status?: number;
    };
  }>()
);

export const SaveGetAllDiscountRequests = createAction(
  '[Discount] Save Get All Discount Request',
  props<{
    payload: any;
  }>()
);

export const IsLoading = createAction(
  '[Discount] IsLoading Discount',
  props<{
    payload: boolean;
  }>()
);

export const StatLoading = createAction(
  '[Discount] Stat Loading',
  props<{
    payload: boolean;
  }>()
);

export const ApprovalIsLoading = createAction(
  '[Discount] Approval IsLoading',
  props<{
    payload: boolean;
  }>()
);

export const GetDiscountRequestStats = createAction(
  '[Discount] Get Discount Request Stats'
);

export const GetDiscountTypes = createAction('[Discount] Get Discount Types');

export const SaveDiscounTypes = createAction(
  '[Discount] Save Discount Type',
  props<{
    payload: any;
  }>()
);

export const SaveDiscountRequestStats = createAction(
  '[Discount] Save Discount Request Stats',
  props<{
    payload: IDiscountRequestStats;
  }>()
);

export const CreateDiscount = createAction(
  '[Discount] Create Discount',
  props<{
    payload: {
      countryId: string;
      migrationRouteId: number;
      applicationId: number;
      discountType: string;
      discountPercentage?: number;
      flatAmount?: number;
      startDate: string;
      endDate: string;
      skip?: number;
      take?: number;
    };
  }>()
);

export const CreateEditDiscountSuccess = createAction(
  '[Discount] Create Edit Discount Success'
);

export const ResetCreateEditDiscountState = createAction(
  '[Discount] Reset Create Edit Discount State'
);

export const ApproveDiscountRequest = createAction(
  '[Discount] Approve Discount Request',
  props<{
    payload: {
      id: number;
      discountId: number;
      status: number;
      approvedDiscountAmount: number;
      approvedDiscountPercentage: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const RejectDiscountRequest = createAction(
  '[Discount] Reject Discount Request',
  props<{
    payload: {
      id: number;
      discountId: number;
      status: number;
      approvedDiscountAmount: number;
      approvedDiscountPercentage: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const UpdateDiscountRequestStatus = createAction(
  '[Discount] Update Discount Request Status',
  props<{
    payload: {
      id: number;
      status: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const UpdateDiscountStatus = createAction(
  '[Discount] Update Discount Status',
  props<{
    payload: {
      id: number;
      status: number;
      countryId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const EditDiscount = createAction(
  '[Discount] Edit Discount',
  props<{
    payload: {
      id: number;
      countryId: string;
      migrationRouteId: number;
      applicationId: number;
      discountType: string;
      discountPercentage?: number;
      flatAmount?: number;
      startDate: string;
      endDate: string;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteDiscount = createAction(
  '[Discount] Delete Discount',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteDiscountRequest = createAction(
  '[Discount] Delete Discount Request',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);
