import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartComponent } from './charts-component/bar-chart/bar-chart.component';
import { PieChartComponent } from './charts-component/pie-chart/pie-chart.component';

@NgModule({
  declarations: [DashboardComponent, BarChartComponent, PieChartComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    SharedModule,
  ],
})
export class DashboardModule {}
