import { createReducer, on, Action } from '@ngrx/store';
import * as InvoiceItemConfigurationActions from './invoiceItemConfiguration.actions';

export interface State {
  isLoading: boolean;
  invoiceItems: any;
  error: string | null;
  invoiceItemsByCountryId: any;
}

const initialState: State = {
  isLoading: false,
  invoiceItems: null,
  invoiceItemsByCountryId: null,
  error: null,
};

const invoiceItemConfigurationReducerInternal = createReducer(
  initialState,
  on(InvoiceItemConfigurationActions.GetInvoiceItems, (state) => ({
    ...state,
  })),
  on(
    InvoiceItemConfigurationActions.SaveAllInvoiceItems,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      invoiceItems: payload,
    })
  ),
  on(
    InvoiceItemConfigurationActions.SaveInvoiceItemsByCountryId,
    (state, { payload }) => ({
      ...state,
      invoiceItemsByCountryId: payload,
    })
  ),
  on(InvoiceItemConfigurationActions.ClearAllInvoiceItems, (state) => ({
    ...state,
    isLoading: false,
    invoiceItems: null,
  })),
  on(InvoiceItemConfigurationActions.CreateInvoiceItem, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(InvoiceItemConfigurationActions.UpdateInvoiceItem, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    InvoiceItemConfigurationActions.UpdateInvoiceItemFailure,
    (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })
  )
);

export function invoiceItemConfigurationReducer(
  state: State | undefined,
  action: Action
) {
  return invoiceItemConfigurationReducerInternal(state, action);
}
