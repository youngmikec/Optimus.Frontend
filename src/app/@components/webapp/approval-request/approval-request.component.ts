import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuoteActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuoteSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import { QuoteInvoiceDialogComponent } from '../quote-calculator/quote-invoice-dialog/quote-invoice-dialog.component';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import { ViewDocumentModalComponent } from 'src/app/@core/shared/view-document-modal/view-document-modal.component';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.component.html',
  styleUrls: ['./approval-request.component.scss'],
})
export class ApprovalRequestComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'requestId',
    'applicant',
    'feature',
    'dateRequested',
    'requestedBy',
    'status',
    'actions',
  ];

  dataSource: MatTableDataSource<any[]> | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  getAllUserSub!: Subscription;
  totalRecords!: number;
  getApplicationQuoteAuthorizationSub!: Subscription;
  authorizationRequestSummary$!: Observable<any | null>;
  authorizationRequestSummaryLoading$!: Observable<boolean | null>;

  skip!: number;
  take!: number;

  selectedMigrationRouteInvoiceItem!: any | null;
  quoteData!: any | null;

  dialogIsOpen = false;

  protected unsubscribe$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {
    this.authorizationRequestSummary$ = this.store.pipe(
      select(ApplicationQuoteSelector.getApplicationQuoteAuthorizationSummary)
    );
    this.authorizationRequestSummaryLoading$ = this.store.pipe(
      select(
        ApplicationQuoteSelector.getApplicationQuoteAuthorizationSummaryLoading
      )
    );
  }

  ngOnInit(): void {
    this.getApplicationQuoteAuthorizationSummary();
    this.manageApplicationQuoteAuthorizationList();
  }

  getApplicationQuoteAuthorizationSummary() {
    this.store.dispatch(
      ApplicationQuoteActions.GetApplicationQuotesAuthorizationsSummary()
    );
  }

  getApplicationQuoteAuthorizationList(
    skip = DefaultPagination.skip,
    take = DefaultPagination.take
  ) {
    this.store.dispatch(
      ApplicationQuoteActions.GetApplicationQuotesAuthorizations({
        payload: { skip: skip, take: take },
      })
    );
  }

  manageApplicationQuoteAuthorizationList() {
    this.getApplicationQuoteAuthorizationList();

    this.getApplicationQuoteAuthorizationSub = this.store
      .pipe(select(ApplicationQuoteSelector.getApplicationQuoteAuthorization))
      .subscribe((resData: any) => {
        if (resData) {
          const modifiedList: any[] = [];

          resData?.pageItems?.forEach((item: any) => {
            const modifiedItem = {
              ...item,
              createdDate: new Date(item.createdDate).getTime(),
              lastModifiedDate: new Date(item.lastModifiedDate).getTime(),
            };

            modifiedList.push(modifiedItem);
          });

          const sortedList = modifiedList.slice().sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();

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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    const skip = pageIndex * pageSize;
    const take = pageSize;
    this.skip = skip;
    this.take = take;

    this.getApplicationQuoteAuthorizationList(skip, take);
  }

  onApproveRejectRequest(requestId: number, status: 1 | 3) {
    this.store.dispatch(ApplicationQuoteActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuoteActions.ApproveRejectRequest({
        payload: {
          authorizationRequestId: requestId,
          approvalStatus: status,
          skip: this.skip,
          take: this.take,
        },
      })
    );
  }

  viewQuote(quoteId: number) {
    this.getQuoteDataById(quoteId);
  }

  getQuoteDataById(quoteId: number) {
    this.store.dispatch(ApplicationQuoteActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuoteActions.GetApplicationQuoteById({
        payload: {
          id: quoteId,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(ApplicationQuoteSelector.getApplicationQuoteById)
      )
      .subscribe((resData: any) => {
        if (resData) {
          this.quoteData = resData;

          this.getAllInvoiceItems();
        }
      });
  }

  getAllInvoiceItems() {
    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItems({
        payload: { skip: 0, take: 10 },
      })
    );

    this.getApplicationQuoteAuthorizationSub = this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(invoiceItemCongurationSelectors.getAllInvoiceItems)
      )
      .subscribe((resData: any) => {
        if (resData) {
          const newInvoiceConfigArr: any[] = [];

          const invoiceConfigList = resData.pageItems.filter(
            (invoiceItem: any) =>
              invoiceItem?.countryId ===
              this.quoteData?.application?.migrationRoute?.countryId
          );

          invoiceConfigList.forEach((item: any) => {
            if (
              item.migrationRouteId ===
              this.quoteData?.application?.migrationRoute?.id
            ) {
              newInvoiceConfigArr.push(item);
              this.selectedMigrationRouteInvoiceItem = item;
            } else if (item.allMigrationRoute) {
              newInvoiceConfigArr.push(item);
            }
          });

          this.selectedMigrationRouteInvoiceItem = newInvoiceConfigArr[0];

          this.openInvoiceDialog();
        }
      });
  }

  openInvoiceDialog() {
    if (!this.quoteData) return;

    if (this.dialogIsOpen) return;

    this.dialogIsOpen = true;

    const dialogRef = this.dialog.open(QuoteInvoiceDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        quoteData: this.quoteData,
        selectedMigrationRouteInvoiceItem:
          this.selectedMigrationRouteInvoiceItem,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dialogIsOpen = false;

      this.store.dispatch(ApplicationQuoteActions.ClearApplicationQuoteById());

      this.store.dispatch(
        InvoiceItemConfigurationActions.ClearAllInvoiceItems()
      );
    });
  }

  getApprovalDocument(documentUrl: string, modalName: string) {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.getApplicationQuoteAuthorizationSub) {
      this.getApplicationQuoteAuthorizationSub.unsubscribe();
    }
  }
}
