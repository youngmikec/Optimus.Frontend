import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDiscount from './discount.reducer';

const getDiscountState = (state: fromApp.AppState) => state.discounts;

export const getDiscountIsLoading = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.isLoading
);

export const getAllDiscount = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.allDiscounts
);

export const getAllDiscountByCountryId = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.allDiscountsByCountryId
);

export const getActiveDiscountByCountryIdAndMigrationRouteId = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.activeDiscount
);

export const getAllDiscountRequests = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.allDiscountRequests
);

export const getApprovalIsLoading = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.approvalIsLoading
);

export const getDiscountRequestStats = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.discountRequestStats
);

export const getStatLoading = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.statLoading
);

export const getDiscountTypes = createSelector(
  getDiscountState,
  (state: fromDiscount.State) => state.discountTypes
);
