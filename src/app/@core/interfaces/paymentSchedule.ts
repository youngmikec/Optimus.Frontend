import { InvoiceLoanPaymentDetails } from '../models/quote-calculator.model';

export interface IPaymentSchedule {
  approveInterest: number;
  createdDate: Date;
  createdBy: string;
  description: string;
  expectedAmount: number;
  frequency: number;
  id: number;
  interest: number;
  interestAmount: number;
  interestApproval: any;
  interestMessage: any;
  invoiceLoanId: number;
  invoiceLoanPaymentDetails: InvoiceLoanPaymentDetails[];
  isArchived: boolean;
  isInvoiceLoanPaymentDetails: boolean;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  name: any;
  newInterest: number;
  overrideInterest: boolean;
  quoteAmount: number;
  repaymentDuration: number;
  requestMessage: any;
  startDate: Date;
  status: number;
  userId: string;
  statusDesc: string;
  uniqueName: any;
  userActivityType: number;
  userActivityTypeDesc: string;
}
