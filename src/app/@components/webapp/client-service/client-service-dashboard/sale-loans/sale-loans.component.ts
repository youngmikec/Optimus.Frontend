import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { RequestLoanComponent } from './request-loan/request-loan.component';
// import { EditLoanRequestComponent } from './edit-loan-request/edit-loan-request.component';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as SaleServiceSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as QuoteLoanActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RepayLoanComponent } from './repay-loan/repay-loan.component';
// import { SalesLoanService } from 'src/app/@core/services/sales-loan.service';
import { ILoan } from 'src/app/@core/models/quote-calculator.model';
import { ILoanStatistics } from 'src/app/@core/models/sales';
// import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { FinancialStatementDialogComponent } from '../../../quote-calculator/new-quote/financial-statement-dialog/financial-statement-dialog.component';
import { slideInOutFromRight } from 'src/app/@core/animations/animation';

export type ILoanActions = 'paymentPlan' | 'viewCreatedPlan' | null;

export interface TableData {
  loanId: string;
  loanAmount: string;
  balanceAmount: string;
  message: string;
  createdDate: string;
  createdBy: string;
}

@Component({
  selector: 'app-sale-loans',
  templateUrl: './sale-loans.component.html',
  styleUrls: ['./sale-loans.component.scss'],
  animations: [slideInOutFromRight],
})
export class SaleLoansComponent implements OnInit {
  showEmptyState = false;

  globalSkip = DefaultPagination.skip;
  globalTake = DefaultPagination.take;

  displayedColumns: string[] = [
    'loanId',
    'loanAmount',
    'balanceAmount',
    'createdDate',
    'createdBy',
    'status',
    'actions',
  ];

