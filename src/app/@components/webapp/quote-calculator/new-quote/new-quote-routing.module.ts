import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InvoiceComponent } from './invoice/invoice.component';
import { NewQuoteComponent } from './new-quote.component';
import { QuoteFormBuilderComponent } from './quote-form-builder/quote-form-builder.component';
// import { QuoteInvoiceComponent } from './quote-invoice/quote-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: NewQuoteComponent,
  },

  {
    path: 'builder/:id',
    component: QuoteFormBuilderComponent,
  },

  {
    path: 'builder/:id/edit/:applicationQuoteId',
    component: QuoteFormBuilderComponent,
  },

  {
    path: 'quote-invoice/:applicationId',
    // data: { breadcrumb: 'Quote' },
    loadChildren: () =>
      import('./quote-invoice/quote-invoice.module').then(
        (m) => m.QuoteInvoiceModule
      ),
    // canActivateChild: [AppGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewQuoteRoutingModule {}
