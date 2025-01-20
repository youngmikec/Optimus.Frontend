import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { AllInvoiceComponent } from './all-invoice/all-invoice.component';
import { PaidInvoiceComponent } from './paid-invoice/paid-invoice.component';
import { OutstandingInvoiceComponent } from './outstanding-invoice/outstanding-invoice.component';
import { InvoiceViewDialogComponent } from './invoice-view-dialog/invoice-view-dialog.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';

@NgModule({
  declarations: [
    InvoiceComponent,
    AllInvoiceComponent,
    PaidInvoiceComponent,
    OutstandingInvoiceComponent,
    InvoiceViewDialogComponent,
    InvoiceViewComponent,
  ],
  imports: [CommonModule, InvoiceRoutingModule, SharedModule],
})
export class InvoiceModule {}
