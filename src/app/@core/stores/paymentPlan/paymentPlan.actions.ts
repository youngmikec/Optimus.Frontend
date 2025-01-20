import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[PaymentPlan] Reset Store');

export const IsLoading = createAction(
  '[PaymentPlan] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllPaymentPlanByCountryId = createAction(
  '[PaymentPlan] Get All Payment Plan By Country Id',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllPaymentPlanByCountryId = createAction(
  '[PaymentPlan] Save All Payment Plan By Country Id',
  props<{
    payload: any;
  }>()
);

export const CreatePaymentPlan = createAction(
  '[PaymentPlan] Create Payment Plan',
  props<{
    payload: {
      countryId: number;
      name: string;
      description: string;
      numberOfInstallment: number;
      duration: number;
      downPayment: number;
      interestRate: number;
      feeCategory: number;
      percentage: number;
      serialNumber: number;
      migrationRouteId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const EditPaymentPlan = createAction(
  '[PaymentPlan] Edit Payment Plan',
  props<{
    payload: {
      id: number;
      countryId: number;
      name: string;
      description: string;
      numberOfInstallment: number;
      duration: number;
      downPayment: number;
      interestRate: number;
      feeCategory: number;
      percentage: number;
      serialNumber: number;
      migrationRouteId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivatePaymentPlan = createAction(
  '[PaymentPlan] Activate Payment Plan',
  props<{
    payload: {
      id: number;
      countryId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivatePaymentPlan = createAction(
  '[PaymentPlan] Deactivate Payment Plan',
  props<{
    payload: {
      id: number;
      countryId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeletePaymentPlan = createAction(
  '[PaymentPaln] Delete Payment Plan',
  props<{
    payload: {
      id: number;
      countryId: number;
      skip?: number;
      take?: number;
    };
  }>()
);
