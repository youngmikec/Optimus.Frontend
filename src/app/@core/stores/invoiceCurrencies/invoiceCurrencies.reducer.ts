import { createReducer, on, Action } from '@ngrx/store';
import * as InvoiceCurrenciesAction from './invoiceCurrencies.actions';

export interface State {
  isLoading: boolean;
  allInvoiceCurrencies: any[] | null;
  allInvoiceCurrenciesByCountryId: any[] | null;
}

const initialState: State = {
  isLoading: false,
  allInvoiceCurrencies: null,
  allInvoiceCurrenciesByCountryId: null,
};

const invoiceCurrenciesReducerInternal = createReducer(
  initialState,
  on(InvoiceCurrenciesAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(InvoiceCurrenciesAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(
    InvoiceCurrenciesAction.SaveAllInvoiceCurrencies,
    (state, { payload }) => ({
      ...state,
      allInvoiceCurrencies: payload,
    })
  ),
  on(
    InvoiceCurrenciesAction.SaveAllInvoiceCurrenciesByCountryId,
    (state, { payload }) => ({
      ...state,
      allInvoiceCurrenciesByCountryId: payload,
    })
  )
);

export function invoiceCurrenciesReducer(
  state: State | undefined,
  action: Action
) {
  return invoiceCurrenciesReducerInternal(state, action);
}
