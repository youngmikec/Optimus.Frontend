import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDiscountComponent } from './create-discount/create-discount.component';

import { select, Store } from '@ngrx/store';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelectors from 'src/app/@core/stores/discount/discount.selectors';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
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

export interface DiscountData {
  country: string;
  migrationRoute: string;
  discountType: string;
  percenatage?: string;
  amount?: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'country',
    'migrationRoute',
    'percenatageAmount',
    'startDate',
    'endDate',
    'createdBy',
    'createdDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<DiscountData[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  canCreateDiscount: boolean = false;
  canDeleteDiscount: boolean = false;
  countryId!: number;

  pageSize: number = 10;
  selectedContry!: any;
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
    if (this.route.snapshot.paramMap.get('id')) {
      this.countryId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    }
    this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedContry = res;
        }
      });

    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.permissionService.currentUserPermissionValue.subscribe(() => {
      this.permissions =
        this.permissionService.getPermissionStatuses('Discount');

      this.canCreateDiscount =
        this.permissionService.hasPermission('Create Discount');
      this.canDeleteDiscount =
        this.permissionService.hasPermission('Delete Discount');

      if (this.permissions[0] !== true) {
        this.permissionService.routeToUnauthorizedPage();
      }
    });

    this.manageDiscountList();
  }

  getDiscountList(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      DiscountActions.GetAllDiscountByCountryId({
        payload: { skip: skip, take: take, countryId: this.countryId },
      })
    );
  }

  manageDiscountList() {
    this.getDiscountList();

    this.store
      .pipe(select(DiscountSelectors.getAllDiscountByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          // ?.filter((item: any) => item.countryId === countryId)
          resData?.data.forEach((item: any) => {
            const modifiedItem = {
              ...item,
              createdDate: new Date(item.createdDate).getTime(),
              lastModifiedDate: new Date(item.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedItem);
          });

          const sortedList = modifiedList.slice().sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();

            return dateB - dateA; //Descending order
          });

          this.dataSource = new MatTableDataSource(sortedList);

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.totalCount!;
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
    this.globalTake = pageSize;
    this.store.dispatch(
      DiscountActions.GetAllDiscount({
        payload: {
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
    this.store.dispatch(DiscountActions.IsLoading({ payload: true }));
    if (event.checked === true) {
      this.store.dispatch(
        DiscountActions.UpdateDiscountStatus({
          payload: {
            id: record?.id,
            status: 1,
            skip: this.globalSkip,
            take: this.globalTake,
            countryId: this.countryId,
          },
        })
      );
    } else if (event.checked === false) {
      this.store.dispatch(
        DiscountActions.UpdateDiscountStatus({
          payload: {
            id: record?.id,
            status: 2,
            skip: this.globalSkip,
            take: this.globalTake,
            countryId: this.countryId,
          },
        })
      );
    }
  }

  createEditDiscount(type: string, editData: any) {
    this.dialog
      .open(CreateDiscountComponent, {
        // width: '55%',
        data: {
          skip: this.globalSkip,
          take: this.globalTake,
          type,
          editData,
          countryId: parseInt(this.route.snapshot.paramMap.get('id') || ''),
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.manageDiscountList();
      });
  }

  deleteRecord() {
    this.store.dispatch(
      DiscountActions.DeleteDiscount({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
          skip: this.globalSkip,
          take: this.globalTake,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog
      .open(DeleteModalComponent, {
        data: {
          entityName: 'Discount',
          action: () => {
            this.deleteRecord();
          },
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.manageDiscountList();
      });
  }

  ngOnDestroy(): void {
    if (this.getAllPaymentPlansSub) {
      this.getAllPaymentPlansSub.unsubscribe();
    }
  }
}
