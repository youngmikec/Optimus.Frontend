import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { NewQuoteRoutingModule } from './new-quote-routing.module';
import { NewQuoteComponent } from './new-quote.component';
import { ApplicantInfoComponent } from './applicant-info/applicant-info.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { QuoteFormBuilderComponent } from './quote-form-builder/quote-form-builder.component';
import { QuotePreviewComponent } from './quote-preview/quote-preview.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { QuoteStepperComponent } from './quote-stepper/quote-stepper.component';
import { QuoteTopbarComponent } from './quote-topbar/quote-topbar.component';
import { ConfirmQuoteComponent } from './confirm-quote/confirm-quote.component';
import { QuoteInvoiceComponent } from './quote-invoice/quote-invoice.component';
import { ProceedToPaymentModalComponent } from './proceed-to-payment-modal/proceed-to-payment-modal.component';
import { FinancialStatementDialogComponent } from './financial-statement-dialog/financial-statement-dialog.component';
import { PaymentReceiptDialogComponent } from './payment-receipt-dialog/payment-receipt-dialog.component';
import { SafePipe } from 'src/app/@core/pipes/safe.pipe';
import { DeleteQuoteModalComponent } from './delete-quote-modal/delete-quote-modal.component';
import { ApplyDiscountModalComponent } from './quote-stepper/apply-discount-modal/apply-discount-modal.component';
// import { PaymentPlanModalComponent } from './payment-plan-modal/payment-plan-modal.component';

@NgModule({
  declarations: [
    NewQuoteComponent,
    ApplicantInfoComponent,
    QuoteFormBuilderComponent,
    QuotePreviewComponent,
    QuoteStepperComponent,
    QuoteTopbarComponent,
    ConfirmQuoteComponent,
    QuoteInvoiceComponent,
    ProceedToPaymentModalComponent,
    FinancialStatementDialogComponent,
    PaymentReceiptDialogComponent,
    SafePipe,
    DeleteQuoteModalComponent,
    ApplyDiscountModalComponent,
  ],
  imports: [
    CommonModule,
    NewQuoteRoutingModule,
    SharedModule,
    PdfViewerModule,
    CdkStepperModule,
  ],
})
export class NewQuoteModule {}
