import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientServiceComponent } from "./client-service.component";
import { ClientServiceDashboardComponent } from "./client-service-dashboard/client-service-dashboard.component";

const routes: Routes = [
    {
        path: '',
        component: ClientServiceComponent,
    },
    {
        path: ':applicantName/:applicantId/:applicationId',
        component: ClientServiceDashboardComponent,
        // resolve: { breadcrumb: SalesServiceBreadcrumbResolver },
        children: [
          {
            path: '',
            // data: { breadcrumb: 'Change' }, // breadcrumbs should be country name
            // resolve: { breadcrumb: SalesServiceBreadcrumbResolver },
            loadChildren: () =>
              import(
                'src/app/@components/webapp/client-service/client-service-dashboard/client-service-dashboard.module'
              ).then((m) => m.ClientServiceDashboardModule),
          },
        ],
      },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientServiceRoutes {}