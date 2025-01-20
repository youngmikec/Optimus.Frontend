import { Action, createReducer, on } from '@ngrx/store';
import * as InvoicesActions from './invoices.actions';
import {
  IGET_INVOICE_RES,
  IINVOICE_DETAILS_ENTITY,
} from '../../models/invoice';
import { IInvoiceDialogMock, InvoicesMock } from '../../mock-data';
import {
  InvoiceInterface,
  InvoiceStatisticsInterface,
} from './invoices.actionTypes';

export interface State {
  isLoading: boolean;
  isCreating: boolean;
  invoices: IGET_INVOICE_RES;
  paidInvoices: IGET_INVOICE_RES;
  outstandingInvoices: IGET_INVOICE_RES;
  singleInvoice: {};
  invoiceDialogInfo: IINVOICE_DETAILS_ENTITY;
  error: string | null;
  invoicesByApplicationQuoteId: InvoiceInterface[] | null;
  invoiceStatisticsByApplicationQuoteId: InvoiceStatisticsInterface | null;
  isCreateSuccess: boolean;
  isCreateSuccessInvoiceId?: number;
  statistics: any;
  invoiceQuotePDFURL?: string;
  countryFeeInvoiceQuotePDFURL?: string;
  localFeeInvoiceQuotePDFURL?: string;
  invoiceSignature?: string;

  applicationInvoices: IGET_INVOICE_RES;
  applicationPaidInvoices: IGET_INVOICE_RES;
  applicationOutstandingInvoices: IGET_INVOICE_RES;
}

export const initialState: State = {
  isLoading: false,
  isCreating: false,
  invoices: InvoicesMock,
  singleInvoice: {},
  paidInvoices: InvoicesMock,
  outstandingInvoices: InvoicesMock,
  invoiceDialogInfo: IInvoiceDialogMock,
  error: null,
  invoicesByApplicationQuoteId: null,
  invoiceStatisticsByApplicationQuoteId: null,
  isCreateSuccess: false,
  isCreateSuccessInvoiceId: undefined,
  statistics: {},
  invoiceQuotePDFURL: undefined,
  countryFeeInvoiceQuotePDFURL: undefined,
  localFeeInvoiceQuotePDFURL: undefined,
  invoiceSignature: undefined,

  applicationInvoices: InvoicesMock,
  applicationPaidInvoices: InvoicesMock,
  applicationOutstandingInvoices: InvoicesMock,
};

export const invoicesReducerInternal = createReducer(
  initialState,
  on(InvoicesActions.loadInvoices, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(InvoicesActions.createInvoiceLoading, (state, action) => ({
    ...state,
    isCreating: action.payload,
  })),
  on(InvoicesActions.createInvoice, (state, action) => ({
    ...state,
    isCreating: true,
    isCreateSuccess: false,
  })),
  on(InvoicesActions.SetLoadingState, (state, action) => ({
    ...state,
    isLoading: action.payload.isLoading,
  })),
  on(InvoicesActions.createInvoiceSuccess, (state, action) => ({
    ...state,
    isCreateSuccess: action.payload,
    isCreateSuccessInvoiceId: action.invoiceId,
    invoiceQuotePDFURL: action.invoiceQuotePDFURL,
    countryFeeInvoiceQuotePDFURL: action.countryFeeInvoiceQuotePDFURL,
    localFeeInvoiceQuotePDFURL: action.localFeeInvoiceQuotePDFURL,
    invoiceSignature: action.signature,
    isCreating: false,
  })),
  on(InvoicesActions.createInvoiceFailure, (state, action) => ({
    ...state,
    isCreating: false,
  })),
  // on(InvoicesActions.invoicesSuccess, (state, action) => ({
  //   ...state,
  //   isLoading: false,
  //   isCreating: false,
  //   invoices: action.invoices,
  //   error: null,
  // })),
  // on(InvoicesActions.invoiceFailure, (state, action) => ({
  //   ...state,
  //   isLoading: false,
  //   isCreating: false,
  //   error: action.error,
  // })),
  on(InvoicesActions.singleInvoicesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    singleInvoice: action.invoice,
    error: null,
  })),
  on(InvoicesActions.searchAllInvoices, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(InvoicesActions.getAllInvoices, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
    error: null,
  })),
  on(InvoicesActions.getAllInvoicesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    invoices: action.invoices,
    error: null,
  })),
  on(InvoicesActions.getAllInvoicesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),
  on(InvoicesActions.searchOutStandingInvoices, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(InvoicesActions.getOutstandingInvoices, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
    error: null,
  })),
  on(InvoicesActions.getOutstandingInvoicesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    outstandingInvoices: action.outstandingInvoices,
    error: null,
  })),
  on(InvoicesActions.getOutstandingInvoicesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(InvoicesActions.searchPaidInvoices, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(InvoicesActions.getPaidInvoices, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
    error: null,
  })),
  on(InvoicesActions.getPaidInvoicesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    paidInvoices: action.paidInvoices,
    error: null,
  })),
  on(InvoicesActions.getPaidInvoicesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),
  on(InvoicesActions.markAsPaid, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: true,
  })),
  on(InvoicesActions.markAsPaidSuccessful, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(InvoicesActions.markAsPaidFailed, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(InvoicesActions.updateMarkAsPaid, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: true,
  })),
  on(InvoicesActions.sendInvoice, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(InvoicesActions.sendInvoiceSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
  })),
  on(InvoicesActions.sendInvoiceFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),
  on(InvoicesActions.getInvoiceDetailsByIdSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    invoiceDialogInfo: action,
  })),
  on(InvoicesActions.getInvoiceDetailsByIdFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),

  on(InvoicesActions.GetInvoiceByApplicationQuoteId, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(InvoicesActions.SaveInvoiceByApplicationQuoteId, (state, { payload }) => ({
    ...state,
    isLoading: false,
    invoicesByApplicationQuoteId: payload,
  })),

  on(
    InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId,
    (state, action) => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    InvoicesActions.SaveInvoiceStatisticsByApplicationQuoteId,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      invoiceStatisticsByApplicationQuoteId: payload,
    })
  ),
  on(InvoicesActions.getAllApplicantionInvoices, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
    error: null,
  })),
  on(InvoicesActions.getAllApplicationInvoicesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    applicationInvoices: action.invoices,
    error: null,
  })),
  on(InvoicesActions.getAllPaidApplicantionInvoices, (state, action) => ({
    ...state,
    isLoading: true,
    isCreating: false,
    error: null,
  })),
  on(InvoicesActions.getAllPaidApplicantionSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    applicationPaidInvoices: action.invoices,
    error: null,
  })),
  on(
    InvoicesActions.getAllOutstandingApplicantionInvoices,
    (state, action) => ({
      ...state,
      isLoading: true,
      isCreating: false,
      error: null,
    })
  ),
  on(InvoicesActions.getAllOutstandingApplicantionSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    outstandingInvoices: action.invoices,
    error: null,
  })),
  on(
    InvoicesActions.GetInvoiceStatisticsByApplicationQuoteIdSuccess,
    (state, action) => ({
      ...state,
      isLoading: false,
      isCreating: false,
      statistics: action.statistics,
      error: null,
    })
  ),
  on(
    InvoicesActions.GetInvoiceStatisticsByApplicationQuoteIdFail,
    (state, action) => ({
      ...state,
      isLoading: false,
      isCreating: false,
      statistics: null,
      error: action.error,
    })
  )
);

export function invoicesReducer(state: State | undefined, action: Action) {
  return invoicesReducerInternal(state, action);
}
