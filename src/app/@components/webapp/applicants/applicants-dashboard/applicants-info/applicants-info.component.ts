import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { CreateApplicationsComponent } from '../../create-applications/create-applications.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicantsDashboardActions from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.actions';
import * as ApplicantsDashboardSelector from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.selectors';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

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

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

@Component({
  selector: 'app-applicants-info',
  templateUrl: './applicants-info.component.html',
  styleUrls: ['./applicants-info.component.scss'],
})
export class ApplicantsInfoComponent implements OnInit, OnDestroy {
  public chartOptions: Partial<ChartOptions> | any;
  @ViewChild('chart') chart!: ChartComponent;

  displayedColumns: string[] = ['name', 'createdDate', 'createdBy', 'status'];
  dataSource: MatTableDataSource<any[]> | null = null;

  permissions: boolean[] = [];

  getMainApplicantDashboardSub!: Subscription;
  getTopApplicantSub!: Subscription;
  getApplicantDashboardQuerySub!: Subscription;
  getSingleApplicantDashboardQuerySub!: Subscription;
  getTopCountrySub!: Subscription;

  singleApplicantDashboardData!: any;
  topApplicantList!: any[];
  topCountryByApplicantList!: any;
  selectedChart: string = 'invoice';
  applicantIndex: number = 0;
  animationState: 'prev' | 'next' = 'next';
  yearList: number[] = [];
  selectedYear: number = 2023;

  applicantId = parseInt(this.route.snapshot.paramMap.get('applicantId') || '');

  constructor(
    public dialog: MatDialog,
    private permissionService: PermissionService,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {
    this.chartOptions = {
      series: [
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
  }

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Applicant');
    });
    this.getSingleApplicantDashboardQuery(this.applicantId);
    this.generateYearList();
    this.getTopApplicant();
    this.getApplicantDashboardQuery();
    this.getTopCountryByApplicant();
  }

  generateYearList() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2022; year--) {
      this.yearList.push(year);
    }
  }

  onCreateApplicant(instance: 'create' | 'update', applicantData?: any) {
    this.dialog.open(CreateApplicationsComponent, {
      data: {
        instance: instance,
        applicant: applicantData,
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
      panelClass: 'opt2-dialog',
    });
  }

  getApplicantDashboardQuery(year = new Date().getFullYear()) {
    this.store.dispatch(
      ApplicantsDashboardActions.GetApplicantsDashboardQuery({
        payload: {
          year: year,
        },
      })
    );

    this.getApplicantDashboardQuerySub = this.store
      .pipe(select(ApplicantsDashboardSelector.getApplicantsDashboard))
      .subscribe((resData: any) => {
        if (resData) {
          this.chartOptions = {
            ...this.chartOptions,
            series: [
              {
                name: 'Applications',
                data: resData.applicantsByMonth.map(
                  (value: any) => value.count
                ),
              },
            ],
          };
        }
      });
  }

  getSingleApplicantDashboardQuery(applicantId: number) {
    this.store.dispatch(
      ApplicantsDashboardActions.GetSingleApplicantsDashboardQuery({
        payload: {
          applicantId: applicantId,
        },
      })
    );

    this.getSingleApplicantDashboardQuerySub = this.store
      .pipe(
        select(ApplicantsDashboardSelector.getSingleApplicantDashboardQuery)
      )
      .subscribe((resData: any) => {
        if (resData) {
          this.singleApplicantDashboardData = resData;
        }
      });
  }

  getTopApplicant() {
    this.store.dispatch(
      ApplicantsDashboardActions.GetTopApplicants({
        payload: { skip: 0, take: 10 },
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

  getTopCountryByApplicant() {
    this.store.dispatch(
      ApplicantsDashboardActions.GetTopCountryByApplicant({
        payload: { skip: 0, take: 5 },
      })
    );

    this.getTopCountrySub = this.store
      .pipe(select(ApplicantsDashboardSelector.getTopCountryByApplicant))
      .subscribe((resData: any) => {
        if (resData) {
          this.topCountryByApplicantList = resData.pageItems.map(
            (value: any) => {
              return {
                ...value,
                percentageValue: Math.round(value?.percentageValue),
              };
            }
          );
        }
      });
  }

  onCouraselChange(type: 'prev' | 'next') {
    if (type === 'next') {
      this.applicantIndex < this.topApplicantList.length - 1
        ? this.applicantIndex++
        : (this.applicantIndex = 0);
    } else if (type === 'prev') {
      this.applicantIndex === 0
        ? (this.applicantIndex = this.topApplicantList.length - 1)
        : this.applicantIndex--;
    }
    this.getSingleApplicantDashboardQuery(
      this.topApplicantList[this.applicantIndex]?.applicant?.id
    );
  }

  onSelectedYearChange(event: { value: number }) {
    this.getApplicantDashboardQuery(event.value);
  }

  ngOnDestroy(): void {
    if (this.getTopApplicantSub) {
      this.getTopApplicantSub.unsubscribe();
    }
    if (this.getMainApplicantDashboardSub) {
      this.getMainApplicantDashboardSub.unsubscribe();
    }
    if (this.getApplicantDashboardQuerySub) {
      this.getApplicantDashboardQuerySub.unsubscribe();
    }
    if (this.getTopCountrySub) {
      this.getTopCountrySub.unsubscribe();
    }
    if (this.getSingleApplicantDashboardQuerySub) {
      this.getSingleApplicantDashboardQuerySub.unsubscribe();
    }
  }
}
