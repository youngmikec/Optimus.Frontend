import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as InvoicesReducer from './invoices.reducers';

const selectInvoices = (state: fromApp.AppState) => state.invoices;

export const isInvoiceLoadingSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.isLoading
);
export const isInvoiceCreatingSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.isCreating
);
export const isInvoiceCreating = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.isCreating
);
export const invoiceSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoices
);
export const invoiceFailureSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.error
);
export const paidInvoicesSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.paidInvoices
);
export const outstandingInvoicesSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.outstandingInvoices
);
export const singleInvoiceSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.singleInvoice
);
export const getInvoiceDialogData = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoiceDialogInfo
);
export const getInvoiceByApplicationQuoteIdData = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoicesByApplicationQuoteId
);

export const getInvoiceStatisticsByApplicationQuoteIdData = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoiceStatisticsByApplicationQuoteId
);

// export const invoiceListSelector = createSelector(
//   selectInvoices,
//   (state: InvoicesReducer.State) => state.invoices
// );
export const isInvoiceCreateSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.isCreateSuccess
);

export const isInvoiceCreateSuccessInvoiceIdSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.isCreateSuccessInvoiceId
);

export const applicationInvoiceSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.applicationInvoices
);
export const applicationPaidinvoiceSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.applicationPaidInvoices
);
export const applicationoutstandingInvoiceSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.applicationOutstandingInvoices
);
export const invoiceStatisticsSuccessSelector = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.statistics
);

export const getInvoiceQuotePDFURL = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoiceQuotePDFURL
);

export const getInvoiceQuotePDFURLS = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => ({
    invoiceQuotePDFURL: state.invoiceQuotePDFURL,
    countryFeeInvoiceQuotePDFURL: state.countryFeeInvoiceQuotePDFURL,
    localFeeInvoiceQuotePDFURL: state.localFeeInvoiceQuotePDFURL,
  })
);

export const getInvoiceSignature = createSelector(
  selectInvoices,
  (state: InvoicesReducer.State) => state.invoiceSignature
);
