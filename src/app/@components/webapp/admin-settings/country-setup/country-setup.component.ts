import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateCountryComponent } from './create-country/create-country.component';
import { select, Store } from '@ngrx/store';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as CountryCodeAction from 'src/app/@core/stores/general/general.actions';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

export interface CountryCodeData {
  id?: number;
  name: string;
  flag: string;
  dialCode: string;
}

export interface CountryData {
  id: number;
  name: string;
  currency: any;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-country-setup',
  templateUrl: './country-setup.component.html',
  styleUrls: ['./country-setup.component.scss'],
})
export class CountrySetupComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'country',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<CountryData[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllContriesSub!: Subscription;
  readonly editRoute: string = 'edit';
  pageSize: number = 10;
  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;
  recordToDelete!: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  permissions: boolean[] = [];
  searchInputParam!: any | null;

  allCurrencyList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Country');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllCountries();
  }

  ngAfterViewInit() {
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: 0, take: 9999 },
      })
    );
  }

  getAllContries(skip: number, take: number) {
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: {
          skip,
          take,
        },
      })
    );
  }

  manageAllCountries() {
    this.getAllContries(this.globalSkip, 9999);

    this.getAllContriesSub = this.store
      .pipe(select(CountriesSelector.getAllCountry))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedCountryList: any[] = [];

          resData?.forEach((country: any) => {
            const modifiedConutry = {
              ...country,
              createdDate: new Date(country.createdDate).getTime(),
              lastModifiedDate: new Date(country.lastModifiedDate).getTime(),
            };

            modifiedCountryList.push(modifiedConutry);
          });

          const sortedRoles = modifiedCountryList.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedRoles);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count!;
          });
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource!.data);
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.pageSize = pageSize;
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageIndex > 0 ? (pageIndex + 1) * pageSize : pageSize;
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: { skip: this.globalSkip, take: this.globalTake },
      })
    );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search(this.searchInputParam);
    }
  }

  search(input: string) {
    this.dataSource!.filter = input?.trim().toLowerCase();

    if (this.dataSource!.paginator) {
      this.dataSource!.paginator.firstPage();
    }

    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const name = data.name.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  onChangeRoleStatus(event: any, id: number) {
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        CountriesActions.ActivateCountry({
          payload: {
            id: id,
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        CountriesActions.DeactivateCountry({
          payload: {
            id: id,
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    }
  }

  openAddOrEditCountry(type: string, editData: any) {
    this.dialog.open(CreateCountryComponent, {
      data: {
        type,
        editData,
        skip: this.globalSkip,
        take: this.globalTake,
        currencyList: this.allCurrencyList,
      },
    });
  }

  goToCountryDashboard(id: number, name: string) {
    this.router.navigate(
      ['/app/admin-settings/country-setup/dashboard', id, name]
      // { skipLocationChange: true }
    );
  }

  navigateToRoute(route: string) {
    this.router.navigate([route], { skipLocationChange: true });
  }

  deleteRecord() {
    this.store.dispatch(
      CountriesActions.DeleteCountry({
        payload: {
          id: this.recordToDelete ? this.recordToDelete?.id : 0,
          skip: this.globalSkip,
          take: 9999,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Country',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllContriesSub) {
      this.getAllContriesSub.unsubscribe();
    }
  }
}
