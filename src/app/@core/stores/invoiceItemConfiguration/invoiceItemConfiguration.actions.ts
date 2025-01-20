import { createAction, props } from '@ngrx/store';
import { IGET_INVOICE_CONFIG_RES } from '../../models/invoice';

export const IsLoading = createAction(
  '[Invoice Item Configuration] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetInvoiceItems = createAction(
  '[Invoice Item Configuration] Get Invoice Items',
  props<{
    payload: {
      skip: number;
      take: number;
      filter?: string | null;
    };
  }>()
);

export const GetInvoiceItemsByCountryId = createAction(
  '[Invoice Item Configuration] Get Invoice Items By Country Id',
  props<{
    payload: {
      skip: number;
      take: number;
      countryId: number;
    };
  }>()
);

export const SaveInvoiceItemsByCountryId = createAction(
  '[Invoice Item Configuration] Save Invoice Items By Country ID',
  props<{
    payload: any;
  }>()
);

export const SaveAllInvoiceItems = createAction(
  '[Invoice Item Configuration] Save All Invoice Items',
  props<{
    payload: IGET_INVOICE_CONFIG_RES[];
  }>()
);

export const ClearAllInvoiceItems = createAction(
  '[Invoice Item Configuration] Clear All Invoice Items'
);

export const GetInvoiceItemsById = createAction(
  '[Invoice Item Configuration] Get Invoice Items ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetInvoiceItemsById = createAction(
  '[Invoice Item Configuration] Save Get Invoice Item By ID',
  props<{
    payload: any;
  }>()
);

export const CreateInvoiceItem = createAction(
  '[Invoice Item Configuration] Create Invoice Item',
  props<{
    payload: {
      name: string;
      countryId: number;
      allMigrationRoute: number;
      migrationRouteId: number;
      percentageCountryFee: number;
      percentageLocalFee: number;
      localFeeAmount: number;
      isLocalFee: boolean;
      isPaymentPlan: boolean;
    };
  }>()
);

export const ActivateInvoiceItemStatus = createAction(
  '[Invoice Item Configuration] Activate Invoice Item Status',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const DeactivateInvoiceItemStatus = createAction(
  '[Invoice Item Configuration] Deactivate Invoice Item Status',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const DeleteInvioiceItemConfig = createAction(
  '[Invoice Item Configuration] Delete Invoice Item Status',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const UpdateInvoiceItem = createAction(
  '[Invoice Item Configuration] Update Invoice Item',
  props<{
    payload: {
      id: number;
      name: string;
      countryId: number;
      allMigrationRoute: number;
      migrationRouteId: number;
      percentageCountryFee: number;
      percentageLocalFee: number;
      localFeeAmount: number;
      isLocalFee: boolean;
      isPaymentPlan: boolean;
      take?: number;
      skip?: number;
    };
  }>()
);

export const UpdateInvoiceItemFailure = createAction(
  '[Invoice Item Configuration] Update Invoice Item Failure',
  props<{
    error: string;
  }>()
);