  applicationQuoteId: number = parseInt(
    this.activatedRoute.snapshot.queryParamMap.get('quoteId')!
  );
  applicationId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicationId')!
  );
  applicantId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicantId')!
  );
  applicantName: string =
    this.activatedRoute.snapshot.paramMap.get('applicantName')!;

  selectedLoan: ILoan | null = null;
  loanActions: ILoanActions = null;

  dataSource!: MatTableDataSource<any>;
  invoiceId!: number;
  totalCount!: number;
  isLoading$!: Observable<boolean>;
  viewDocumentMode: boolean = false;

  selectedApplicationQuote: any = {};
  selectedContry!: any;
  protected unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  subscription = new Subscription();

  paymentsSchedulePlan$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(QuoteSelectors.PaymentsPlanSchedule)
  );

  loanStatistics?: ILoanStatistics;

  constructor(
    private dialog: MatDialog,
    // private snackBar: MatSnackBar,
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute // private saleLoanService: SalesLoanService,
  ) {}

  ngOnInit(): void {
    this.getInvoiceIdByQuoteId();
    this.getApplicationQuoteById();
    this.ListenToGetInvoiceByQuoteId();
    this.isLoading$ = this.store.pipe(
      select(SaleServiceSelectors.getLoadingState)
    );
  }

  getAllLoans(skip: number = this.globalSkip, take: number = this.globalTake) {
    this.store.dispatch(SaleServiceActions.IsLoading({ payload: true }));
    this.store.dispatch(
      SaleServiceActions.GetSaleLoans({
        payload: {
          applicationId: this.applicationId,
          applicantId: this.applicantId,
          skip: skip,
          take: take,
          startDate: null,
          endDate: null,
        },
      })
    );
  }

  getInvoiceIdByQuoteId() {
    if (!this.applicationQuoteId) return;
    this.store.dispatch(SaleServiceActions.IsLoading({ payload: true }));
    this.store.dispatch(
      SaleServiceActions.GetInvoiceIdByQuoteId({
        applicationQuoteId: this.applicationQuoteId,
      })
    );
  }

  ListenToGetInvoiceByQuoteId(): void {
    this.store
      .pipe(select(SaleServiceSelectors.getInvoiceIdByQuoteId))
      .subscribe((resData: number) => {
        this.invoiceId = resData;
        if (resData) {
          this.getSalesLoanByApplicationQuoteId();
          this.getSalesLoanStatistics();
          this.ListenToGetSalesLoanByApplicationQuoteId();
          this.store.dispatch(SaleServiceActions.IsLoading({ payload: false }));
        }
      });
  }

  /**
   * Retrieves the payment schedule for a given loan ID and dispatches the action to the store.
   * Subscribes to the PaymentsPlanSchedule selector and logs the result to the console.
   *
   * @param {number} loanId - The ID of the loan to retrieve the payment schedule for.
   * @return {void} This function does not return anything.
   */
  getPaymentsScheduleByLoanId(loanId: number): void {
    this.store.dispatch(
      QuoteLoanActions.getPaymentsSchedule({
        payload: {
          invoiceLoanId: loanId,
          userId: '',
        },
      })
    );
  }

  /**
   * Retrieves the sales loan statistics for the current invoice.
   * If there is no invoice ID, the function returns early.
   * Dispatches the GetSaleLoanStatisticsByInvoiceId action to the store.
   * Subscribes to the getSalesLoanStatistics selector and assigns the result to the loanStatistics property.
   * Logs the loanStatistics to the console.
   *
   * @return {void}
   */
  getSalesLoanStatistics() {
    if (!this.invoiceId) return;
    this.store.dispatch(
      SaleServiceActions.GetSaleLoanStatisticsByInvoiceId({
        payload: {
          applicationQuoteId: this.applicationQuoteId,
        },
      })
    );

    this.store
      .pipe(select(SaleServiceSelectors.getSalesLoanStatistics))
      .subscribe((resData: any) => {
        this.loanStatistics = resData;
      });
  }

  // get loans by invoice Id
  getSalesLoanByApplicationQuoteId() {
    if (!this.invoiceId || this.invoiceId === 0) return;
    this.store.dispatch(SaleServiceActions.IsLoading({ payload: true }));
    this.store.dispatch(
      SaleServiceActions.GetSaleLoanByApplicationQuoteId({
        payload: {
          applicationQuoteId: this.applicationQuoteId,
        },
      })
    );
  }

  ListenToGetSalesLoanByApplicationQuoteId() {
    this.store
      .pipe(select(SaleServiceSelectors.getSaleLoansByApplicationQuoteId))
      .subscribe((resData: any) => {
        if (resData) {
          this.showEmptyState = false;
          this.store.dispatch(SaleServiceActions.IsLoading({ payload: false }));
          this.dataSource = new MatTableDataSource(resData.pageItems);
          this.totalCount = resData.pageCount;
          if (resData.pageItems.length > 0) {
            this.getPaymentsScheduleByLoanId(resData.pageItems[0].id);
          }
        } else {
          this.showEmptyState = true;
        }
      });
  }

  /**
   * Retrieves the application quote by ID and sets the selected application quote.
   * Dispatches actions to load and get the application quote details.
   *
   * @return {void} No return value
   */
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
          this.getCountryById(res?.application?.migrationRoute?.countryId);
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

  toggleAction(action: ILoanActions, invoiceLoan?: ILoan) {
    if (this.loanActions === action || !invoiceLoan) {
      this.loanActions = null;
      return;
    }
    this.selectedLoan = invoiceLoan;
    // // fetch payments schedule for the side modal;

    if (action === 'paymentPlan') {
      this.store.dispatch(
        QuoteLoanActions.getPaymentsSchedule({
          payload: { invoiceLoanId: this.selectedLoan.id, userId: '' },
        })
      );
    }

    if (action === 'viewCreatedPlan') {
      this.store.dispatch(
        QuoteLoanActions.getPaymentsSchedule({
          payload: { invoiceLoanId: this.selectedLoan.id, userId: '' },
        })
      );
    }
    this.loanActions = action;
  }

  selectLoan(paymentSchedule: any, loan: ILoan): void {
    const dialogRef = this.dialog.open(RepayLoanComponent, {
      data: {
        paymentSchedule,
        loan,
      },
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      // this.getLoans();
    });
  }

  viewFinancialDocument(loan: ILoan) {
    this.viewDocumentMode = true;
    const viewedquoteDocumentData = {
      fileName: 'Financial Statement receipt',
      applicantId: this.applicantId,
      applicationQuoteId: this.applicationQuoteId,
      selectedApplicationQuote: this.selectedApplicationQuote,
      invoiceLoanId: loan.id,
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

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;
    this.getAllLoans();
  }

  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  // }
}
