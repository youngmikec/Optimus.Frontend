import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MigrationRouteDashboardComponent } from './migration-route-dashboard.component';
import { RouteQuestionsComponent } from '../migration-route-dashboard/route-questions/route-questions.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CreateRouteQuestionsComponent } from './route-questions/create-route-questions/create-route-questions.component';
import { RouteFeesComponent } from './route-fees/route-fees.component';
import { CreateRouteFeesComponent } from './route-fees/create-route-fees/create-route-fees.component';
import { InvestmentTiersComponent } from './investment-tiers/investment-tiers.component';

const routes: Routes = [
  {
    path: '',
    // data: { breadcrumb: 'Real Estate Investment' },
    component: MigrationRouteDashboardComponent,
    // data: { permission: 'Documents' },
  },

  {
    path: 'createFee/:type',
    data: { breadcrumb: 'Route Fee' },
    component: CreateRouteFeesComponent,
  },

  {
    path: 'createFee/edit/:feeId',
    data: { breadcrumb: 'Route Fee' },
    component: CreateRouteFeesComponent,
  },

  {
    path: 'createQuestion',
    data: { breadcrumb: 'Route Question' },
    component: CreateRouteQuestionsComponent,
  },

  {
    path: 'createQuestion/edit/:questionId',
    data: { breadcrumb: 'Route Question' },
    component: CreateRouteQuestionsComponent,
  },
];

@NgModule({
  declarations: [
    MigrationRouteDashboardComponent,
    RouteQuestionsComponent,
    CreateRouteQuestionsComponent,
    RouteFeesComponent,
    CreateRouteFeesComponent,
    InvestmentTiersComponent,
  ],
  imports: [
    SharedModule,
    DragDropModule,
    RouterModule.forChild(routes),
    NgApexchartsModule,
  ],
})
export class MigrationRouteDashboardModule {}
