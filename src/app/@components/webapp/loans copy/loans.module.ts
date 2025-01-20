import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansComponent } from './loans.component';
import { LoansRoutingModule } from './loans-routing.module';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { QuoteInvoiceModule } from '../quote-calculator/new-quote/quote-invoice/quote-invoice.module';

@NgModule({
  declarations: [LoansComponent],
  imports: [CommonModule, LoansRoutingModule, QuoteInvoiceModule, SharedModule],
})
export class LoansModule {}
