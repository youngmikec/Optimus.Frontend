import { NgModule } from '@angular/core';
import { InvoiceComponent } from './invoice.component';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
  },
  {
    path: 'view/:applicationId',
    // data: { breadcrumb: 'Invoice View' },
    component: InvoiceViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
