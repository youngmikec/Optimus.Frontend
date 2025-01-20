import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CreateCurrencyConversionComponent } from './create-currency-conversion/create-currency-conversion.component';
import { CreateCurrencyComponent } from './create-currency/create-currency.component';

import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as currencySelectors from 'src/app/@core/stores/currency/currency.selectors';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-currency-config',
  templateUrl: './currency-config.component.html',
  styleUrls: ['./currency-config.component.scss'],
})
export class CurrencyConfigComponent implements OnInit, OnDestroy {
  tabChangeEvent: number = 0;
  isLoading!: Observable<boolean>;
  currencies!: string[];
  currencyConversion!: string[];

  displayedColumns: string[] = [
    'currencyCode',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
    'isDefault',
  ];
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  allCurrency!: any[];
  getAllCurrencySub!: Subscription;
  canChangeCurrencyStatus = false;
  canAddCurrency = false;
  canEditCurrency = false;
  recordToDelete!: any;

  @Input() tableColumn!: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  permissions: boolean[] = [];
  searchInputParam!: any | null;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
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
    // this.onTabChange({ tab: { textLabel: 'Currencies' } } as MatTabChangeEvent);
    this.onTabChange({ index: 0 } as MatTabChangeEvent);
    this.manageAllCurrency();

    this.store
      .pipe(select(authSelectors.getUserPermissions))
      .subscribe((permissions: any) => {
        if (permissions) {
          this.canChangeCurrencyStatus = permissions.includes(
            'Activate/ Deactivate Currency'
          );
          this.canAddCurrency = permissions.includes('Create Currency');
          this.canEditCurrency = permissions.includes('Edit Currency');
        }
      });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabChangeEvent = event.index;
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

  getAllCurrencies(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: skip, take: take },
      })
    );
  }

  manageAllCurrency() {
    this.getAllCurrencies();

    this.getAllCurrencySub = this.store
      .pipe(select(currencySelectors.getAllCurrencies))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedCurrencies: any[] = [];

          resData?.forEach((currency: any) => {
            const modifiedCurrency = {
              ...currency,
              createdDate: new Date(currency.createdDate).getTime(),
              lastModifiedDate: new Date(currency.lastModifiedDate).getTime(),
            };

            modifiedCurrencies.push(modifiedCurrency);
          });

          const sortedCurrencies = modifiedCurrencies.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedCurrencies);

          this.searchInputParam = this.searchFilterService.getSearchParams();
          this.onInputSearch();

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count;
          });
        }
      });
  }

  onCreateCurrency() {
    this.dialog.open(CreateCurrencyComponent, {
      data: {
        instance: 'create',
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onEditCurrency(currency: any) {
    this.dialog.open(CreateCurrencyComponent, {
      data: {
        instance: 'update',
        currencyName: currency?.name,
        currencyId: currency?.id,
        currencyCode: currency?.currencyCode,
        isDefault: currency?.isDefault,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onCreateCurrencyConversion() {
    this.dialog.open(CreateCurrencyConversionComponent, {
      data: {
        instance: 'create',
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageIndex > 0 ? pageIndex * pageSize : pageSize;
    this.getAllCurrencies(skip, take);
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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  onToggle(row: any) {
    if (row.status === 1) {
      this.store.dispatch(
        CurrencyActions.DeactivateCurrency({
          payload: {
            id: row.id,
          },
        })
      );
    } else if (row.status === 2) {
      this.store.dispatch(
        CurrencyActions.ActivateCurrency({
          payload: {
            id: row.id,
          },
        })
      );
    }
  }

  deleteRecord() {
    this.store.dispatch(
      CurrencyActions.DeleteCurrency({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Currency',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllCurrencySub) {
      this.getAllCurrencySub.unsubscribe();
    }
  }
}
