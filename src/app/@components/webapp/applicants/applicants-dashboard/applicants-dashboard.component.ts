import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexResponsive,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { CreateApplicationsComponent } from '../create-applications/create-applications.component';
import * as ApplicantsDashboardActions from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.actions';
import * as ApplicantsDashboardSelector from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.selectors';
import { ApplicantDashboardQueryInterface } from 'src/app/@core/interfaces/applicant.interface';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-applicants-dashboard',
  templateUrl: './applicants-dashboard.component.html',
  styleUrls: ['./applicants-dashboard.component.scss'],
})
export class ApplicantsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  donutChart!: Partial<ChartOptions> | any;

  guageDataSource: any;

  user: any;
  userSub!: Subscription;
  getApplicantDashboardQuerySub!: Subscription;
  getTopApplicantSub!: Subscription;
  getApplicantCountByCountrySub!: Subscription;
  getTopCountrySub!: Subscription;

  dashboardDataPercentage: number[] = [1, 99];
  topApplicantList!: any[];
  applicantByCountryList!: any;
  topCountryByApplicantList!: any;
  applicantDashboardData!: any;

  selectedChart: string = 'applicant';

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Applications',
          data: [],
        },
      ],
      series2: [
        {
          name: 'Applications',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          top: 29,
          left: 1,
          blur: 30,
          color: '#40BAFF',
          opacity: 1,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };

    this.guageDataSource = {
      chart: {
        caption: 'Application Performance',
        lowerLimit: '0',
        upperLimit: '100',
        showValue: '1',
        numberSuffix: '%',
        theme: 'fusion',
        showToolTip: '1',
      },
      colorRange: {
        color: [
          {
            minValue: '0',
            maxValue: '75',
            code: '#10B981',
          },
          {
            minValue: '75',
            maxValue: '100',
            code: '#EB9B00',
          },
        ],
      },
      dials: {
        dial: [
          {
            value: '0',
          },
        ],
      },
    };

    this.donutChart = {
      colors: ['#EF476F', '#1B9AAA'],
      chart: {
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Male', 'Female'],
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
              fontSize: '14px',
              fontFamily: 'Greycliff CF',
              fontWeight: '600',
              itemMargin: {
                horizontal: 40,
                vertical: 30,
              },
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
          },
        },
      },
    };
  }

  displayedColumns: string[] = ['name', 'createdDate', 'createdBy', 'status'];
  dataSource: MatTableDataSource<any[]> | null = null;

  ngOnInit(): void {
    this.getUser();
    this.getTopApplicant();
    this.getTopCountryByApplicant();
    this.getApplicantDashboardQuery();
  }

  getUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res) => {
      if (res !== null) this.user = res;
    });
  }

  getApplicantDashboardQuery(year = 2023) {
    this.store.dispatch(
      ApplicantsDashboardActions.GetApplicantsDashboardQuery({
        payload: {
          year: year,
        },
      })
    );

    this.getApplicantDashboardQuerySub = this.store
      .pipe(select(ApplicantsDashboardSelector.getApplicantsDashboard))
      .subscribe((resData: ApplicantDashboardQueryInterface) => {
        if (resData) {
          this.dashboardDataPercentage = [
            resData.applicationByGender[0]?.count,
            resData.applicationByGender[1]?.count,
          ];

          this.applicantDashboardData = resData;

          this.chartOptions = {
            ...this.chartOptions,
            series: [
              {
                name: 'Applications',
                data: resData.applicantsByMonth.map((value) => value.count),
              },
            ],
          };

          this.guageDataSource = {
            ...this.guageDataSource,
            colorRange: {
              color: [
                {
                  minValue: '0',
                  maxValue: Math.round(
                    (resData.applicationPerformance[0]?.count /
                      resData.applicationQuotesCount) *
                      100
                  ),
                  code: '#10B981',
                },
                {
                  minValue: Math.round(
                    (resData.applicationPerformance[0]?.count /
                      resData.applicationQuotesCount) *
                      100
                  ),
                  maxValue: '100',
                  code: '#EB9B00',
                },
              ],
            },
            dials: {
              dial: [
                {
                  value: Math.round(
                    (resData.applicationPerformance[0]?.count /
                      resData.applicationQuotesCount) *
                      100
                  ),
                },
              ],
            },
          };
        }
      });
  }

  getTopApplicant() {
    this.store.dispatch(
      ApplicantsDashboardActions.GetTopApplicants({
        payload: { skip: 0, take: 8 },
      })
    );

    this.getTopApplicantSub = this.store
      .pipe(select(ApplicantsDashboardSelector.getTopApplicants))
      .subscribe((resData: any) => {
        if (resData) {
          this.topApplicantList = resData.pageItems;

          const modifiedApplicants: any[] = [];
          resData?.pageItems?.forEach((applicant: any) => {
            const modifiedapplicant = {
              ...applicant,
              createdDate: new Date(applicant.createdDate).getTime(),
              lastModifiedDate: new Date(applicant.lastModifiedDate).getTime(),
            };

            modifiedApplicants.push(modifiedapplicant);
          });
          this.dataSource = new MatTableDataSource(modifiedApplicants);
        }
      });
  }

  getApplicantCountByCountry() {
    this.store.dispatch(
      ApplicantsDashboardActions.GetApplicantsCountByCountry()
    );

    this.getApplicantCountByCountrySub = this.store
      .pipe(select(ApplicantsDashboardSelector.getApplicantsCountByCountry))
      .subscribe((resData: any[]) => {
        if (resData) {
          const totalApplicant = resData
            .map((value) => value.count) // flatten array
            .reduce((a: any, b: any) => {
              return a + b;
            }, 0);

          this.applicantByCountryList = [...resData].map((value: any) => {
            return {
              ...value,
              percent: Math.round((value?.count / totalApplicant) * 100),
            };
          });
        }
      });
  }

  getTopCountryByApplicant() {
    this.store.dispatch(
      ApplicantsDashboardActions.GetTopCountryByApplicant({
        payload: { skip: 0, take: 4 },
      })
    );

    this.getTopCountrySub = this.store
      .pipe(select(ApplicantsDashboardSelector.getTopCountryByApplicant))
      .subscribe((resData: any) => {
        if (resData) {
          this.topCountryByApplicantList = [...resData.pageItems]
            .sort((a: any, b: any) =>
              a.country.name.localeCompare(b.country.name)
            )
            .map((value: any) => {
              return {
                ...value,
                percentageValue: Math.round(value?.percentageValue),
              };
            });
        }
      });
  }

  goToSeeAllApplicantPage() {
    this.router.navigate([`app/applicants/all-applicants`]);
  }

  goToSignleApplicantPage(applicant: any) {
    this.router.navigate([
      `/app/applicants/applicants-info/${applicant?.applicant?.id}`,
    ]);
  }

  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        department: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt2-dialog',
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.getTopApplicantSub) {
      this.getTopApplicantSub.unsubscribe();
    }
    if (this.getApplicantDashboardQuerySub) {
      this.getApplicantDashboardQuerySub.unsubscribe();
    }
    if (this.getApplicantCountByCountrySub) {
      this.getApplicantCountByCountrySub.unsubscribe();
    }
    if (this.getTopCountrySub) {
      this.getTopCountrySub.unsubscribe();
    }
  }
}
