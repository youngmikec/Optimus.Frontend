export interface IGET_INVOICE_RES {
  succeeded: boolean;
  entity: {
    data: InvoiceDataInterface[];
    totalCount: number;
    pageCount?: number;
  };
  error: string | string[] | null;
  exceptionError: string | string[] | null;
  message: string;
}

export interface IINVOICE_LIST {
  applicationQuoteId: number;
  invoiceNo: string;
  baseCurrencyId: number;
  baseCurrencyCode: string;
  amount: number;
  useApplicantInvoiceCurrency: boolean;
  invoiceCurrencyId: number;
  invoiceCurrencyCode: string;
  exchangeRate: number;
  invoiceAmount: number;
  invoiceDate: string;
  amountReceived: number;
  outstandingAmount: number;
  paymentStatus: number;
  paymentStatusDesc: string;
  invoiceBankAccounts: [];
  invoiceDetails: [];
  invoiceItems: [];
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

export interface IINVOICE_LIST_PAYLOAD {
  skip: number;
  take: number;
  applicationId?: number;
  applicationQuoteId?: number;
  paymentStatus?: number;
  searchWord?: string;
}

export interface IMARK_AS_PAID_RES {
  succeeded: boolean;
  entity: null;
  error: null;
  exceptionError: null;
  message: string;
}

export interface InvoiceTableInterface {
  invoiceNumber: string;
  applicantName: string;
  phoneNumber: string;
  amount: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: number;
  id: number;
  // status: 'Paid' | 'Outstanding';
}

export interface InvoiceDataInterface {
  amount: number;
  applicantName: string;
  applicationQuote: any;
  applicationQuoteId: number;
  baseCurrencyCode: string;
  baseCurrencyId: number;
  countryFeeInvoiceQuotePDFURL?: string;
  createdBy: string;
  createdDate: Date;
  description: string;
  exchangeRate: number;
  id: number;
  inoicePaymentDetails: any[];
  invoiceAmount: number;
  invoiceBankAccounts: any[];
  invoiceCurrencyCode: string;
  invoiceCurrencyId: number;
  invoiceDate: Date;
  invoiceDetails: any[];
  invoiceItems: any[];
  invoiceNo: string;
  invoiceNumber: string;
  invoiceQuotations: any[];
  invoiceQuotePDFURL: string;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  localFeeInvoiceQuotePDFURL?: string;
  name: string;
  outstandingAmount: number;
  outstandingCountryFeePaid: number;
  outstandingLocalFeePaid: number;
  paymentStatus: number;
  paymentStatusDesc: string;
  phoneNumber: string;
  recordKey: string;
  status: number;
  statusDesc: string;
  totalAmountPaid: number;
  totalCountryFeePaid: number;
  totalLocalFeePaid: number;
  useApplicantInvoiceCurrency: boolean;
  userId: string;
}

export interface ISEND_INVOICE_PAYLOAD {
  attachment: string;
  id: number;
}

export interface ISEND_INVOICE_RES {
  succeeded: boolean;
  entity: null;
  error: null;
  exceptionError: null;
  message: string;
}

export interface IINVOICE_DETAILS_RES {
  succeeded: boolean;
  entity: { isLoanCreated: boolean; invoice: IINVOICE_DETAILS_ENTITY };
  error: null;
  exceptionError: null;
  message: string;
}

export interface IINVOICE_DETAILS_ENTITY {
  applicationQuoteId: number;
  invoiceNo: string;
  baseCurrencyId: number;
  baseCurrencyCode: string;
  amount: number;
  useApplicantInvoiceCurrency: boolean;
  invoiceCurrencyId: number;
  invoiceCurrencyCode: string;
  exchangeRate: number;
  invoiceAmount: number;
  invoiceDate: string;
  amountReceived: number;
  outstandingAmount: number;
  paymentStatus: number;
  paymentStatusDesc: string;
  invoiceBankAccounts: string[] | string;
  invoiceDetails: IINVOICE_DETAILS[];
  invoiceItems: string[];
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
  isLoanCreated: boolean;
  invoiceQuotePDFURL?: string;
  countryFeeInvoiceQuotePDFURL?: string;
  localFeeInvoiceQuotePDFURL?: string;
  signature?: string;
}

export interface IINVOICE_DETAILS {
  recordKey: string;
  invoiceId: number;
  invoiceItemId: number;
  invoiceItemDescription: string;
  invoiceItemName: string;
  baseCurrencyId: number;
  baseCurrencyCode: string | null;
  amount: number;
  exchangeRateId: number;
  exchangeRate: number;
  invoiceCurrencyId: number;
  invoiceCurrencyCode: string;
  invoiceAmount: number;
  invoiceItem: string | null;
  invoice: {
    recordKey: string;
    applicationQuoteId: number;
    invoiceNo: string;
    baseCurrencyId: number;
    baseCurrencyCode: string;
    amount: number;
    useApplicantInvoiceCurrency: boolean;
    invoiceCurrencyId: number;
    invoiceCurrencyCode: string;
    exchangeRate: number;
    invoiceAmount: number;
    invoiceDate: string;
    totalAmountPaid: number;
    outstandingAmount: number;
    paymentStatus: number;
    paymentStatusDesc: string;
    applicationQuote: null;
    invoiceItems: [];
    invoiceDetails: [];
    invoiceBankAccounts: [];
    payments: string | null;
    id: number;
    userId: string;
    name: string;
    uniqueName: string | null;
    description: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    isArchived: boolean;
    status: number;
    statusDesc: string;
    deviceId: string | null;
    deviceType: number;
    deviceTypeDesc: string | null;
    userActivityType: number;
    userActivityTypeDesc: string;
  };
  id: number;
  userId: null;
  name: null;
  uniqueName: string | null;
  description: string | null;
  createdBy: string | null;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  isArchived: boolean;
  status: number;
  statusDesc: string | null;
  deviceId: string | null;
  deviceType: number;
  deviceTypeDesc: string | null;
  userActivityType: number;
  userActivityTypeDesc: string | null;
}

export interface IGET_INVOICE_CONFIG_RES {
  succeeded: boolean;
  entity: {
    pageItems: IGET_INVOICE_CONFIG_DATA[];
    pageCount: number;
    totalCount: number;
  };
  error: string | null;
  exceptionError: string | null;
  message: string;
}

export interface IGET_INVOICE_CONFIG_DATA {
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

export interface IFilterInvoiceConfig {
  name: string;
  column: string;
  selected: boolean;
}

export interface ICountryDetails {
  recordKey: string;
  countryCode: string;
  flagUrl: string;
  currencyId: number;
  currency: string | null;
  productCategories: any | null;
  countryFees: any | null;
  familyMembers: any | null;
  feeGroups: any | null;
  invoiceCurrencies: any | null;
  migrationRoutes: any | null;
  paymentPlans: any | null;
  questionTemplates: any | null;
  familyMemberTypeSettings: any | null;
  bankAccounts: any[];
  programType: number;
  id: number;
  userId: string;
  name: string;
  uniqueName: string | null;
  description: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  isArchived: boolean;
  status: number;
  statusDesc: string;
  deviceId: string | null;
  deviceType: number;
  deviceTypeDesc: string | null;
  userActivityType: number;
  userActivityTypeDesc: string | null;
}

export interface InvoiceItem {
  countryId: number;
  allMigrationRoute: boolean;
  migrationRouteId: number | null;
  country: ICountryDetails;
  percentageCountryFee: number;
  localFeeCurrencyCode: string;
  percentageLocalFee: number;
  localFeeAmount: number;
  migrationRoute: any | null;
  isLocalFee: boolean;
  isPaymentPlan: boolean;
  showLocalFee?: boolean;
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}
