import { createAction, props } from '@ngrx/store';
import InvoiceActionTypes, {
  CreateInvoiceInterface,
  InvoiceInterface,
  InvoiceStatisticsInterface,
} from './invoices.actionTypes';
import {
  IINVOICE_LIST_PAYLOAD,
  IGET_INVOICE_RES,
  ISEND_INVOICE_PAYLOAD,
  IINVOICE_DETAILS_ENTITY,
} from '../../models/invoice';

export const loadInvoices = createAction('[Invoices] Load Invoices');
export const invoicesSuccess = createAction(
  '[Invoices] Load Invoices Success',
  props<{ invoices: [] }>()
);
export const invoiceFailure = createAction(
  '[Invoices] Load Invoices Failure',
  props<{ error: string }>()
);
export const createInvoiceLoading = createAction(
  '[Invoices] create Invoice Is Loading',
  props<{
    payload: boolean;
  }>()
);
export const createInvoice = createAction(
  '[Invoices] Create Invoice',
  props<{
    invoice: CreateInvoiceInterface;
  }>()
);
export const createInvoiceSuccess = createAction(
  '[Invoices] create Invoice success',
  props<{
    payload: boolean;
    invoiceId?: number;
    invoiceQuotePDFURL?: string;
    localFeeInvoiceQuotePDFURL?: string;
    countryFeeInvoiceQuotePDFURL?: string;
    signature?: string;
  }>()
);

export const SendInvoiceToEmail = createAction(
  '[Invoices] Send Invoice pdf To Email',
  props<{
    payload: {
      id: number;
      applicationQuoteId: number;
      message?: string;
      cc: string[];
      bcc: string[];
    };
  }>()
);

export const SendInvoicePaymentToEmail = createAction(
  '[Invoices] Send Invoice payment pdf To Email',
  props<{
    payload: {
      id: number;
      applicationQuoteId: number;
      message?: string;
      cc?: string[];
      bcc?: string[];
    };
  }>()
);

export const SetLoadingState = createAction(
  '[Invoices] Invoice loading state',
  props<{
    payload: {
      isLoading: boolean;
    };
  }>()
);

export const createInvoiceFailure = createAction(
  '[Invoices] create Invoice Failure'
);
export const deleteInvoice = createAction(
  '[Invoices] Delete Invoice',
  props<{ id: number }>()
);
export const loadInvoiceById = createAction(
  '[Invoices] Loading Invoice By Id',
  props<{ invoiceId: number }>()
);
export const singleInvoicesSuccess = createAction(
  '[Invoices] Load Invoices Success',
  props<{ invoice: [] }>()
);
// export const saveInvoiceList = createAction(
//   `${InvoiceActionTypes.SAVE_INVOICE_LIST}`,
//   props<{
//     payload: IINVOICE_LIST[];
//   }>()
// );

