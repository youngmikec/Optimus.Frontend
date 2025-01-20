import { createReducer, on, Action } from '@ngrx/store';
import * as DiscountActions from './discount.actions';
import {
  IDiscountDetails,
  IDiscountRequest,
  IDiscountRequestStats,
  IDiscountType,
} from '../../models/discount-request.model';

export interface State {
  isLoading: boolean;
  approvalIsLoading: boolean;
  statLoading: boolean;
  allDiscounts: { data: IDiscountDetails[]; totalCount: number } | null;
  allDiscountsByCountryId: {
    data: IDiscountDetails[];
    totalCount: number;
  } | null;
  allDiscountRequests: { data: IDiscountRequest[]; totalCount: number } | null;
  discountTypes: IDiscountType[];
  discountRequestStats: IDiscountRequestStats | null;
  activeDiscount: IDiscountDetails | null;
  success: boolean;
}

const initialState: State = {
  isLoading: false,
  approvalIsLoading: false,
  statLoading: false,
  allDiscounts: null,
  allDiscountsByCountryId: null,
  allDiscountRequests: null,
  activeDiscount: null,
  discountTypes: [],
  discountRequestStats: null,
  success: false,
};

const discountReducerInternal = createReducer(
  initialState,
  on(DiscountActions.ClearState, (state) => ({
    ...state,
    isLoading: false,
    approvalIsLoading: false,
    statLoading: false,
    allDiscounts: null,
    allDiscountsByCountryId: null,
    allDiscountRequests: null,
    discountTypes: [],
    discountRequestStats: null,
    success: false,
  })),
  on(DiscountActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(DiscountActions.ApprovalIsLoading, (state, { payload }) => ({
    ...state,
    approvalIsLoading: payload,
  })),
  on(DiscountActions.SaveGetAllDiscount, (state, { payload }) => ({
    ...state,
    isLoading: false,
    allDiscounts: payload,
  })),
  on(DiscountActions.SaveGetAllDiscountByCountryId, (state, { payload }) => ({
    ...state,
    isLoading: false,
    allDiscountsByCountryId: payload,
  })),
  on(
    DiscountActions.SaveGetActiveDiscountByCountryIdAndMigrationRouteId,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      activeDiscount: payload,
    })
  ),
  on(DiscountActions.SaveGetAllDiscountRequests, (state, { payload }) => ({
    ...state,
    isLoading: false,
    allDiscountRequests: payload,
  })),
  on(DiscountActions.SaveDiscountRequestStats, (state, { payload }) => ({
    ...state,
    discountRequestStats: payload,
  })),
  on(DiscountActions.SaveDiscounTypes, (state, { payload }) => ({
    ...state,
    discountTypes: payload,
  })),
  on(DiscountActions.CreateEditDiscountSuccess, (state) => ({
    ...state,
    success: true,
  })),
  on(DiscountActions.ResetCreateEditDiscountState, (state) => ({
    ...state,
    success: false,
  })),
  on(DiscountActions.ClearActiveDiscountState, (state) => ({
    ...state,
    activeDiscount: null,
  }))
);

export function discountReducer(state: State | undefined, action: Action) {
  return discountReducerInternal(state, action);
}
