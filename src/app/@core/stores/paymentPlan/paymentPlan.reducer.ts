import { createReducer, on, Action } from '@ngrx/store';
import * as PaymentPlansAction from './paymentPlan.actions';

export interface State {
  isLoading: boolean;
  allPaymentPlansByCountryId: any[] | null;
}

const initialState: State = {
  isLoading: false,
  allPaymentPlansByCountryId: null,
};

const paymentPlansReducerInternal = createReducer(
  initialState,
  on(PaymentPlansAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(PaymentPlansAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(
    PaymentPlansAction.SaveAllPaymentPlanByCountryId,
    (state, { payload }) => ({
      ...state,
      allPaymentPlansByCountryId: payload,
    })
  )
);

export function paymentPlansReducer(state: State | undefined, action: Action) {
  return paymentPlansReducerInternal(state, action);
}
