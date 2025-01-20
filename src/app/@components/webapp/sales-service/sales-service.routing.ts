import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesServiceComponent } from './sales-service.component';
import { SaleDashboardComponent } from './sale-dashboard/sale-dashboard.component';
// import { SalesServiceBreadcrumbResolver } from './sales-service-resolver';
// import { SaleOverviewComponent } from './sale-dashboard/sale-overview/sale-overview.component';

const routes: Routes = [
  {
    path: '',
    component: SalesServiceComponent,
  },

  {
    path: ':applicantName/:applicantId/:applicationId',
    component: SaleDashboardComponent,
    // resolve: { breadcrumb: SalesServiceBreadcrumbResolver },
    children: [
      {
        path: '',
        // data: { breadcrumb: 'Change' }, // breadcrumbs should be country name
        // resolve: { breadcrumb: SalesServiceBreadcrumbResolver },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/sales-service/sale-dashboard/sale-dashboard.module'
          ).then((m) => m.SaleDashboardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesServiceRoutes {}
