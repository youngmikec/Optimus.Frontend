import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { MigrationData } from '../migration-routes.component';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { CreateMigrationRouteComponent } from '../create-migration-route/create-migration-route.component';
import * as RouteQuestionSelector from 'src/app/@core/stores/routeQuestions/routeQuestions.selectors';
import * as moment from 'moment';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { CreateInvestmentTierComponent } from 'src/app/@core/shared/create-investment-tier/create-investment-tier.component';
import { IInvestmentTier } from 'src/app/@core/interfaces/investmentTier.interface';

@Component({
  selector: 'app-migration-route-dashboard',
  templateUrl: './migration-route-dashboard.component.html',
  styleUrls: ['./migration-route-dashboard.component.scss'],
})
export class MigrationRouteDashboardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  migrationRouteId!: number;
  isLoading!: Observable<boolean>;
  isLoading2!: Observable<boolean>;
  getMigrationRouteByIdSub!: Subscription;
  routeQuestionList: any[] = [];

  selectedMigration: MigrationData = {
    id: 0,
    countryId: 0,
    name: '',
    country: '',
    createdDate: '',
    createdBy: '',
    lastModifiedDate: '',
    lastModifiedBy: '',
    status: '',
  };
  selectedCountry: any = {};

  totalRouteFee: number = 0;
  totalInvestmentTier: number = 0;
  investmentTierLatestDate: string = '';
  routeFeeLatestDate: string = '';
  totalRouteQuestion: number = 0;
  routeQuestionLatestDate: string = '';
  BreadcrumbSub!: Subscription;

  migrationPermissions: boolean[] = [];
  permissions1: boolean[] = [];
  permissions2: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions1 =
        this.permissionService.getPermissionStatuses('Route Questions');
      this.permissions2 =
        this.permissionService.getPermissionStatuses('Route Fees');
    });

    this.isLoading = this.store.pipe(
      select(MigrationRoutesSelector.getMigrationRouteIsLoading)
    );
    this.isLoading2 = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );

    if (this.route.snapshot.paramMap.get('routeId')) {
      this.migrationRouteId = parseInt(
        this.route.snapshot.paramMap.get('routeId') || ''
      );

      this.getMigrationRouteById();
    } else {
      this.router.navigate(['/app/admin-settings/country-setup']);
    }
  }

  ngAfterViewInit() {
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );
    this.getRouteQuestionList();
  }

  getMigrationRouteById() {
    this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      MigrationRoutesActions.GetMigrationRoutesById({
        payload: {
          id: this.migrationRouteId,
        },
      })
    );

    this.getMigrationRouteByIdSub = this.store
      .pipe(select(MigrationRoutesSelector.getMigrationRoutesById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedMigration = res;
          this.getCountryById();
        }
      });
  }

  getCountryById() {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: this.selectedMigration?.countryId || 0,
        },
      })
    );

    this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedCountry = res;
        }
      });
  }

  getRouteQuestionList() {
    this.store
      .pipe(select(RouteQuestionSelector.getAllRouteQuestionByMigrationId))
      .subscribe((resData: any) => {
        if (resData) {
          this.routeQuestionList = resData;
        }
      });
  }

  openAddOrEditCountry(type: string, editData: any) {
    this.dialog.open(CreateMigrationRouteComponent, {
      data: {
        type,
        editData,
      },
    });
  }

  openInvestmentModal(mode: string, record: IInvestmentTier | null = null) {
    this.dialog.open(CreateInvestmentTierComponent, {
      data: {
        mode: mode,
        country: this.selectedCountry,
        migrationRoute: this.selectedMigration,
        editInvestmentTier: record ? record : null,
      },
    });
  }

  totalRouteFeesEvent(data: any) {
    this.totalRouteFee = data.total;
    this.routeFeeLatestDate = moment(data.date).fromNow();
  }

  totalInvestmentTierEvent(data: any) {
    this.totalInvestmentTier = data.total;
    this.investmentTierLatestDate = moment(data.date).fromNow();
  }

  totalRouteQuestionsEvent(data: any) {
    this.totalRouteQuestion = data.total;
    this.routeQuestionLatestDate = moment(data.date).fromNow();
  }

  ngOnDestroy(): void {
    if (this.getMigrationRouteByIdSub) {
      this.getMigrationRouteByIdSub;
    }
  }
}
