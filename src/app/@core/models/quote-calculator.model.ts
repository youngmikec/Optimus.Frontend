export interface ILoanRequest {
  userId?: string;
  applicationQuoteId: number;
}

export interface ILoanRequestRes {
  succeeded: boolean;
  // entity: {
  //   totalLoan: number;
  //   outstandingLoan: number;
  //   repaidLoan: number;
  //   data: ILoanData;
  // };
  entity: ILoanData;
  error: string | null;
  exceptionError: string | null;
  message: string;
}

export interface ILoanData {
  pageItems: ILoan[];
  pageCount: number;
  totalCount: number;
}

export interface ILoan {
  amount: number;
  invoiceId: number;
  applicationQuoteId: number;
  currencyCode: string;
  loanStatus: number;
  loanStatusDesc: string;
  balanceAmount: number;
  amountPaid: number;
  loanBalance: number;
  applicantName: string;
  interestRate: number;
  frequency: number;
  recordKey: string;
  id: number;
  name: null;
  description: null;
  userId: null;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
  isPaymentSchedule: boolean;
}

export interface IPaymentDetail {
  amountPaid: number;
  createdBy: string;
  createdDate: Date;
  datePaid: Date;
  description: string;
  deviceId: string;
  deviceType: number;
  deviceTypeDesc: string;
  documentId: number;
  documentUrl: string;
  id: number;
  isArchived: boolean;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  name: string;
  paidBy: string;
  paymentSchdeuleId: number;
  paymentStatus: number;
  paymentStatusDesc: string;
  status: number;
  statusDesc: string;
  uniqueName: string;
  userActivityType: number;
  userActivityTypeDesc: string;
  userId: string;
}

export interface IOptions {
  label: string;
  value: string;
}

export interface IInterestOverrideRequest {
  // applicationId: number;
  userId: string;
  paymentScheduleId: number;
  interest: number;
  message: string;
  // isOverrided: boolean;
}

export interface ISchedulePaymentPlan {
  userId?: string;
  quoteAmount: number;
  currencyCode: string;
  repaymentDuration: number;
  interest: number | null;
  interestAmount: number;
  expectedAmount: number;
  overrideInterest: boolean;
  startDate: string | null;
  invoiceLoanId: number;
  frequency?: number | null;
  paymentDetails: {
    paymentDate: string;
    amount: number;
  }[];
}

export interface IGetLoanPaymentsSchedulePayload {
  userId: string;
  invoiceLoanId: number;
}

export interface IGetLoanPaymentsScheduleResponse {
  succeeded: boolean;
  error: any;
  exceptionError: any;
  message: any;
  entity: {
    quoteAmount: number;
    currencyCode: string;
    repaymentDuration: number;
    interest: number;
    interestAmount: number;
    expectedAmount: number;
    overrideInterest: boolean;
    startDate: string;
    invoiceLoanId: number;
    invoiceLoanPaymentDetails: InvoiceLoanPaymentDetails[];
    approveInterest: number;
    interestApproval: any | null;
    interestMessage: any | null;
    id: number;
    userId: string;
    name: any | null;
    uniqueName: any | null;
    description: any | null;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    isArchived: boolean;
    status: number;
    statusDesc: string;
    deviceId: any | null;
    deviceType: number;
    deviceTypeDesc: any | null;
    userActivityType: number;
    userActivityTypeDesc: any | null;
  };
}

export interface InvoiceLoanPaymentDetails {
  recordKey: string;
  paymentScheduleId: number;
  paymentDate: string;
  amount: number;
  id: number;
  userId: any | null;
  name: any | null;
  uniqueName: any | null;
  description: any | null;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  isArchived: boolean;
  status: any | number;
  statusDesc: string;
  deviceId: any | null;
  deviceType: number;
  deviceTypeDesc: any | null;
  userActivityType: number;
  userActivityTypeDesc: any | null;
}

export interface GetPaymentScheduleHistoryeResponse {
  succeeded: boolean;
  error: any;
  exceptionError: any;
  message: any;
  entity: PaymentScheduleHistory[];
}

export interface PaymentScheduleHistory {
  amountPaid: number;
  datePaid: string;
  paidBy: any | null;
  paymentSchdeuleId: number;
  documentId: number;
  documentUrl?: string;
  paymentHistoryPDFURL: string;
  id: number;
  userId: string;
  name: any | null;
  uniqueName: any | null;
  description: any | null;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  isArchived: boolean;
  status: number;
  statusDesc: string;
  deviceId: any | null;
  deviceType: number;
  deviceTypeDesc: any | null;
  userActivityType: number;
  userActivityTypeDesc: any | null;
  paymentStatus: number;
  paymentStatusDesc: any | null;
}
