import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { CreateNewInvoiceItemComponent } from './create-new-invoice-item/create-new-invoice-item.component';
import { IFilterInvoiceConfig } from 'src/app/@core/models/invoice';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-invoice-item-config',
  templateUrl: './invoice-item-config.component.html',
  styleUrls: ['./invoice-item-config.component.scss'],
})
export class InvoiceItemConfigComponent implements OnInit, OnDestroy {
  department!: string[];
  filterResult: IFilterInvoiceConfig[] = [
    { name: 'all', column: 'All', selected: false },
    { name: 'active', column: 'Active', selected: false },
    { name: 'inactive', column: 'Inactive', selected: false },
  ];
  displayedColumns: string[] = [
    'country',
    'migrationRoute',
    // 'isAllMigration',
    'countryPercent',
    'localPercent',
    'localFee',
    'createdDate',
    'createdByEmail',
    'lastModifiedDate',
    'lastModifiedByEmail',
    // 'statusDesc',
    'actions',
  ];
  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  getAllInvoiceItemSub!: Subscription;
  permissions: boolean[] = [];
  skip: number = DefaultPagination.skip;
  take: number = DefaultPagination.take;
  filterType: string = 'all';
  recordToDelete: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild('filter') filterMenu!: MatMenu;
  @ViewChild(MatMenuTrigger) filterTrigger!: MatMenuTrigger;
  invoiceItemList!: any[];

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState> // private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.manageAllInvoiceItems();
  }

  getAllInvoiceItems(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take,
    filter = 'all'
  ) {
    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItems({
        payload: { skip, take },
      })
    );
  }

  manageAllInvoiceItems() {
    this.getAllInvoiceItems();

    this.getAllInvoiceItemSub = this.store
      .pipe(select(invoiceItemCongurationSelectors.getAllInvoiceItems))
      .subscribe((resData: any) => {
        const modifiedInvoiceItem: any[] = [];
        if (resData) {
          this.invoiceItemList = [];
          this.invoiceItemList = resData.pageItems;
          resData.pageItems.forEach((invoiceItem: any) => {
            const modified = {
              ...invoiceItem,
              createdDate: new Date(invoiceItem.createdDate).getTime(),
              lastModifiedDate: new Date(
                invoiceItem.lastModifiedDate
              ).getTime(),
            };

            modifiedInvoiceItem.push(modified);
          });
        }

        const sortedInvoiceItem = modifiedInvoiceItem.slice().sort((a, b) => {
          const dateA = new Date(a.createdDate).getTime();
          const dateB = new Date(b.createdDate).getTime();

          return dateB - dateA; //Descending order
        });

        this.dataSource = new MatTableDataSource(sortedInvoiceItem ?? []);

        setTimeout(() => {
          // this.dataSource!.paginator = this.paginator;
          this.dataSource!.sort = this.sort;

          this.totalRecords = resData?.totalCount;
        });
      });
  }

  clearFilterSelection() {
    this.filterResult = this.filterResult.map((el) => {
      return {
        ...el,
        selected: false,
      };
    });
    this.filterType = 'all';
    // this.onClickFilterOption();
  }

  closeFilterMenu() {
    if (this.filterMenu) {
      this.filterTrigger.closeMenu();
    }
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource!.filter = filterValue.trim().toLowerCase();

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.skip = pageIndex * pageSize;
    this.take = pageSize;

    this.getAllInvoiceItems(this.skip, this.take);
    // this.getAllInvoiceItems(this.skip, this.take, this.filterType);
  }

  onCreateEditInvoiceItem(
    instance: 'create' | 'update',
    invoiceItemData?: any
  ) {
    this.dialog.open(CreateNewInvoiceItemComponent, {
      data: {
        instance: instance,
        invoiceItem: invoiceItemData,
        invoiceItemList: this.invoiceItemList,
        skip: this.skip,
        take: this.take,
      },
      // width: '500px',
      disableClose: true,
      autoFocus: true,
      // panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onChangeInvoiceItemStatus(id: number, status: number) {
    if (status === 2) {
      this.store.dispatch(
        InvoiceItemConfigurationActions.ActivateInvoiceItemStatus({
          payload: { id, skip: this.skip, take: this.take },
        })
      );
      return;
    }

    this.store.dispatch(
      InvoiceItemConfigurationActions.DeactivateInvoiceItemStatus({
        payload: { id, skip: this.skip, take: this.take },
      })
    );
  }

  filterByStatus(item: IFilterInvoiceConfig): void {
    this.closeFilterMenu();

    this.filterResult = this.filterResult.map((data: IFilterInvoiceConfig) =>
      data.column !== item.column ? { ...data, selected: false } : data
    );
    this.skip = DefaultPagination.skip;
    this.take = DefaultPagination.take;

    InvoiceItemConfigurationActions.GetInvoiceItems({
      payload: { skip: this.skip, take: this.take, filter: item.name },
    });
  }

  deleteRecord() {
    this.store.dispatch(
      InvoiceItemConfigurationActions.DeleteInvioiceItemConfig({
        payload: {
          id: this.recordToDelete ? this.recordToDelete.id : 0,
          skip: this.skip,
          take: this.take,
        },
      })
    );
  }

  openDeleteModal(record: any): void {
    if (!record) return;
    this.recordToDelete = record;
    this.dialog.open(DeleteModalComponent, {
      data: {
        entityName: 'Invoice Item Configuration',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.getAllInvoiceItemSub) {
      this.getAllInvoiceItemSub.unsubscribe();
    }
  }
}
