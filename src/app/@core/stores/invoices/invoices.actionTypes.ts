class InvoiceActionTypes {
  static readonly SAVE_INVOICE_LIST = '[All Invoice] Save The Invoice List';
  static readonly SEARCH_ALL_INVOICE_LIST = '[All Invoice] Search All Invoices';
  static readonly GET_ALL_INVOICE_LIST = '[All Invoice] Get All Invoices';
  static readonly GET_ALL_INVOICES_SUCCESS =
    '[All Invoice] Get All Invoices Success';
  static readonly GET_ALL_INVOICES_FAILED =
    '[All Invoice] Get All Invoices Failed';
  static readonly GET_OUTSTANDING_INVOICES =
    '[Outstanding Invoice] Get All Outstanding Invoices';
  static readonly GET_OUTSTANDING_INVOICES_SUCCESS =
    '[Outstanding Invoice] Get Outstanding Invoices Success';
  static readonly GET_OUTSTANDING_INVOICES_FAILURE =
    '[Outstanding Invoice] Get Outstanding Invoices Failure';
  static readonly SEARCH_PAID_INVOICE_LIST =
    '[All Invoice] Search All Paid Invoices';
  static readonly GET_PAID_INVOICES = '[Paid Invoice] Get Paid Invoices';
  static readonly GET_PAID_INVOICES_SUCCESS =
    '[Paid Invoice] Get Paid Invoices Success';
  static readonly GET_PAID_INVOICES_FAILURE =
    '[Paid Invoice] Get Paid Inovices Failed';
  static readonly MARK_AS_PAID = '[Invoice View Dialog] Mark Invoice As Paid';
  static readonly UPDATE_MARK_AS_PAID =
    '[Invoice View Dialog] Update Mark Invoice As Paid';
  static readonly MARK_AS_PAID_SUCCESS =
    '[Invoice View Dialog] Mark As Paid Successful';
  static readonly MARK_AS_PAID_FAILURE =
    '[Invoice View Dialog] Mark As Paid Failed';
  static readonly SEND_INVOICE = '[Invoice View Dialog] Send Invoice';
  static readonly SEND_INVOICE_SUCCESS =
    '[Invoice View Dialog] Send Invoice Success';
  static readonly SEND_INVOICE_FAILURE =
    '[Invoice View Dialog] Send Invoice Failure';
  static readonly GET_INVOICE_DETAILS_BY_ID =
    '[Invoice View Dialog] Get Invoice Details';
  static readonly GET_INVOICE_DETAILS_BY_ID_SUCCESS =
    '[Invoice View Dialog] Get Invoice Details';
  static readonly GET_INVOICE_DETAILS_BY_ID_FAILURE =
    '[Invoice View Dialog] Get Invoice Details';

  static readonly GET_ALL_APPLICANTION_INVOICE_LIST =
    '[All Invoice] Get All Application Invoices';
  static readonly GET_ALL_APPLICANTION_INVOICE_SUCCESS =
    '[All Invoice] Get All Application Invoices Success';
  static readonly GET_ALL_PAID_APPLICANTION_INVOICE_LIST =
    '[All Invoice] Get All Paid Application Invoices';
  static readonly GET_ALL_PAID_APPLICANTION_INVOICE_SUCCESS =
    '[All Invoice] Get All Paid Application Invoices Success';
  static readonly SEARCH_OUTSTANDING_INVOICE_LIST =
    '[All Invoice] Search All Oustanding Invoices';
  static readonly GET_ALL_OUTSTANDING_APPLICANTION_INVOICE_LIST =
    '[All Invoice] Get All Outstanding Application Invoices';
  static readonly GET_ALL_OUTSTANDING_APPLICANTION_INVOICE_SUCCESS =
    '[All Invoice] Get All Outstanding Application Invoices Success';
}

export default InvoiceActionTypes;

interface InvoiceDetails {
  id?: number;
  name: string;
  description: string;
  // invoiceId: number;
  // invoiceItemId: number;
  invoiceItemDescription: string;
  invoiceItemName: string;
  baseCurrencyId: number;
  amount: number;
  // exchangeRateId: number;
  // exchangeRate: number;
  invoiceCurrencyId: number;
  invoiceAmount: number;
}

export interface InvoiceBankAccountInterface {
  id?: number;
  name?: string;
  description?: string;
  bankAccountId?: number;
}

interface InvoiceQuotationInterface {
  percentage: number;
  itemDescription: string;
  amount: number;
}

export interface CreateInvoiceInterface {
  requestId: string;
  sendMail: boolean;
  applicationQuoteId: number;
  baseCurrencyId: number;
  amount: number;
  useApplicantInvoiceCurrency: boolean;
  invoiceCurrencyId: number;
  exchangeRateId: number;
  exchangeRate?: number;
  invoiceAmount: number;
  signature: string;
  invoiceDetails: InvoiceDetails[];
  invoiceBankAccounts: InvoiceBankAccountInterface[];
  invoiceQuotations: InvoiceQuotationInterface[];
}

export interface InvoiceInterface {
  applicationQuoteId: number;
  baseCurrencyId: number;
  amount: number;
  useApplicantInvoiceCurrency: boolean;
  invoiceCurrencyId: number;
  exchangeRateId: number;
  exchangeRate?: number;
  invoiceAmount: number;
  signature: string;
  invoiceDetails: InvoiceDetails[];
  invoiceBankAccounts: InvoiceBankAccountInterface[];
  invoiceQuotations: InvoiceQuotationInterface[];
}

export interface InvoiceStatisticsInterface {
  totalAmount: number;
  totalAmountPaid: number;
  totalAmountBalance: number;
}

export interface NewInvoiceStatisticsInterface {
  totalProgramFee: number;
  totalInvoicedProgramFee: number;
  totalProgramFeePaid: number;
  outstandingProgramFee: number;
  totalLocalFee: number;
  totalInvoicedLocalFee: number;
  totalLocalFeePaid: number;
  outstandingLocalFee: number;
}
