import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as currencySelectors from 'src/app/@core/stores/currency/currency.selectors';
import { MatDialog } from '@angular/material/dialog';
import { CreateCurrencyConversionComponent } from '../create-currency-conversion/create-currency-conversion.component';
import * as moment from 'moment';
import { DeleteModalComponent } from 'src/app/@core/shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss'],
})
export class CurrencyListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'currencyPair',
    'currentRate',
    'daysRunning',
    'createdDate',
    'createdBy',
    'lastModifiedOn',
    'lastModifiedBy',
    'statusDesc',
    'actions',
  ];

  dataSource: MatTableDataSource<any[]> | null = null;
  selection = new SelectionModel<any>(true, []);
  totalRecords!: number;
  getAllCurrencySub!: Subscription;
  daysRunning: any;
  recordToDelete!: any;

  @Input() searchValue: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // this.onTabChange({ tab: { textLabel: 'ExchangeRates' } } as MatTabChangeEvent);

    this.manageAllExchangeRates();
  }

  ngOnChanges(): void {
    // setTimeout(() => {
    //   this.dataSource!.paginator = this.paginator;
    //   this.dataSource!.sort = this.sort;
    // });

    if (this.searchValue) {
      this.search(this.searchValue);
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

  getAllExchangeRates() {
    this.store.dispatch(CurrencyActions.GetAllExchangeRates());
  }

  manageAllExchangeRates() {
    this.getAllExchangeRates();

    this.getAllCurrencySub = this.store
      .pipe(select(currencySelectors.getAllExchangeRates))
      .subscribe((resData: any) => {
        //console.log(resData, 'dfghj');
        // this.daysRunning = moment(resData.lastModifiedDate).fromNow();
        // console.log(this.daysRunning, 'running');
        if (resData) {
          const modifiedExchangeRates: any[] = [];

          resData?.forEach((currency: any) => {
            const modifiedCurrency = {
              ...currency,
              createdDate: new Date(currency.createdDate).getTime(),
              lastModifiedDate: new Date(currency.lastModifiedDate).getTime(),
              daysRunning:
                Math.abs(
                  moment(currency.lastModifiedDate)
                    .startOf('day')
                    .diff(moment().startOf('day'), 'days')
                ) + ' days ago',
            };

            modifiedExchangeRates.push(modifiedCurrency);
          });

          const sortedExchangeRates = modifiedExchangeRates
            .slice()
            .sort((a, b) => {
              const dateA = new Date(a.createdDate).getTime();
              const dateB = new Date(b.createdDate).getTime();

              return dateB - dateA; //Descending order
            });

          this.dataSource = new MatTableDataSource(sortedExchangeRates);

          setTimeout(() => {
            // this.dataSource!.paginator = this.paginator;
            this.dataSource!.sort = this.sort;

            this.totalRecords = resData?.count!;
          });
        }
      });
  }

  // onCreateCurrency() {
  //   this.dialog.open(CreateCurrencyComponent, {
  //     data: {
  //       instance: 'create',
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }

  // onEditCurrency(currency: any) {
  //   this.dialog.open(CreateCurrencyComponent, {
  //     data: {
  //       instance: 'update',
  //       currencyName: currency?.name,
  //       currencyId: currency?.id,
  //       currencyCode: currency?.currencyCode,
  //       isDefault: currency?.isDefault,
  //     },
  //     disableClose: true,
  //     autoFocus: true,
  //     panelClass: 'opt-dialog',
  //     backdropClass: 'opt-dialog-backdrop',
  //   });
  // }
  onEditCurrencyConversion(currencyConvert: any) {
    this.dialog.open(CreateCurrencyConversionComponent, {
      data: {
        instance: 'update',
        exchangeRate: currencyConvert,
        ...currencyConvert,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    // const skip = pageIndex * pageSize;
    // const take = pageIndex > 0 ? pageIndex * pageSize : pageSize;
    // this.loadUsers(skip, take);
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
        CurrencyActions.DeactivateCurrencyConversion({
          payload: {
            id: row.id,
          },
        })
      );
    } else if (row.status === 2) {
      this.store.dispatch(
        CurrencyActions.ActivateCurrencyConversion({
          payload: {
            id: row.id,
          },
        })
      );
    }
  }

  deleteRecord() {
    this.store.dispatch(
      CurrencyActions.DeleteExchangeRate({
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
        entityName: 'Exchange Rate',
        action: () => {
          this.deleteRecord();
        },
      },
    });
  }
}
