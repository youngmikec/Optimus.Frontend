import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  public chartOptions: Partial<ChartOptions> | any;
  showChart: Boolean = false;

  @Input() title: string = 'Work Request';
  @Input() labels: any[] = [];
  @Input() series: any[] = [];
  @Input() genderData: any;
  @Input() isVendor: Boolean = false;

  @ViewChild('chart') chart!: ChartComponent;

  constructor() {}

  ngOnInit() {
    const values = Object?.values(this.genderData);
    if (
      values.every(
        (data: any) => data === null || data === undefined || data < 1
      )
    ) {
      this.showChart = false;
    } else {
      this.showChart = true;
    }

    this.chartOptions = {
      series: Object.values(this.genderData),
      chart: {
        type: 'donut',
        height: '400',
        width: '100%',
      },
      noData: {
        text: 'No Data Available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
      },
      labels: Object.keys(this.genderData),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
              height: 'auto',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      title: {
        text: this.title,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: true,
              },
            },
          },
        },
      },
      colors: [
        '#00736E',
        '#FFCD00',
        '#5F509B',
        '#9B5DE5',
        '#F15BB5',
        '#FEE440',
        '#31572C',
        '#00F5D4',
      ],
    };
  }
}
