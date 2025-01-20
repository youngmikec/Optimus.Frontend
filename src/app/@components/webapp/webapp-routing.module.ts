import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebappComponent } from './webapp.component';
import { AuthGuard } from 'src/app/@core/guards/auth.guard';
import { AppGuard } from 'src/app/@core/guards/app.guard';
// import { AppGuard } from 'src/app/@core/guards/app.guard';
// import { InvoiceResolverService } from 'src/app/@core/resolvers/invoice-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin-settings',
    pathMatch: 'full',
  },

  {
    path: '',
    component: WebappComponent,
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboard' },
        loadChildren: () =>
          import('src/app/@components/webapp/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [AuthGuard],
        // canActivateChild: [AppGuard],
      },

      {
        path: 'admin-settings',
        data: { breadcrumb: 'Admin Settings' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/admin-settings/admin-settings.module'
          ).then((m) => m.AdminSettingsModule),
        canActivate: [AuthGuard],
        // canActivateChild: [AppGuard],
      },
      {
        path: 'calculator',
        data: { breadcrumb: 'Quote Calculator' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/quote-calculator/quote-calculator.module'
          ).then((m) => m.QuoteCalculatorModule),
        canActivate: [AuthGuard],
        // canActivateChild: [AppGuard],
      },
      {
        path: 'applicants',
        data: { breadcrumb: 'Applicants' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/applicants/applicants.module'
          ).then((m) => m.ApplicantsModule),
        canActivate: [AuthGuard],
        //canActivateChild: [AppGuard],
      },
      // {
      //   path: 'sales-service',
      //   // data: { breadcrumb: 'Sales Service' },
      //   data: { breadcrumb: 'Client Service' },
      //   loadChildren: () =>
      //     import(
      //       'src/app/@components/webapp/sales-service/sales-service.module'
      //     ).then((m) => m.SalesServiceModule),
      //   canActivate: [AuthGuard],
      //   //canActivateChild: [AppGuard],
      // },
      {
        path: 'invoice',
        data: { breadcrumb: 'Invoice' },
        loadChildren: () =>
          import('src/app/@components/webapp/invoice/invoice.module').then(
            (m) => m.InvoiceModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AppGuard],
      },
      {
        path: 'loans',
        data: { breadcrumb: 'Loans' },
        loadChildren: () =>
          import('src/app/@components/webapp/loans/loans.module').then(
            (m) => m.LoansModule
          ),
        canActivate: [AuthGuard],
        canActivateChild: [AppGuard],
      },
      {
        path: 'approval-request',
        data: { breadcrumb: 'Approval Request' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/approval-request/approval-request.module'
          ).then((m) => m.ApprovalRequestModule),
        canActivate: [AuthGuard],
        canActivateChild: [AppGuard],
      },
      {
        path: 'discount-request',
        data: { breadcrumb: 'Discount Request' },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/discount-request/discount-request.module'
          ).then((m) => m.DiscountRequestModule),
        canActivate: [AuthGuard],
        canActivateChild: [AppGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebappRoutingModule {}
