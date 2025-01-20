import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { QuoteInvoiceComponent } from './quote-invoice.component';
import { QuoteLoanComponent } from './quote-loan/quote-loan.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteInvoiceComponent,
  },

  {
    path: 'view',
    data: { breadcrumb: 'Invoice' },
    component: InvoiceComponent,
  },

  {
    path: 'create',
    data: { breadcrumb: 'Invoice' },
    component: CreateInvoiceComponent,
  },

  {
    path: 'loan/:invoiceId',
    data: { breadcrumb: 'Loan' },
    component: QuoteLoanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteInvoiceRoutingModule {}
