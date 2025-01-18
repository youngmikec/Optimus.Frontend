import { InvoicePaymentFeeCategory } from '../enums/invoice-payment-fee-category.enum';
import { IUSERS } from '../models/sales';
import { InvoiceInterface } from '../stores/invoices/invoices.actionTypes';

export interface InvoicePaymentDetail {
  amount: number;
  applicationQuoteId: number;
  createdBy: IUSERS;
  createdDate: Date;
  currencyCode: string;
  datePaid: Date;
  description: string | null;
  deviceId: number | null;
  deviceType: number;
  deviceTypeDesc: string | null;
  feeCategory: number;
  feeCategoryDesc: InvoicePaymentFeeCategory;
  id: number;
  invoice: InvoiceInterface;
  invoiceId: number;
  isArchived: boolean;
  isInvoiceLastPayment: boolean;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  name: string | null;
  paymentDetailsPDFUrl: string | null;
  paymentReceiptUrl: string | null;
  paymentStatus: number;
  paymentStatusDesc: string | null;
  recordKey: string;
  status: number;
  statusDesc: string | null;
  telexNumber: string | null;
  uniqueName: any;
  userActivityType: number;
  userActivityTypeDesc: string | null;
  userId: string;
}

export interface ISendEmailPayload {
  message: string;
  cc: string[];
  bcc: string[];
}
