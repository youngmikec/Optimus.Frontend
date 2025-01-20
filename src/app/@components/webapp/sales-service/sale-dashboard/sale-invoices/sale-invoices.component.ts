import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription, shareReplay } from 'rxjs';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { InvoiceInterface } from 'src/app/@core/stores/invoices/invoices.actionTypes';
import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MarkAsPaidModalComponent } from 'src/app/@core/shared/mark-as-paid-modal/mark-as-paid-modal.component';
import { ViewDocumentModalComponent } from 'src/app/@core/shared/view-document-modal/view-document-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-invoices',
  templateUrl: './sale-invoices.component.html',
  styleUrls: ['./sale-invoices.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SaleInvoicesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'invoice_id',
    'base_amount',
    'prefered_amount',
    'amount_paid',
    'status',
    'actions',
  ];

  private applicationQuoteId: number = parseInt(
    this.route.snapshot.queryParamMap.get('quoteId')!
  );

  dataSource: MatTableDataSource<InvoiceInterface[]> | null = null;
  invoicePaymentList!: InvoiceInterface[];
  getSub: Subscription = new Subscription();

  public expandedElement!: InvoiceInterface | null;

  public statistics$ = this.store
    .select(InvoicesSelector.invoiceStatisticsSuccessSelector)
    .pipe(shareReplay());

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getInvoiceStatistics();
    this.manageInvoiceByApplicationQuoteId();
  }

  getInvoiceStatistics() {
    this.store.dispatch(
      InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId({
        payload: {
          applicationQuoteId: this.applicationQuoteId,
        },
      })
    );
  }

  getInvoiceByApplicationQuoteId() {
    this.store.dispatch(
      InvoicesActions.GetInvoiceByApplicationQuoteId({
        payload: {
          id: this.applicationQuoteId,
          skip: DefaultPagination.skip,
          take: DefaultPagination.take,
        },
      })
    );
  }

  manageInvoiceByApplicationQuoteId() {
    this.getInvoiceByApplicationQuoteId();

    this.getSub.add(
      this.store
        .pipe(select(InvoicesSelector.getInvoiceByApplicationQuoteIdData))
        .subscribe({
          next: (resData: any) => {
            if (resData) {
              this.invoicePaymentList = resData?.pageItems;
              const modifiedCountryList: any[] = [];

              resData?.pageItems?.forEach((data: any) => {
                const modifiedConutry = {
                  ...data,
                  createdDate: new Date(data.createdDate).getTime(),
                  lastModifiedDate: new Date(data.lastModifiedDate).getTime(),
                };

                modifiedCountryList.push(modifiedConutry);
              });

              const sortedRoles = modifiedCountryList.slice().sort((a, b) => {
                const dateA = new Date(a.createdDate).getTime();
                const dateB = new Date(b.createdDate).getTime();

                return dateB - dateA; //Descending order
              });

              this.dataSource = new MatTableDataSource(sortedRoles);
            }
          },
        })
    );
  }

  openMarkAsPaidModal(invoice: any) {
    this.dialog.open(MarkAsPaidModalComponent, {
      data: {
        invoice,
        component: 'invoice',
      },
      disableClose: true,
    });
  }

  confirmPayment(invoicePaymentDetailId: number) {
    // if (this.markAsPaidForm.invalid) return;

    this.store.dispatch(
      InvoicesActions.updateMarkAsPaid({
        invoicePaymentDetailId: invoicePaymentDetailId
          ? invoicePaymentDetailId
          : 0,
        paymentStatus: 2,
        applicationQuoteId: this.applicationQuoteId,
      })
    );
  }

  viewDocument(documentUrl: string, modalName: string) {
    this.dialog.open(ViewDocumentModalComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        url: documentUrl,
        name: modalName,
      },
    });
  }

  ngOnDestroy() {
    this.getSub.unsubscribe();
  }
}