export const searchAllInvoices = createAction(
  `${InvoiceActionTypes.SEARCH_ALL_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getAllInvoices = createAction(
  `${InvoiceActionTypes.GET_ALL_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getAllInvoicesSuccess = createAction(
  `${InvoiceActionTypes.GET_ALL_INVOICES_SUCCESS}`,
  props<{
    invoices: IGET_INVOICE_RES;
  }>()
);

export const getAllInvoicesFailure = createAction(
  `${InvoiceActionTypes.GET_ALL_INVOICES_FAILED}`,
  props<{
    error: string;
  }>()
);

export const searchPaidInvoices = createAction(
  `${InvoiceActionTypes.SEARCH_PAID_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getPaidInvoices = createAction(
  `${InvoiceActionTypes.GET_PAID_INVOICES}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getPaidInvoicesSuccess = createAction(
  `${InvoiceActionTypes.GET_PAID_INVOICES_SUCCESS}`,
  props<{
    paidInvoices: IGET_INVOICE_RES;
  }>()
);

export const getPaidInvoicesFailure = createAction(
  `${InvoiceActionTypes.GET_PAID_INVOICES_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const searchOutStandingInvoices = createAction(
  `${InvoiceActionTypes.SEARCH_OUTSTANDING_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getOutstandingInvoices = createAction(
  `${InvoiceActionTypes.GET_OUTSTANDING_INVOICES}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getOutstandingInvoicesSuccess = createAction(
  `${InvoiceActionTypes.GET_OUTSTANDING_INVOICES_SUCCESS}`,
  props<{
    outstandingInvoices: IGET_INVOICE_RES;
  }>()
);

export const getOutstandingInvoicesFailure = createAction(
  `${InvoiceActionTypes.GET_OUTSTANDING_INVOICES_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const getAllApplicantionInvoices = createAction(
  `${InvoiceActionTypes.GET_ALL_APPLICANTION_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getAllApplicationInvoicesSuccess = createAction(
  `${InvoiceActionTypes.GET_ALL_APPLICANTION_INVOICE_SUCCESS}`,
  props<{
    invoices: IGET_INVOICE_RES;
  }>()
);

export const getAllPaidApplicantionInvoices = createAction(
  `${InvoiceActionTypes.GET_ALL_PAID_APPLICANTION_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getAllPaidApplicantionSuccess = createAction(
  `${InvoiceActionTypes.GET_ALL_PAID_APPLICANTION_INVOICE_SUCCESS}`,
  props<{
    invoices: IGET_INVOICE_RES;
  }>()
);

export const getAllOutstandingApplicantionInvoices = createAction(
  `${InvoiceActionTypes.GET_ALL_OUTSTANDING_APPLICANTION_INVOICE_LIST}`,
  props<{
    payload: IINVOICE_LIST_PAYLOAD;
  }>()
);

export const getAllOutstandingApplicantionSuccess = createAction(
  `${InvoiceActionTypes.GET_ALL_OUTSTANDING_APPLICANTION_INVOICE_SUCCESS}`,
  props<{
    invoices: IGET_INVOICE_RES;
  }>()
);
export const markAsPaid = createAction(
  `${InvoiceActionTypes.MARK_AS_PAID}`,
  props<{
    form: FormData;
    applicationQuoteId?: number;
  }>()
);

export const updateMarkAsPaid = createAction(
  `${InvoiceActionTypes.UPDATE_MARK_AS_PAID}`,
  props<{
    invoicePaymentDetailId: number;
    paymentStatus: number;
    applicationQuoteId?: number;
  }>()
);

export const markAsPaidSuccessful = createAction(
  `${InvoiceActionTypes.MARK_AS_PAID_SUCCESS}`
);

export const markAsPaidFailed = createAction(
  `${InvoiceActionTypes.MARK_AS_PAID_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const sendInvoice = createAction(
  `${InvoiceActionTypes.SEND_INVOICE}`,
  props<ISEND_INVOICE_PAYLOAD>()
);

export const sendInvoiceSuccess = createAction(
  `${InvoiceActionTypes.SEND_INVOICE_SUCCESS}`
);

export const sendInvoiceFailure = createAction(
  `${InvoiceActionTypes.SEND_INVOICE_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const getInvoiceDetailsById = createAction(
  `${InvoiceActionTypes.GET_INVOICE_DETAILS_BY_ID}`,
  props<{
    applicantId: number;
  }>()
);

export const getInvoiceDetailsByIdSuccess = createAction(
  `${InvoiceActionTypes.GET_INVOICE_DETAILS_BY_ID_SUCCESS}`,
  props<IINVOICE_DETAILS_ENTITY>()
);

export const getInvoiceDetailsByIdFailure = createAction(
  `${InvoiceActionTypes.GET_INVOICE_DETAILS_BY_ID_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const GetInvoiceByApplicationQuoteId = createAction(
  '[Invoice] Get Invoice By Application Quote By ID',
  props<{
    payload: {
      id: number;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveInvoiceByApplicationQuoteId = createAction(
  '[Invoice] Save Invoice By Application Quote By ID',
  props<{
    payload: InvoiceInterface[] | null;
  }>()
);

export const GetInvoiceStatisticsByApplicationQuoteId = createAction(
  '[Invoice] Get Invoice Statistics By Application Quote By ID',
  props<{
    payload: {
      applicationQuoteId: number;
    };
  }>()
);

export const SaveInvoiceStatisticsByApplicationQuoteId = createAction(
  '[Invoice] Save Invoice Statistics By Application Quote By ID',
  props<{
    payload: InvoiceStatisticsInterface | null;
  }>()
);

export const GetInvoiceStatisticsByApplicationQuoteIdSuccess = createAction(
  '[Invoice] Get Invoice Statistics By Application Quote ID Successfully',
  props<{
    statistics: any;
  }>()
);
export const GetInvoiceStatisticsByApplicationQuoteIdFail = createAction(
  '[Invoice] Get Invoice Statistics By Application Quote ID Failed',
  props<{
    error: string;
  }>()
);
