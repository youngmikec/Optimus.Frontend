import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as CountryCodeAction from 'src/app/@core/stores/general/general.actions';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { Observable, Subscription } from 'rxjs';
import { CreateCountryComponent } from '../create-country/create-country.component';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from 'src/app/@core/services/permission.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-country-dashboard',
  templateUrl: './country-dashboard.component.html',
  styleUrls: ['./country-dashboard.component.scss'],
})
export class CountryDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('chart') chart: ChartComponent | any;
  public chartOptions!: Partial<ChartOptions> | any;

  countryId!: number;
  isLoading!: Observable<boolean>;
  getCountryByIdSub!: Subscription;
  getCountryDashboardByIdSub!: Subscription;

  BreadcrumbSub!: Subscription;

  selectedContry: any = {};
  dashboardData: any = {};
  dashboardDataPercentage: any[] = [1, 99];
  dashboardDataMissingParameters: any[] = [];

  canViewInvoiceCurrency: boolean = false;
  canViewFamilyMembers: boolean = false;
  canViewFamilyMemberTypeSettings: boolean = false;
  canViewProductCategory: boolean = false;
  canViewProducts: boolean = false;
  canViewPaymentPlan: boolean = false;
  canViewMigrationRoutes: boolean = false;
  canViewDiscount: boolean = false;

  countryPermission: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {
    this.chartOptions = {
      chart: {
        type: 'donut',
        width: '220',
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          // startAngle: -40,
          offsetX: -20,
          expandOnClick: false,
          donut: {
            size: '75%',

            labels: {
              show: false,
              total: {
                show: true,
                label: '90%',
                offsetY: -16,
                formatter: () => '',
              },
            },
          },
        },
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      colors: ['#10B981', '#ECFDF5'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
    };
  }

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.canViewInvoiceCurrency =
        this.permissionService.getPermissionStatuses('Invoice Currencies')[0];
      this.canViewFamilyMembers =
        this.permissionService.getPermissionStatuses('Family Member')[0];
      this.canViewFamilyMemberTypeSettings =
        this.permissionService.getPermissionStatuses(
          'Family Member Type Setting'
        )[0];
      this.canViewProductCategory =
        this.permissionService.getPermissionStatuses('Product Category')[0];
      this.canViewProducts =
        this.permissionService.getPermissionStatuses('Product')[0];
      this.canViewPaymentPlan =
        this.permissionService.getPermissionStatuses('Payment Plan')[0];
      this.canViewMigrationRoutes =
        this.permissionService.getPermissionStatuses('Migration Routes')[0];

      this.canViewDiscount =
        this.permissionService.getPermissionStatuses('Discount')[0];

      this.countryPermission =
        this.permissionService.getPermissionStatuses('Migration Routes');
    });
    this.isLoading = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );

    if (this.route.snapshot.paramMap.get('id')) {
      this.countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');

      this.getCountryById();
      this.getDashboardData();
    } else {
      this.router.navigate(['/app/admin-settings/country-setup']);
    }
  }

  ngAfterViewInit() {
    this.store.dispatch(CountryCodeAction.GetCountryCodes());
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: {
          skip: 0,
          take: 10,
        },
      })
    );
  }

  getDashboardData() {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      CountriesActions.GetCountryDashboardById({
        payload: {
          id: this.countryId,
        },
      })
    );

    this.getCountryDashboardByIdSub = this.store
      .pipe(select(CountriesSelector.getCountryDashboardById))
      .subscribe((res: any) => {
        if (res !== null) {
          let percent: number = 100;
          let missingKeys: any[] = [];
          this.dashboardData = { ...res };

          delete this.dashboardData.product;
          delete this.dashboardData.productCategory;

          missingKeys = Object.keys(this.dashboardData);
          Object.values(this.dashboardData).forEach((x, i) => {
            if (x === 0) {
              this.dashboardDataMissingParameters.push(missingKeys[i]);
              percent -= 25;
            }
          });
          if (percent !== 0) {
            this.dashboardDataPercentage = [percent, 100 - percent];
          }
        }
      });
  }

  getCountryById() {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: this.countryId,
        },
      })
    );

    this.getCountryByIdSub = this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedContry = res;
        }
      });
  }

  openAddOrEditCountry(type: string, editData: any) {
    this.dialog.open(CreateCountryComponent, {
      data: {
        type,
        editData,
        skip: 0,
        take: 100,
      },
    });
  }

  onChangeRoleStatus(event: any, id: number) {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        CountriesActions.ActivateCountry({
          payload: {
            id: id,
            skip: 0,
            take: 9999,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        CountriesActions.DeactivateCountry({
          payload: {
            id: id,
            skip: 0,
            take: 9999,
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(CountriesActions.ClearCountryDashboardData());
    this.getCountryDashboardByIdSub
      ? this.getCountryDashboardByIdSub.unsubscribe()
      : '';
    // this.BreadcrumbSub.unsubscribe();
    this.getCountryByIdSub ? this.getCountryByIdSub.unsubscribe() : '';
  }
}
