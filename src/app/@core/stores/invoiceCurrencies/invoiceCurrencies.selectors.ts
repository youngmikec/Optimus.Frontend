import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromInvoiceCurrencies from './invoiceCurrencies.reducer';

const getInvoiceCurrenciesState = (state: fromApp.AppState) =>
  state.invoiceCurrencies;

export const getInvoiceCurrenciesIsLoading = createSelector(
  getInvoiceCurrenciesState,
  (state: fromInvoiceCurrencies.State) => state.isLoading
);

export const getAllInvoiceCurrencies = createSelector(
  getInvoiceCurrenciesState,
  (state: fromInvoiceCurrencies.State) => state.allInvoiceCurrencies
);

export const getAllInvoiceCurrenciesByCountryId = createSelector(
  getInvoiceCurrenciesState,
  (state: fromInvoiceCurrencies.State) => state.allInvoiceCurrenciesByCountryId
);
