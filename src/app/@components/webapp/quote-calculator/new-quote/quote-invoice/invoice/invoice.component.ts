import {
  Component,
  OnDestroy,
  OnInit,
  HostListener,
  ViewChild,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MarkAsPaidModalComponent } from 'src/app/@core/shared/mark-as-paid-modal/mark-as-paid-modal.component';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import {
  InvoiceInterface,
  NewInvoiceStatisticsInterface,
} from 'src/app/@core/stores/invoices/invoices.actionTypes';
import * as InvoiceActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoiceSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import * as QuoteCalculatorActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as QuoteCalculatorSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import { MatDialog } from '@angular/material/dialog';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { ViewDocumentModalComponent } from 'src/app/@core/shared/view-document-modal/view-document-modal.component';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { InvoiceReceiptDialogComponent } from './invoice-receipt-dialog/invoice-receipt-dialog.component';
import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { FinancialStatementDialogComponent } from '../../financial-statement-dialog/financial-statement-dialog.component';
import { IExchangeRate } from 'src/app/@core/interfaces/exchange-rate.interface';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
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
export class InvoiceComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  displayedColumns: string[] = [
    'invoice_id',
    'applicant_name',
    'invoice_program_fee_amount',
    'invoice_local_fee_amount',
    'program_fee_paid',
    'local_fee_paid',
    'ngn_equivalent_amount',
    'sum',
    'program_fee_pending',
    'local_fee_pending',
    'status',
    'actions',
  ];
  applicationQuoteId = parseInt(
    this.route.snapshot.paramMap.get('applicationId') || ''
  );
  dataSource: MatTableDataSource<InvoiceInterface[]> | null = null;
  invoicePaymentList!: InvoiceInterface[];
  invoiceStatistics!: NewInvoiceStatisticsInterface | null;
  selectedApplicationQuote!: IApplicationQuote;
  selectedContry!: any;
  getSub!: Subscription;
  activeExchangeRateList: IExchangeRate[] = [];

  isLoading!: Observable<boolean>;
  isLoading2!: Observable<boolean>;

  private currentColumn: string = '';
  private startX: number = 0;
  private startWidth: number = 0;

  expandedElement!: InvoiceInterface | null;
  financialStateDocUrl: string | null = null;
  invoiceLoanId!: number;
  loading$!: Observable<boolean>;

  protected unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog,
    public permissionService: PermissionService
  ) {
    this.isLoading = this.store.pipe(
      select(InvoiceSelector.isInvoiceCreatingSelector)
    );
    this.isLoading2 = this.store.pipe(
      select(InvoiceSelector.isInvoiceLoadingSelector)
    );
  }

  ngOnInit() {
    if (!this.applicationQuoteId) return;
    this.loading$ = this.store.pipe(
      select(QuoteCalculatorSelectors.getQuoteCalculatorIsLoading)
    );
    this.manageInvoiceByApplicationQuoteId();
    this.getApplicationQuoteById();

    this.getInvoiceStatisticsByApplicationQuoteId();
    this.getActiveExchangeRates();
  }

  // ResizeColumn funtion
  onResizeColumn(event: MouseEvent, column: string) {
    this.currentColumn = column;
    this.startX = event.pageX;
    const headerCell = (event.target as HTMLElement).closest('th');
    this.startWidth = headerCell?.offsetWidth || 0;

    // Listen for mouse movement and mouse up
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    // Remove mouse event listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.currentColumn = '';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (event: MouseEvent) => {
    if (!this.currentColumn) return;

    const deltaX = event.pageX - this.startX;
    const newWidth = this.startWidth + deltaX;

    // Set the width of the column
    const headerCell = document.querySelector(
      `th.mat-column-${this.currentColumn}`
    ) as HTMLElement;
    if (headerCell) {
      headerCell.style.width = `${newWidth}px`;
    }

    // Optionally, set the width of all cells in this column
    const cells = document.querySelectorAll(
      `td.mat-column-${this.currentColumn}`
    );
    cells.forEach((cell) => {
      (cell as HTMLElement).style.width = `${newWidth}px`;
    });
  };

  goToCreateInvoice() {
    let applicationQuoteId!: number;
    if (this.route.snapshot.paramMap.get('applicationId')) {
      applicationQuoteId = parseInt(
        this.route.snapshot.paramMap.get('applicationId') || ''
      );
      this.router.navigate([
        `/app/calculator/quote/quote-invoice/${applicationQuoteId}/create`,
      ]);
    }
  }

  getActiveExchangeRates() {
    this.store.dispatch(CurrencyActions.GetActiveExchangeRates());
    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(CurrencySelector.getActiveExchangeRates)
      )
      .subscribe((resData: any) => {
        if (resData) {
          this.activeExchangeRateList = resData;
        }
      });
  }

  getInvoiceByApplicationQuoteId() {
    this.store.dispatch(
      InvoiceActions.GetInvoiceByApplicationQuoteId({
        payload: {
          id: this.applicationQuoteId,
          skip: 0,
          take: 10,
        },
      })
    );
  }

  manageInvoiceByApplicationQuoteId() {
    this.getInvoiceByApplicationQuoteId();

    this.getSub = this.store
      .pipe(select(InvoiceSelector.getInvoiceByApplicationQuoteIdData))
      .subscribe((resData: any) => {
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
      });
  }

  getInvoiceStatisticsByApplicationQuoteId() {
    this.store.dispatch(
      InvoiceActions.GetInvoiceStatisticsByApplicationQuoteId({
        payload: {
          applicationQuoteId: this.applicationQuoteId,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(InvoiceSelector.getInvoiceStatisticsByApplicationQuoteIdData)
      )
      .subscribe((resData: any) => {
        if (resData) {
          this.invoiceStatistics = resData;
        }
      });
  }

  openMarkAsPaidModal(invoice: any) {
    this.dialog.open(MarkAsPaidModalComponent, {
      width: '55%',
      height: '80vh',
      data: {
        invoice,
        component: 'invoice',
        programType: this.selectedContry.programType,
        exchangeRateList: this.activeExchangeRateList,
        invoiceStatistics: this.invoiceStatistics,
      },
      disableClose: true,
    });
  }

  viewPaymentReceipt(item: any) {
    this.dialog.open(InvoiceReceiptDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        quoteData: this.selectedApplicationQuote,
        item,
        applicant: this.selectedApplicationQuote.application.applicant,
      },
      disableClose: false,
    });
  }

  confirmPayment(invoicePaymentDetailId: number) {
    // if (this.markAsPaidForm.invalid) return;
    const payload = {
      invoicePaymentDetailId: invoicePaymentDetailId
        ? invoicePaymentDetailId
        : 0,
      paymentStatus: 2,
      applicationQuoteId: this.applicationQuoteId,
    };
    this.store.dispatch(InvoiceActions.updateMarkAsPaid(payload));
  }

  generateFinancialStatementPdf(quote: IApplicationQuote): void {
    if (!quote) return;
    let payload: any;
    if (this.invoiceLoanId) {
      payload = {
        applicationQuoteId: quote.id,
        invoiceLoanId: this.invoiceLoanId,
      };
    } else {
      payload = { applicationQuoteId: quote.id };
    }

    this.store.dispatch(
      QuoteCalculatorActions.GenerateFinancialStatement(payload)
    );

    this.store
      .pipe(select(QuoteCalculatorSelectors.GetFinancialStatement))
      .subscribe((res) => {
        if (res) {
          this.financialStateDocUrl = res;
          if (this.financialStateDocUrl !== '') {
            this.menuTrigger.closeMenu();
            this.viewFinancialDocument(quote);
          }
        }
      });
  }

  viewFinancialDocument(quote: IApplicationQuote) {
    const viewedquoteDocumentData = {
      fileName: 'Financial Statement receipt',
      applicantId: quote.application.applicantId,
      applicationQuoteId: quote.id,
      selectedApplicationQuote: quote,
      financialStateDocUrl: this.financialStateDocUrl,
    };

    this.dialog.open(FinancialStatementDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: viewedquoteDocumentData,
      disableClose: false,
    });
  }

  getApplicationQuoteById() {
    if (!this.applicationQuoteId) return;

    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.applicationQuoteId,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(ApplicationQuotesSelector.getApplicationQuoteById)
      )
      .subscribe((res: any) => {
        if (res !== null) {
          this.getCountryById(
            res.application?.migrationRoute?.countryId ?? undefined
          );
          this.selectedApplicationQuote = res;
        }
      });
  }

  getCountryById(countryId?: number) {
    if (!countryId) return;
    this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: countryId,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(CountriesSelector.getCountryById)
      )
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedContry = res;
        }
      });
  }

  viewDocument(item: any, modalName: string, type: 'invoice' | 'payment') {
    const documentUrl: string =
      type === 'invoice' ? item?.invoiceQuotePDFURL : item.paymentReceiptUrl;
    this.dialog.open(ViewDocumentModalComponent, {
      width: '65%',
      height: '100vh',
      disableClose: false,
      position: {
        right: '0',
        top: '0',
      },
      data: {
        entity: item,
        documentType: type,
        url: documentUrl,
        name: modalName,
        applicationQuote: this.selectedApplicationQuote,
        applicant: this.selectedApplicationQuote?.application?.applicant,
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
  }
}
