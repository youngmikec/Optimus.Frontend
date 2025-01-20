import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { QuoteInvoiceRoutingModule } from './quote-invoice-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { QuoteLoanComponent } from './quote-loan/quote-loan.component';
import { PaymentPlanModalComponent } from '../payment-plan-modal/payment-plan-modal.component';
import { ShedulePaymentPlanDialogComponent } from './invoice/create-invoice/shedule-payment-plan-dialog/shedule-payment-plan-dialog.component';
import { ViewPaymentsScheduleModalComponent } from './view-payments-schedule-modal/view-payments-schedule-modal.component';
import { RepayQuoteLoanComponent } from './repay-quote-loan/repay-quote-loan.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuoteDocumentViewComponent } from './quote-document-view/quote-document-view.component';
import { PaymentScheduleDocumentDialogComponent } from './payment-schedule-document-dialog/payment-schedule-document-dialog.component';
import { InvoiceReceiptDialogComponent } from './invoice/invoice-receipt-dialog/invoice-receipt-dialog.component';

@NgModule({
  declarations: [
    InvoiceComponent,
    CreateInvoiceComponent,
    QuoteLoanComponent,
    PaymentPlanModalComponent,
    ViewPaymentsScheduleModalComponent,
    ShedulePaymentPlanDialogComponent,
    RepayQuoteLoanComponent,
    QuoteDocumentViewComponent,
    PaymentScheduleDocumentDialogComponent,
    InvoiceReceiptDialogComponent,
  ],
  exports: [PaymentPlanModalComponent, ViewPaymentsScheduleModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuoteInvoiceRoutingModule,
    PdfViewerModule,
  ],
})
export class QuoteInvoiceModule {}
