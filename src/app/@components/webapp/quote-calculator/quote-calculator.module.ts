import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

import { QuoteCalculatorRoutingModule } from './quote-calculator-routing.module';
import { QuoteCalculatorComponent } from './quote-calculator.component';
import { QuoteComponent } from './quote/quote.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { QuoteInvoiceDialogComponent } from './quote-invoice-dialog/quote-invoice-dialog.component';

@NgModule({
  declarations: [
    QuoteCalculatorComponent,
    QuoteComponent,
    QuoteInvoiceDialogComponent,
  ],
  imports: [
    CommonModule,
    QuoteCalculatorRoutingModule,
    MatSortModule,
    SharedModule,
  ],
})
export class QuoteCalculatorModule {}
