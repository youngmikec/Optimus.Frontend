import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { CreateMigrationRouteComponent } from './create-migration-route/create-migration-route.component';
import { MigrationRoutesComponent } from '../migration-routes/migration-routes.component';
import { BreadcrumbResolver } from './migration-route-dashboard/migrationRouteResolver';

const routes: Routes = [
  {
    path: '',
    component: MigrationRoutesComponent,
    data: { breadcrumb: 'Migration Routes' },
    // data: { permission: 'Documents' },
  },

  {
    path: 'route-dashboard/:routeId/:routeName',
    // data: { breadcrumb: 'Real Estate Investment' },
    resolve: { breadcrumb: BreadcrumbResolver },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/country-setup/country-dashboard/migration-routes/migration-route-dashboard/migration-route-dashboard.module'
      ).then((m) => m.MigrationRouteDashboardModule),
    // canActivateChild: [AppGuard],
    // component: CountryDashboardComponent,
    // canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [MigrationRoutesComponent, CreateMigrationRouteComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [BreadcrumbResolver],
})
export class MigrationRouteModule {}
