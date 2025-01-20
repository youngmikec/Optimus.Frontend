import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import * as SaleServiceSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as QuoteServiceSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
// import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { Subject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { slideInOutFromRight } from 'src/app/@core/animations/animation';
import * as QuoteLoanActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import { ILoan } from 'src/app/@core/models/quote-calculator.model';
import { RepayQuoteLoanComponent } from '../repay-quote-loan/repay-quote-loan.component';

type ILoanActions = 'paymentPlan' | 'viewCreatedPlan' | null;
@Component({
  selector: 'app-quote-loan',
  templateUrl: './quote-loan.component.html',
  styleUrls: ['./quote-loan.component.scss'],
  animations: [slideInOutFromRight],
})
export class QuoteLoanComponent implements OnInit, OnDestroy {
  showEmptyState: boolean = true;
  dataSource!: MatTableDataSource<any>;

  loanItem: ILoan | null = null;
  selectedLoan: ILoan | null = null;
  loanActions: ILoanActions = null;
  applicantName: string = '';
  displayedColumns: string[] = [
    'loanId',
    'loanAmount',
    'balanceAmount',
    'createdDate',
    'createdBy',
    'status',
    'actions',
  ];

  applicationId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicationId')!
  );

  invoiceId: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('invoiceId')!
  );

  selectedApplicationQuote: any = {};
  selectedContry!: any;
  protected unsubscribe$ = new Subject<void>();

  paymentsSchedulePlan$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(QuoteSelectors.PaymentsPlanSchedule)
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listenToGetAllLoans();
    // this.getLoans();
    this.getApplicationQuoteById();
  }

  toggleAction(action: ILoanActions, invoiceLoan?: ILoan) {
    if (!invoiceLoan) {
      this.loanActions = null;
      return;
    }
    this.selectedLoan = invoiceLoan;
    this.loanActions = action;
  }

  listenToGetAllLoans() {
    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(QuoteServiceSelectors.QuoteLoans)
      )
      .subscribe((resData) => {
        if (resData) {
          if (resData.pageItems.length === 0) {
            this.showEmptyState = true;
            return;
          }
          this.showEmptyState = false;
          this.applicantName = resData.pageItems[0].applicantName;
          this.loanItem = resData.pageItems[0];
          this.dataSource = new MatTableDataSource(resData.pageItems);

          this.store.dispatch(
            QuoteLoanActions.getPaymentsSchedule({
              payload: {
                invoiceLoanId: resData.pageItems[0].id,
                userId: '',
              },
            })
          );

          // resData.data.pageItems.map((loan) => {
          //   this.totalLoanAmount += loan.amount;
          //   this.totalOutStandingLoanAmount += loan.balanceAmount;
          // });
        }
      });
  }

  getLoans() {
    this.store.dispatch(
      QuoteLoanActions.getLoanRequest({
        payload: {
          applicationQuoteId: this.selectedApplicationQuote.id,
        },
      })
    );
  }

  getApplicationQuoteById() {
    if (!this.applicationId) return;

    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.applicationId,
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
          this.getLoans();
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

  selectLoan(loanData: any): void {
    const dialogRef = this.dialog.open(RepayQuoteLoanComponent, {
      data: loanData,
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getLoans();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
