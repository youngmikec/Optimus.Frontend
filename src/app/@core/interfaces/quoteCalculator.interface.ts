import { IApplication } from './application.interface';

export interface QuoteQuestionInterface {
  id: number;
  question: string;
  answer: string;
  type?: string;
}

export interface IApplicationQuoteItem {
  applicationQuoteId: number;
  routeFeeId: number;
  routeFeeName: string;
  feeCategory: number;
  feeType: number;
  feeTypeDesc: string;
  feeBasis: number;
  feeBasisDesc: string;
  amount: number;
  numberOfPeople: number;
  totalAmount: number;
  routeFeeSerialNumber: number;
  message: string | null;
  familyMemberFeeItems: [];
  recordKey: string | null;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  status: number;
  statusDesc: string;
}

export interface IApplicationQuote {
  amount: number;
  application: IApplication;
  applicationId: number;
  applicationQuoteItems: IApplicationQuoteItem[];
  authorizationStatus: number;
  balanceDueAmount: number;
  countryApplicationQuoteItems: any;
  createdBy: string;
  createdDate: string;
  description: string;
  fileName: string;
  fileUrl: string;
  id: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  localApplicationQuoteItems: any;
  name: string;
  quoteNo: string;
  quoteStatus: number;
  recordKey: string;
  requestDate: string;
  routeUrl: string;
  status: number;
  statusDesc: string;
  discountApplied?: number;
  discountAppliedMessage?: string;
  discountTypeApplied?: number;
  discountTypeAppliedDesc?: string;
  hasDiscountApplied?: boolean;
  netAmount?: number;
}
