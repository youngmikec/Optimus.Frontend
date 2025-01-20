import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePaymentPlanComponent } from './create-payment-plan/create-payment-plan.component';

import { select, Store } from '@ngrx/store';
import * as PaymentPlanActions from 'src/app/@core/stores/paymentPlan/paymentPlan.actions';
import * as PaymentPlanSelector from 'src/app/@core/stores/paymentPlan/paymentPlan.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

export interface PaymentPlansData {
  name: string;
  country: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<PaymentPlansData[]> | null = null;
  selection = new SelectionModel<any>(true, []);

  pageSize: number = 10;
  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;

  totalRecords = 10;
  getAllPaymentPlansSub!: Subscription;
  readonly editRoute: string = 'edit';
  permissions: boolean[] = [];
  searchInputParam!: any | null;
  recordToDelete!: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  // allCurrencyList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Payment Plan');

      // console.log(this.permissions);
      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });
    this.manageAllPaymentPlans();
  }

  getAllPPaymentPlansByCountryId() {
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      PaymentPlanActions.GetAllPaymentPlanByCountryId({
        payload: {
          id: countryId,
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  manageAllPaymentPlans() {
    this.getAllPPaymentPlansByCountryId();

    this.getAllPaymentPlansSub = this.store
      .pipe(select(PaymentPlanSelector.getAllInvoiceCurrenciesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedPaymentPlanList: any[] = [];

          resData?.forEach((country: any) => {
            const modifiedPaymentPlan = {
              ...country,
              createdDate: new Date(country.createdDate).getTime(),
              lastModifiedDate: new Date(country.lastModifiedDate).getTime(),
            };

            modifiedPaymentPlanList.push(modifiedPaymentPlan);
          });

          const sortedRoles = modifiedPaymentPlanList.slice().sort((a, b) => {
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
    const countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.pageSize = pageSize;
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;
    this.store.dispatch(
      PaymentPlanActions.GetAllPaymentPlanByCountryId({
        payload: {
          id: countryId,
          skip: this.globalSkip,
          take: this.globalTake,
        },
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

  onChangeRoleStatus(event: any, record: any) {
    this.store.dispatch(PaymentPlanActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        PaymentPlanActions.ActivatePaymentPlan({
          payload: {
            id: record?.id,
            countryId: record?.countryId,
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        PaymentPlanActions.DeactivatePaymentPlan({
          payload: {
            id: record?.id,
            countryId: record?.countryId,
            skip: this.globalSkip,
            take: this.globalTake,
          },
        })
      );
    }
  }

  createEditPaymentPlan(type: string, editData: any) {
    this.dialog.open(CreatePaymentPlanComponent, {
      width: '55%',
      data: {
        skip: this.globalSkip,
        take: this.globalTake,
        type,
        editData,
        countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
      },
    });
  }

  deleteRecord() {
    this.store.dispatch(
      PaymentPlanActions.DeletePaymentPlan({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
          countryId: this.recordToDelete ? this.recordToDelete.countryId : 0,
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Payment Plan',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllPaymentPlansSub) {
      this.getAllPaymentPlansSub.unsubscribe();
    }
  }
}
