import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InvoiceViewDialogComponent } from 'src/app/@components/webapp/invoice/invoice-view-dialog/invoice-view-dialog.component';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import {
  // InvoiceTableInterface,
  // IINVOICE_LIST,
  InvoiceDataInterface,
} from 'src/app/@core/models/invoice';
import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as EnumTypes from 'src/app/@core/enums/index.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paid-invoices',
  templateUrl: './paid-invoices.component.html',
  styleUrls: ['./paid-invoices.component.scss'],
})
export class PaidInvoicesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'invoiceNumber',
    'applicantName',
    'phoneNumber',
    'amount',
    'createdDate',
    'createdBy',
    'status',
  ];

  dataSource = new MatTableDataSource<InvoiceDataInterface>([]);
  selection = new SelectionModel<InvoiceDataInterface>(true, []);
  // dataSource = new MatTableDataSource<InvoiceTableInterface>([]);
  // selection = new SelectionModel<InvoiceTableInterface>(true, []);
  getPaidInvoicesSub!: Subscription;
  totalRecords!: number;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  private applicationQuoteId: number = parseInt(
    this.route.snapshot.queryParamMap.get('quoteId')!
  );

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.manageInvoiceList();
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageSize;
    this.getAllInvoices(skip, take);
  }

  getAllInvoices(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      InvoicesActions.getAllPaidApplicantionInvoices({
        payload: {
          skip,
          take,
          applicationQuoteId: this.applicationQuoteId,
          paymentStatus: EnumTypes.PaymentStatus.Paid,
        },
      })
    );
  }

  manageInvoiceList() {
    this.getAllInvoices();

    this.getPaidInvoicesSub = this.store
      .pipe(select(InvoicesSelector.applicationPaidinvoiceSuccessSelector))
      .subscribe({
        next: (data) => {
          if (data) {
            // const tableData = data.entity.pageItems.map(
            //   (item: IINVOICE_LIST) => ({
            //     id: item.id,
            //     invoiceNumber: item.invoiceNo,
            //     applicantName: item.name,
            //     phoneNumber: 'Nill',
            //     amount: item.amount,
            //     createdDate: item.createdDate,
            //     createdBy: item.createdBy,
            //     lastModifiedDate: item.lastModifiedDate,
            //     lastModifiedBy: item.lastModifiedBy,
            //     status: item.status,
            //     paymentStatus: item.paymentStatus,
            //     paymentStatusDesc: item.paymentStatusDesc,
            //   })
            // );
            const tableData: InvoiceDataInterface[] = data.entity.data;
            this.dataSource = new MatTableDataSource<InvoiceDataInterface>(
              tableData
            );
            this.totalRecords = data.entity.totalCount;
          }
        },
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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

  openInvoiceDialog() {
    this.dialog.open(InvoiceViewDialogComponent, {
      width: '70%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
    });
  }

  ngOnDestroy(): void {
    this.getPaidInvoicesSub.unsubscribe();
  }
}
