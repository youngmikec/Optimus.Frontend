import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  // HostListener
} from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceViewDialogComponent } from '../invoice-view-dialog/invoice-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Store, select } from '@ngrx/store';

import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { Observable, Subscription } from 'rxjs';
import {
  // IINVOICE_LIST,
  InvoiceDataInterface,
  // InvoiceTableInterface,
} from 'src/app/@core/models/invoice';
import { isInvoiceLoadingSelector } from 'src/app/@core/stores/invoices/invoices.selectors';

@Component({
  selector: 'app-all-invoice',
  templateUrl: './all-invoice.component.html',
  styleUrls: ['./all-invoice.component.scss'],
})
export class AllInvoiceComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('resizableElement', { static: true })
  resizableElement!: ElementRef;
  displayedColumns: string[] = [
    'invoiceNumber',
    'applicantName',
    'countryProgram',
    'programFee',
    'minimumPayment',
    'invoicedAmount',

    // 'phoneNumber',
    // 'amount',
    // 'amountPaid',
    'totalPaid',
    'createdDate',
    'status',
    'createdBy',
  ];

  // private currentColumn: string = '';
  private startX: number = 0;
  private startWidth: number = 0;
  private isResizing: boolean = false;

  globalSkip!: number;
  globalTake!: number;
  pageSize = DefaultPagination.take;

  // dataSource!: MatTableDataSource<InvoiceTableInterface>;
  dataSource!: MatTableDataSource<InvoiceDataInterface>;

  totalRecords!: number;
  getAllInvoicesSub!: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @Input() search!: string;

  public isInvoiceLoadingSelector$: Observable<any> = this.store.select(
    isInvoiceLoadingSelector
  );

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { firstChange, currentValue } = changes['search'];
    if (!firstChange) this.searchInvoices(currentValue);
  }

  ngOnInit(): void {
    this.manageInvoiceList();
  }

  // ResizeColumn funtion
  onResizeColumn(event: MouseEvent, column: string) {
    // this.currentColumn = column;
    this.startX = event.pageX;
    this.isResizing = true;
    const headerCell = (event.target as HTMLElement).closest('th');
    this.startWidth = headerCell?.offsetWidth || 0;

    // Listen for mouse movement and mouse up
    if (headerCell) {
      headerCell.addEventListener('mousemove', this.onMouseMove);
      headerCell.addEventListener('mouseup', this.onMouseUp);
    }

    const cells = document.querySelectorAll(`td.mat-column-resizable`);
    cells.forEach((cell) => {
      (cell as HTMLElement).style.width = `${this.startX}px`;
    });
  }

  onMouseUp(event: MouseEvent) {
    // Remove mouse event listeners
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const deltaX = event.pageX - this.startX;
    const newWidth = this.startWidth + deltaX;

    // Set the width of the column
    const headerCell = (event.target as HTMLElement).closest('th');
    if (headerCell) {
      headerCell.style.minWidth = `${newWidth}px`;
    }
  };

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;
    this.pageSize = pageSize;
    this.getAllInvoices(this.globalSkip, this.globalTake);
  }

  getAllInvoices(skip = DefaultPagination.skip, take = DefaultPagination.take) {
    this.store.dispatch(
      InvoicesActions.getAllInvoices({ payload: { skip, take } })
    );
  }

  manageInvoiceList() {
    this.getAllInvoices();

    this.getAllInvoicesSub = this.store
      .pipe(select(InvoicesSelector.invoiceSuccessSelector))
      .subscribe({
        next: (data) => {
          if (data) {
            // const tableData = data.entity.pageItems.map(
            //   (item: IINVOICE_LIST) => ({
            //     ...item,
            //     id: item.id,
            //     invoiceNumber: item.invoiceNo,
            //     applicantName: item.name,
            //     phoneNumber: '-',
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

  searchInvoices(searchWord: string) {
    this.store.dispatch(
      InvoicesActions.searchAllInvoices({
        payload: {
          skip: DefaultPagination.skip,
          take: DefaultPagination.take,
          searchWord,
        },
      })
    );
  }

  openInvoiceDialog(invoice: any) {
    this.dialog.open(InvoiceViewDialogComponent, {
      width: '70%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        invoice,
      },
    });
  }

  navigateToInvoice(invoice: any) {
    if (!invoice) return;
    this.router.navigate([`/app/invoice/view/${invoice?.applicationQuoteId}`]);
  }

  ngOnDestroy(): void {
    this.getAllInvoicesSub.unsubscribe();
  }
}
