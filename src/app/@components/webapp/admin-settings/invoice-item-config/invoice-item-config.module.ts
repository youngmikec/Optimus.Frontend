import { NgModule } from '@angular/core';
import { InvoiceItemConfigComponent } from './invoice-item-config.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { CreateNewInvoiceItemComponent } from './create-new-invoice-item/create-new-invoice-item.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceItemConfigComponent,
  },
];

@NgModule({
  declarations: [InvoiceItemConfigComponent, CreateNewInvoiceItemComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class InvoiceItemConfigModule {}
