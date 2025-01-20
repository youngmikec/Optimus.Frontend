import { NgModule } from '@angular/core';

import { CurrencyConfigComponent } from './currency-config.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ManageCurrencyConversionComponent } from './manage-currency-conversion/manage-currency-conversion.component';
import { CurrencyListComponent } from './currency-list/currency-list.component';
// import { NewCurrencyComponent } from './new-currency/new-currency.component';
import { CreateCurrencyComponent } from './create-currency/create-currency.component';
import { CreateCurrencyConversionComponent } from './create-currency-conversion/create-currency-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyConfigComponent,
  },
];

@NgModule({
  declarations: [
    CurrencyConfigComponent,
    CurrenciesComponent,
    ManageCurrencyConversionComponent,
    CurrencyListComponent,
    CreateCurrencyComponent,
    CreateCurrencyConversionComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class CurrencyConfigModule {}
