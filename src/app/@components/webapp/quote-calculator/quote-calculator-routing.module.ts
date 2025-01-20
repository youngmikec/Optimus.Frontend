import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteCalculatorComponent } from './quote-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteCalculatorComponent,
  },

  {
    path: 'quote',
    // data: { breadcrumb: 'Loan' },
    loadChildren: () =>
      import('./new-quote/new-quote.module').then((m) => m.NewQuoteModule),
    // canActivateChild: [AppGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteCalculatorRoutingModule {}
