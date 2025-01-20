import { NgModule } from '@angular/core';
import { CountrySetupComponent } from './country-setup.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { CreateCountryComponent } from './create-country/create-country.component';
import { CountryBreadcrumbResolver } from './countryRouteResolver';
import { CountryMainComponent } from './country-main/country-main.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
  {
    path: '',
    component: CountrySetupComponent,
    // data: { permission: 'Documents' },
  },

  {
    path: 'dashboard/:id/:name',
    component: CountryMainComponent,
    resolve: { breadcrumb: CountryBreadcrumbResolver },
    children: [
      {
        path: '',
        // data: { breadcrumb: 'Change' }, // breadcrumbs should be country name
        // resolve: { breadcrumb: CountryBreadcrumbResolver },
        loadChildren: () =>
          import(
            'src/app/@components/webapp/admin-settings/country-setup/country-dashboard/country-dashboard.module'
          ).then((m) => m.CountryDashboardModule),
      },
    ],
  },
];

@NgModule({
  declarations: [
    CountryMainComponent,
    CountrySetupComponent,
    CreateCountryComponent,
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes),
  ],
  providers: [CountryBreadcrumbResolver],
})
export class CountrySetupModule {}
