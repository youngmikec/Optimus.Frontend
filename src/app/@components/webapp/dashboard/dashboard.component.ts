import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartComponent } from 'ng-apexcharts';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs';
//import * as moment from 'moment';
//import 'moment-timezone';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as DashboardActions from 'src/app/@core/stores/dashboard/dashboard.actions';
import * as dashboardSelectors from 'src/app/@core/stores/dashboard/dashboard.selectors';
import * as ApplicantsDashboardActions from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.actions';
import * as ApplicantsDashboardSelector from 'src/app/@core/stores/applicantsDashboard/applicantDashboard.selectors';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexYAxis,
} from 'ng-apexcharts';
import { select, Store } from '@ngrx/store';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  pieChartData: any;

  noOfApplicants!: any;
  noOfMaleApplicants!: any;
  noOfFemaleApplicants!: any;
  applicantsByGender!: any;
  applicantsPerCountry!: any;
  applicantCountryName: any | [] = [];
  applicantCountryData: any | [] = [];
  filterOptions: any[] = [
    {
      name: 'Year',
      value: 'year',
    },
    {
      name: 'Month',
      value: 'month',
    },
    {
      name: 'Week',
      value: 'week',
    },
  ];
  selectedFilter = this.filterOptions[0].value;
  filteredDate!: any;

  getAllDashboardSub!: Subscription;
  getApplicantByGenderSub!: Subscription;

  donutChart!: Partial<ChartOptions> | any;
  barChart!: Partial<ChartOptions> | any;

  displayedColumns: string[] = [
    'applicant_name',
    'phone_number',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'status',
  ];

  dataSource: MatTableDataSource<any[]> | null = null;

  public pageSize = 10;
  public currentPage = 0;
  public totalSize: number = 0;

  totalRecords!: number;

  @ViewChild('chart') chart!: ChartComponent;

  applicantByGenderPercentage: number[] = [1, 99];

  constructor(private store: Store<fromApp.AppState>) {
    this.donutChart = {
      colors: ['#0235CD', '#80171A'],
      chart: {
        type: 'donut',
      },
      labels: ['Male', 'Female'],
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

    this.barChart = {
      series: [
        {
          name: 'My-series',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: this.applicantCountryName,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          borderRadiusApplication: 'around',

          columnWidth: '14%',
        },
      },
      colors: ['#E7EAEE'],
    };
  }

  ngOnInit(): void {
    this.getAllDashboardSummary();
    this.getApplicantByGender();
  }

  getAllDashboardSummary(
    skip: number = DefaultPagination.skip,
    take: number = DefaultPagination.take
  ) {
    this.store.dispatch(
      DashboardActions.GetAllSummary({
        payload: {
          filter: new Date(),
          skip,
          take,
        },
      })
    );

    this.getAllDashboardSub = this.store
      .pipe(select(dashboardSelectors.getAllSummary))
      .subscribe((resData: any) => {
        if (resData !== null) {
          this.noOfApplicants = resData.noOfApplicants;
          this.applicantsByGender = resData.applicantsByGender;
          this.applicantsPerCountry = resData?.applicantsPerCountry;
          this.noOfFemaleApplicants = resData.noOfFemaleApplicants;
          this.noOfMaleApplicants = resData.noOfMaleApplicants;

          const appPerCountry = resData?.applicantsPerCountry;
          const countryData = [];
          const countryName = [];
          for (let i = 0; i < appPerCountry.length; i++) {
            countryData.push(appPerCountry[i].count);
            countryName.push(appPerCountry[i].name);

            this.applicantCountryName = countryName;
            this.applicantCountryData = countryData;

            this.barChart = {
              ...this.barChart,
              series: [
                {
                  name: 'Applicants Per Country',
                  data: countryData,
                },
              ],
            };
          }

          const modifiedApplicants: any[] = [];

          resData?.applicants?.forEach((applicant: any) => {
            const modifiedapplicant = {
              ...applicant,
              createdDate: new Date(applicant.createdDate).getTime(),
              lastModifiedDate: new Date(applicant.lastModifiedDate).getTime(),
            };

            modifiedApplicants.push(modifiedapplicant);
          });

          const sortedApplicants = modifiedApplicants.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedApplicants);
        }
      });
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }
  }

  onFilterChange({ value }: any) {
    this.filteredDate = this.getDateValues(value);
  }

  private getDateValues(val: string) {
    const today = moment.tz(new Date(), 'GMT');
    const week_start = today.startOf('week').toString();
    const week_end = today.endOf('week').toString();
    const month_start = today.startOf('month').toString();
    const month_end = today.endOf('month').toString();
    const year_start = today.startOf('year').toString();
    const year_end = today.endOf('year').toString();

    const values: any = {
      start: '',
      end: '',
    };
    switch (val) {
      case 'week':
        values.start = new Date(week_start).toISOString();
        values.end = new Date(week_end).toISOString();
        break;

      case 'month':
        values.start = new Date(month_start).toISOString();
        values.end = new Date(month_end).toISOString();
        break;

      case 'year':
        values.start = new Date(year_start).toISOString();
        values.end = new Date(year_end).toISOString();
        break;

      default:
        values.start = new Date(year_start).toISOString();
        values.end = new Date(year_end).toISOString();
        break;
    }

    return values;
  }

  getApplicantByGender(year = new Date().getFullYear()) {
    this.store.dispatch(
      ApplicantsDashboardActions.GetApplicantsDashboardQuery({
        payload: {
          year: year,
        },
      })
    );

    this.getApplicantByGenderSub = this.store
      .pipe(select(ApplicantsDashboardSelector.getApplicantsDashboard))
      .subscribe((resData: any) => {
        if (resData) {
          this.applicantByGenderPercentage = [
            resData.applicationByGender[0]?.count,
            resData.applicationByGender[1]?.count,
          ];
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getAllDashboardSub) {
      this.getAllDashboardSub.unsubscribe();
    }
    if (this.getApplicantByGenderSub) {
      this.getApplicantByGenderSub.unsubscribe();
    }
    if (this.getAllDashboardSub) {
      this.getAllDashboardSub.unsubscribe();
    }
  }
}
