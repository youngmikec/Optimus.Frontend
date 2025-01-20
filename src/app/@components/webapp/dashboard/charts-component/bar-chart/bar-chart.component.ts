import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnDestroy {
  _colors!: any[];
  showChart = false;

  @Input() categories: string[] = [];
  @Input() title = '';
  @Input() height = 'auto';
  @Input() series: any[] = [];
  @Input() multiple: boolean = false;
  @Input() colors!: any[];
  @Input() legend = {
    show: false,
  };

  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> | any;

  constructor() {}

  ngOnInit(): void {
    if (this.multiple) {
      this._colors = [
        ...new Set(['#9B5DE5', '#F15BB5', '#FEE440', '#31572C', '#00F5D4']),
      ];
    } else {
      this._colors = ['#FFE680'];
    }
    this.chartOptions = {
      series: this.series,
      chart: {
        height: this.height,
        type: 'bar',
        width: '100%',
        toolbar: {
          show: false,
        },
      },
      noData: {
        text: 'No Data Available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
      },
      title: {
        text: this.title,
      },
      xaxis: {
        categories: this.categories,
      },
      colors: this._colors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: this.legend,
      grid: {
        show: true,
      },
    };
    this.showChart = true;
  }

  ngOnDestroy(): void {
    this.chartOptions = null;
    this.showChart = false;
  }
}
