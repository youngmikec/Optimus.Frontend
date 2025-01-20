import { IGET_INVOICE_RES, IINVOICE_DETAILS_ENTITY } from '../models/invoice';

export const ACCESS_LEVELS: any[] = [
  // {
  //   accessLevel: 1,
  //   accessLevelDesc: 'Admin',
  // },
  // { accessLevel: 2, accessLevelDesc: 'Power User' },
  // { accessLevel: 3, accessLevelDesc: 'User' },

  // { accessLevel: 1, accessLevelDesc: 'Super Admin' },
  { accessLevel: 2, accessLevelDesc: 'Admin' },
  { accessLevel: 3, accessLevelDesc: 'Power User' },
  { accessLevel: 4, accessLevelDesc: 'User' },
];

export const InvoicesMock: IGET_INVOICE_RES = {
  succeeded: false,
  entity: {
    data: [],
    totalCount: 0,
    pageCount: 0,
  },
  error: null,
  exceptionError: null,
  message: '',
};

export const IInvoiceDialogMock: IINVOICE_DETAILS_ENTITY = {
  applicationQuoteId: 0,
  invoiceNo: '',
  baseCurrencyId: 0,
  baseCurrencyCode: '',
  amount: 0,
  useApplicantInvoiceCurrency: false,
  invoiceCurrencyId: 0,
  invoiceCurrencyCode: '',
  exchangeRate: 0,
  invoiceAmount: 0,
  invoiceDate: '',
  amountReceived: 0,
  outstandingAmount: 0,
  paymentStatus: 0,
  paymentStatusDesc: '',
  invoiceBankAccounts: '',
  invoiceDetails: [],
  invoiceItems: [],
  recordKey: '',
  id: 0,
  name: '',
  description: '',
  userId: '',
  createdBy: '',
  createdDate: '',
  lastModifiedBy: '',
  lastModifiedDate: '',
  status: 0,
  statusDesc: '',
  isLoanCreated: false,
};
