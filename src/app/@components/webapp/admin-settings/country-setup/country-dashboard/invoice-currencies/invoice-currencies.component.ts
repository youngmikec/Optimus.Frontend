import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';

// import * as MigrationRouteActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
// import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as InvoiceCurrenciesAction from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.actions';
import * as InvoiceCurrenciesSelector from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import { Subscription } from 'rxjs';
// import { CreateRouteQuestionsComponent } from './create-route-questions/create-route-questions.component';
import { ActivatedRoute } from '@angular/router';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

export interface InvoiceCurrenciesData {
  countryId?: number;
  id?: number;
  question: string;
  country: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-invoice-currencies',
  templateUrl: './invoice-currencies.component.html',
  styleUrls: ['./invoice-currencies.component.scss'],
})
export class InvoiceCurrenciesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'name',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<InvoiceCurrenciesData[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  totalRecords = 10;
  getAllInvoiceCurrenciesSub!: Subscription;
  readonly editRoute: string = 'edit';
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  countryId: number;
  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  // routeQuestionList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {
    this.countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
  }

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Invoice Currencies');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllRouteQuestion();
    this.countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
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
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: this.globalSkip, take: this.globalTake },
      })
    );
  }

  getAllInvoiceCurrencyByCountryId() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
        payload: { id: countryId },
      })
    );
  }

  manageAllRouteQuestion() {
    this.getAllInvoiceCurrencyByCountryId();

    this.getAllInvoiceCurrenciesSub = this.store
      .pipe(
        select(InvoiceCurrenciesSelector.getAllInvoiceCurrenciesByCountryId)
      )
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          resData?.forEach((data: any) => {
            const modifiedConutry = {
              ...data,
              createdDate: new Date(data.createdDate).getTime(),
              lastModifiedDate: new Date(data.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedConutry);
          });

          const sortedRoles = modifiedList.slice().sort((a, b) => {
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
    // const skip = pageIndex * pageSize;
    // const take = pageIndex > 0 ? (pageIndex + 1) * pageSize : pageSize;
    // this.store.dispatch(
    //   CurrencyActions.GetAllRole({
    //     payload: { skip, take, searchValue: '', filter: [] },
    //   })
    // );
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
        const name = data.currencyCode.toLowerCase();
        return name.includes(filter);
      };
    }
  }

  onChangeRoleStatus(event: any, id: number) {
    this.store.dispatch(InvoiceCurrenciesAction.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        InvoiceCurrenciesAction.ActivateInvoiceCurrencies({
          payload: {
            id: id,
            countryId: this.countryId,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        InvoiceCurrenciesAction.DeactivateInvoiceCurrencies({
          payload: {
            id: id,
            countryId: this.countryId,
          },
        })
      );
    }
  }

  openAddOrEdit(type: string, editData: any) {
    this.dialog.open(CreateInvoiceComponent, {
      data: {
        type,
        editData,
        countryId: this.countryId,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllInvoiceCurrenciesSub) {
      this.getAllInvoiceCurrenciesSub.unsubscribe();
    }
  }
}
