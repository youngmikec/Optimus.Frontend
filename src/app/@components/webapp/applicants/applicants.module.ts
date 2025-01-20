import { NgModule } from '@angular/core';
//import { ApplicationsComponent } from './applications.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
//import { CreateApplicationsComponent } from './create-applications/create-applications.component';
import { AllApplicationsComponent } from './all-applications/all-applications.component';

import { ApplicantsComponent } from './applicants.component';
import { CreateApplicationsComponent } from './create-applications/create-applications.component';
import { ApplicantsDashboardComponent } from './applicants-dashboard/applicants-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
//import { CreateApplicationsComponent } from '../admin-settings/applications/create-applications/create-applications.component';
import { FusionChartsModule } from 'angular-fusioncharts';
// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
// Load Maps
import * as Maps from 'fusioncharts/fusioncharts.maps';

// Load WorldMap definition
import * as World from 'fusioncharts/maps/fusioncharts.world';
import { MaterialModule } from 'src/app/@core/styles/material/material.module';
import { ApplicantsInfoComponent } from './applicants-dashboard/applicants-info/applicants-info.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
  {
    path: '',
    component: ApplicantsDashboardComponent,
  },
  {
    path: 'all-applicants',
    component: ApplicantsComponent,
  },

  {
    path: 'applicants-info/:applicantId',
    component: ApplicantsInfoComponent,
  },

  {
    path: 'create',
    component: CreateApplicationsComponent,
    data: {
      breadcrumb: 'Create Application',
      permission: 'Create Application',
    }, // does not exit on individual permssion
    // canDeactivate: [CanDeactivateGuard],
  },
];

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(
  FusionCharts,
  charts,
  Widgets,
  Maps,
  World,
  FusionTheme
);

@NgModule({
  declarations: [
    ApplicantsComponent,
    AllApplicationsComponent,
    CreateApplicationsComponent,
    ApplicantsDashboardComponent,
    ApplicantsInfoComponent,
  ],
  imports: [
    SharedModule,
    NgApexchartsModule,
    FusionChartsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes),
  ],
})
export class ApplicantsModule {}
