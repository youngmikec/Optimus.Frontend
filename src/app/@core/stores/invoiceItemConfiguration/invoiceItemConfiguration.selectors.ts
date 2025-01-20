import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromInvoiceItemConfiguration from './invoiceItemConfiguration.reducer';

const getInvoiceItemConfigurationState = (state: fromApp.AppState) =>
  state.invoiceItemConfiguration;

export const getInvoiceItemsIsLoading = createSelector(
  getInvoiceItemConfigurationState,
  (state: fromInvoiceItemConfiguration.State) => state.isLoading
);

export const getAllInvoiceItems = createSelector(
  getInvoiceItemConfigurationState,
  (state: fromInvoiceItemConfiguration.State) => state.invoiceItems
);

export const getInvoiceItemsByCountryId = createSelector(
  getInvoiceItemConfigurationState,
  (state: fromInvoiceItemConfiguration.State) => state.invoiceItemsByCountryId
);
