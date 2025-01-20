import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { SalesServiceComponent } from './sales-service.component';
import { SalesServiceRoutes } from './sales-service.routing';
import { AllSalesComponent } from './sales-list/all-sales/all-sales.component';
import { QuoteCalculatorModule } from '../quote-calculator/quote-calculator.module';

@NgModule({
  declarations: [SalesServiceComponent, AllSalesComponent],
  imports: [CommonModule, SalesServiceRoutes, SharedModule, QuoteCalculatorModule],
})
export class SalesServiceModule {}
