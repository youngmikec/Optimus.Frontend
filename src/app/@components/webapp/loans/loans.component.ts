import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as SaleServiceSelectors from 'src/app/@core/stores/sale-service/sale-service.selectors';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
// import { SalesLoanService } from 'src/app/@core/services/sales-loan.service';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as QuoteLoanActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
// import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';

// import { RequestLoanComponent } from '../sales-service/sale-dashboard/sale-loans/request-loan/request-loan.component';
// import { EditLoanRequestComponent } from '../sales-service/sale-dashboard/sale-loans/edit-loan-request/edit-loan-request.component';
// import { RepayLoanComponent } from '../sales-service/sale-dashboard/sale-loans/repay-loan/repay-loan.component';
// import { ILoanActions } from '../sales-service/sale-dashboard/sale-loans/sale-loans.component';
import { ILoan } from 'src/app/@core/models/quote-calculator.model';
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss'],
})
export class LoansComponent implements OnInit {
  showEmptyState = false;

  globalSkip = DefaultPagination.skip;
  globalTake = DefaultPagination.take;

  displayedColumns: string[] = [
    'loanId',
    'applicationId',
    // 'applicantId',
    'applicant',
    'country',
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
  applicantId!: number;
  applicationQuoteId!: number;
  applicantName: number = parseInt(
    this.activatedRoute.snapshot.paramMap.get('applicantName')!
  );

  dataSource!: MatTableDataSource<any>;
  loanFilterData!: any;
  totalCount!: number;
  isLoading$!: Observable<boolean>;

  selectedLoan: ILoan | null = null;
  loanActions: any = null;
  // loanActions: ILoanActions = null;

  selectedApplicationQuote: any = {};
  selectedContry!: any;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  startDateControl: FormControl = new FormControl(new Date());
  endDateControl: FormControl = new FormControl(new Date());

  startDate: string | null = null;
  endDate: string | null = null;

  subscription = new Subscription();
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute // private saleLoanService: SalesLoanService
  ) {}

  ngOnInit(): void {
    this.getTotalLoanFilters();
    this.getAllLoans();
    this.ListenToGetAllLoans();
    this.isLoading$ = this.store.pipe(
      select(SaleServiceSelectors.getLoadingState)
    );
  }

  getAllLoans(skip: number = this.globalSkip, take: number = this.globalTake) {
    this.store.dispatch(
      SaleServiceActions.GetSaleLoans({
        payload: {
          applicationId: this.applicationId,
          applicantId: this.applicantId,
          skip: skip,
          take: take,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      })
    );
  }

  formatDateYearFirst(date: Date): string | null {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTotalLoanFilters() {
    this.store.dispatch(
      SaleServiceActions.GetAllLoansStatistics({
        payload: {
          take: this.globalTake,
          skip: this.globalSkip,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      })
    );

    this.store
      .select(SaleServiceSelectors.getAllLoansStats)
      .subscribe((resData) => {
        if (resData) {
          this.loanFilterData = resData;
        }
      });
  }

  filterLoans() {
    const startDate = this.startDateControl.value._d;
    const endDate = this.endDateControl.value._d;

    // this.startDateControl.patchValue(startDate);
    // this.endDateControl.patchValue(endDate);

    this.startDate = this.formatDateYearFirst(startDate);
    this.endDate = this.formatDateYearFirst(endDate);

    this.getAllLoans();
  }

  ListenToGetAllLoans() {
    this.store
      .pipe(select(SaleServiceSelectors.getSaleLoans))
      .subscribe((resData: any) => {
        if (resData) {
          this.dataSource = new MatTableDataSource(resData.pageItems);
          this.totalCount = resData.totalCount;
        }
      });
  }

  approveLoan(id: number) {
    // this.store.dispatch(
    //   SaleServiceActions.ApproveLoan({
    //     payload: { id },
    //     paginationData: {
    //       applicantId: this.applicantId,
    //       applicationId: this.applicationId,
    //       skip: this.globalSkip,
    //       take: this.globalTake,
    //     },
    //   })
    // );
  }

  rejectLoan(id: number) {
    // this.store.dispatch(
    //   SaleServiceActions.RejectLoan({
    //     payload: { id },
    //     paginationData: {
    //       applicantId: this.applicantId,
    //       applicationId: this.applicationId,
    //       skip: this.globalSkip,
    //       take: this.globalTake,
    //     },
    //   })
    // );
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
        // takeUntil(this.unsubscribe$),
        select(CountriesSelector.getCountryById)
      )
      .subscribe((res: any) => {
        if (res !== null) {
          this.selectedContry = res;
        }
      });
  }

  viewLoanById(row: any) {
    // this.saleLoanService.changeMessage(row);
  }

  onPaginationChange({ pageIndex, pageSize }: any): void {
    this.globalSkip = pageIndex * pageSize;
    this.globalTake = pageSize;
    this.getAllLoans();
  }

  // onUpdateLoan(loan: any) {
  //   const dialogRef = this.dialog.open(EditLoanRequestComponent, {
  //     data: {
  //       applicantId: this.applicantId,
  //       loan: loan,
  //     },
  //     width: '400px',
  //     disableClose: true,
  //     autoFocus: true,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.getAllLoans();

  //     if (result) {
  //       // Assuming you have an identifier like 'loanId'
  //       const index = this.dataSource.data.findIndex(
  //         (item) => item.loanId === result.loanId
  //       );
  //       if (index !== -1) {
  //         this.dataSource.data[index] = result;
  //         this.dataSource._updateChangeSubscription();
  //         this.snackBar.open('Loan request updated and awaiting approval', '', {
  //           duration: 4000,
  //         });
  //       }
  //     }
  //   });
  // }

  // repayLoan(loanData: any) {
  //   const dialogRef = this.dialog.open(RepayLoanComponent, {
  //     data: {
  //       loan: this.loanFilterData,
  //     },
  //     width: '400px',
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     this.getAllLoans();
  //   });
  // }

  // toggleAction(action: ILoanActions, invoiceLoan?: ILoan) {
  toggleAction(action: any, invoiceLoan?: ILoan | any) {
    if (this.loanActions === action || !invoiceLoan) {
      this.loanActions = null;
      return;
    }
    this.selectedLoan = invoiceLoan;
    this.applicantId = invoiceLoan.applicantId;
    this.applicationQuoteId = invoiceLoan.applicationQuoteId;

    // // fetch payments schedule for the side modal;

    if (action === 'paymentPlan' && this.selectedLoan) {
      this.store.dispatch(
        QuoteLoanActions.getPaymentsSchedule({
          payload: {
            invoiceLoanId: this.selectedLoan.id,
            userId: '',
          },
        })
      );
    }

    if (action === 'viewCreatedPlan' && this.selectedLoan) {
      this.store.dispatch(
        QuoteLoanActions.getPaymentsSchedule({
          payload: { invoiceLoanId: this.selectedLoan.id, userId: '' },
        })
      );
    }
    this.loanActions = action;
  }

  // selectLoan(loan: ILoan): void {
  //   const dialogRef = this.dialog.open(RepayLoanComponent, {
  //     data: {
  //       loan,
  //     },
  //     width: '400px',
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     // this.getLoans();
  //   });
  // }
}
