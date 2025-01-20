import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromPaymentPlans from './paymentPlan.reducer';

const getPaymentPlansState = (state: fromApp.AppState) => state.paymentPlans;

export const getPaymentPlansIsLoading = createSelector(
  getPaymentPlansState,
  (state: fromPaymentPlans.State) => state.isLoading
);

export const getAllInvoiceCurrenciesByCountryId = createSelector(
  getPaymentPlansState,
  (state: fromPaymentPlans.State) => state.allPaymentPlansByCountryId
);
