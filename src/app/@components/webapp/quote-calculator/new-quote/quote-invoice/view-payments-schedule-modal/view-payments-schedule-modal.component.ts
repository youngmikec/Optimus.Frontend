import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

import {
  IGetLoanPaymentsScheduleResponse,
  ILoan,
  IOptions,
  PaymentScheduleHistory,
} from 'src/app/@core/models/quote-calculator.model';
import { QuoteCalculatorService } from 'src/app/@core/services/quote-calculator.service';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import * as QuoteActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as ApplicantActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as ApplicantSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import * as ApplicationActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationSelectors from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
// import { QuoteDocumentViewComponent } from '../quote-document-view/quote-document-view.component';
import { PaymentScheduleDocumentDialogComponent } from '../payment-schedule-document-dialog/payment-schedule-document-dialog.component';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { PaymentReceiptDialogComponent } from '../../payment-receipt-dialog/payment-receipt-dialog.component';
import { IApplicant } from 'src/app/@core/interfaces/applicant.interface';
import { FinancialStatementDialogComponent } from '../../financial-statement-dialog/financial-statement-dialog.component';
import { ICountry } from 'src/app/@core/models/payment-plan.model';

@Component({
  selector: 'app-view-payments-schedule-modal',
  templateUrl: './view-payments-schedule-modal.component.html',
  styleUrls: ['./view-payments-schedule-modal.component.scss'],
})
export class ViewPaymentsScheduleModalComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Output() closePaymentPlan: EventEmitter<'paymentPlan'> = new EventEmitter();
  @Input() loan: ILoan | null = null;
  @Input() selectedApplicationQuote: any;
  @Input() applicationQuoteId: number = 0;
  @Input() applicantName: string = '';
  @Input() applicantId: number = 0;
  @Input() selectedCountry: ICountry | null = null;

  protected unsubscribe$ = new Subject<void>();

  selectedApplicant!: IApplicant;

  isEditMode?: 'EDIT_BEFORE_PAYMENT' | 'UPDATE_AFTER_PAYMENT' = undefined;
  viewDocumentMode = false;

  checked = false;
  disabled = false;
  isLeapYear: boolean = false;
  paymentPlanList: any[] = [];
  viewedquoteDocumentData: any;
  today = new Date();

  isLoading = this.store.pipe(
    select(QuoteSelectors.getQuoteCalculatorIsLoading)
  );
  paymentsSheduleId?: number;

  frequencyList: IOptions[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
  ];

  paymentDuration: IOptions[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ];

  schedulePaymentForm = this.fb.group({
    repaymentDuration: [0, [Validators.required]],
    interest: [0, [Validators.required]],

    interestAmount: [0],
    expectedAmount: [0],
    overrideInterest: [false],
    startDate: ['', [Validators.required]],
    frequencyPerMonth: [0, [Validators.required]],

    allowInterestOveride: [false],
    newInterestRate: [0],
    changeRequestMessage: [''],
  });

  paymentsSchedulePlan$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(QuoteSelectors.PaymentsPlanSchedule),
    tap((paymentsShedule) => {
      if (paymentsShedule) {
        this.paymentsSheduleId = paymentsShedule.id;
        this.store.dispatch(
          QuoteActions.getPaymentsScheduleHistory({
            payload: { paymentscheduleId: paymentsShedule.id, userId: '' },
          })
        );
        this.paymentPlanList = paymentsShedule.invoiceLoanPaymentDetails;
        this.schedulePaymentForm.controls['repaymentDuration'].setValue(
          paymentsShedule.repaymentDuration
        );
        this.schedulePaymentForm.controls['interest'].setValue(
          paymentsShedule.interest
        );
        this.schedulePaymentForm.controls['interestAmount'].setValue(
          paymentsShedule.interestAmount
        );
        this.schedulePaymentForm.controls['expectedAmount'].setValue(
          paymentsShedule.expectedAmount
        );
        this.schedulePaymentForm.controls['startDate'].setValue(
          paymentsShedule.startDate
        );
        this.schedulePaymentForm.controls['frequencyPerMonth'].setValue(3);
        this.schedulePaymentForm.controls['allowInterestOveride'].setValue(
          paymentsShedule.overrideInterest
        );
        this.schedulePaymentForm.controls['newInterestRate'].setValue(
          paymentsShedule.interest
        );
        this.schedulePaymentForm.controls['changeRequestMessage'].setValue(
          paymentsShedule.interestMessage ?? ''
        );
      }
    })
  );

  paymentsScheduleHistory$ = this.store.pipe(
    takeUntil(this.unsubscribe$),
    select(QuoteSelectors.PaymentsScheduleHistory)
  );

  get interestRateToUse(): number {
    return Number(this.schedulePaymentForm.controls['interest'].value);
    // return this.schedulePaymentForm.controls['allowInterestOveride'].value
    //   ? this.schedulePaymentForm.controls['newInterestRate'].value
    //   : this.schedulePaymentForm.controls['interest'].value;
  }

  constructor(
    public store: Store<fromApp.AppState>,
    private quoteService: QuoteCalculatorService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.schedulePaymentForm.controls[
      'frequencyPerMonth'
    ].valueChanges.subscribe({
      next: () => {
        this.getRepaymentPlan();
      },
    });

    this.schedulePaymentForm.controls[
      'repaymentDuration'
    ].valueChanges.subscribe({
      next: () => {
        this.getRepaymentPlan();
      },
    });

    this.schedulePaymentForm.controls['startDate'].valueChanges.subscribe({
      next: () => {
        this.getRepaymentPlan();
      },
    });

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(QuoteSelectors.CreatedScheduledPaymentPlanData)
      )
      .subscribe((createdData) => {
        if (!createdData) return;

        this.closeTray();
      });
    this.getApplicantById();
    this.getApplicationQuoteById();
  }

  ngOnChanges(): void {
    this.getApplicantById();
    this.getApplicationQuoteById();
  }

  getApplicationQuoteById(): void {
    if (this.applicationQuoteId) {
      this.store.dispatch(
        ApplicationActions.GetApplicationQuoteById({
          payload: {
            id: this.applicationQuoteId,
          },
        })
      );

      this.store
        .pipe(select(ApplicationSelectors.getApplicationQuoteById))
        .subscribe((res) => {
          if (res) {
            this.selectedApplicationQuote = res;
          }
        });
    }
  }

  closeTray() {
    this.closePaymentPlan.emit('paymentPlan');
  }

  requestOverride(): void {
    this.quoteService.setOverrideFxn();
    return;
  }

  getRepaymentPlan(): void {
    const DAYS_IN_A_MONTH = 30;
    const ONE_DAY_In_Ms = 24 * 60 * 60 * 1000; // 24 hours to minutes to seconds to milliseconds
    if (!this.schedulePaymentForm.controls['repaymentDuration'].value) return;
    if (!this.schedulePaymentForm.controls['frequencyPerMonth'].value) return;
    if (!this.schedulePaymentForm.controls['startDate'].value) return;
    this.paymentPlanList = [];
    const startDate = new Date(
      this.schedulePaymentForm.controls['startDate'].value
    );

    const duration = Number(
      this.schedulePaymentForm.controls['repaymentDuration'].value
    );
    const frequency = Number(
      this.schedulePaymentForm.controls['frequencyPerMonth'].value
    );
    const amountToPay: number = this.loan ? ((this.interestRateToUse / 100) * this.loan.amount + this.loan.amount) : 0;

    const numOfRepayment = duration * frequency;
    const repaymentAmount = Number((amountToPay / numOfRepayment).toFixed(2));
    const monthlyInterval = DAYS_IN_A_MONTH / frequency;

    for (let step = 0; step < numOfRepayment; step++) {
      const repaymentDate =
        startDate.getTime() + step * monthlyInterval * ONE_DAY_In_Ms;
      const repaymentDetails = {
        amount: repaymentAmount,
        paymentDate: new Date(repaymentDate),
      };
      this.paymentPlanList.push(repaymentDetails);
    }
  }

  calculatorFxn(
    seedValue: number,
    remDays: number,
    nextRepaymentDay: number,
    currDay: number,
    currMonth: number,
    currYear: number,
    repaymentList: string[]
  ): string[] {
    do {
      if (nextRepaymentDay === currDay) {
        repaymentList.push(`${currDay}/${currMonth}/${currYear}`);
      } else {
        repaymentList.push(`${nextRepaymentDay}/${currMonth}/${currYear}`);
      }
      nextRepaymentDay = nextRepaymentDay + seedValue;
      remDays = remDays - seedValue;
    } while (remDays !== 0);

    return repaymentList;
  }

  getApplicantById(): void {
    if (this.applicantId) {
      this.store.dispatch(
        ApplicantActions.GetSingleApplicants({
          payload: {
            id: this.applicantId,
          },
        })
      );

      this.store
        .pipe(select(ApplicantSelectors.getSingleApplicants))
        .subscribe((data) => {
          if (data) {
            this.selectedApplicant = data;
          }
        });
    }
    return;
  }

  // download invoice
  downloadPdf(pdfUrl?: string) {
    if (pdfUrl !== undefined) {
      fetch(pdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobURL;
          // link.download = `${this.applicantName}-payment-receipt` ?? 'payment-receipt.pdf';
          link.download = `${this.applicantName}-payment-receipt` || 'payment-receipt.pdf';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobURL);
        })
        .catch(() => {
          const notification: Notification = {
            state: 'error',
            message: 'Error while downloading file',
          };
          this.notificationService.openSnackBar(
            notification,
            'opt-notification-error'
          );
        });
    } else {
      const notification: Notification = {
        state: 'error',
        message: 'Error while downloading file',
      };
      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
    }
  }

  // download financial statement
  downloadFinanacialPdf() {
    // if (pdfUrl !== undefined) {
    //   fetch(pdfUrl)
    //     .then((response) => response.blob())
    //     .then((blob) => {
    //       const blobURL = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = blobURL;
    //       link.download =
    //         `${this.applicantName}-payment-receipt` ?? 'payment-receipt.pdf';
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //       URL.revokeObjectURL(blobURL);
    //     })
    //     .catch(() => {
    //       const notification: Notification = {
    //         state: 'error',
    //         message: 'Error while downloading file',
    //       };
    //       this.notificationService.openSnackBar(
    //         notification,
    //         'opt-notification-error'
    //       );
    //     });
    // } else {
    //   const notification: Notification = {
    //     state: 'error',
    //     message: 'Error while downloading file',
    //   };
    //   this.notificationService.openSnackBar(
    //     notification,
    //     'opt-notification-error'
    //   );
    // }
  }

  save(): void {
    if (this.schedulePaymentForm.invalid) return;

    const payload: any = {
      userId: this.selectedApplicationQuote.userId,
      paymentScheduleId: this.paymentsSheduleId!,
      quoteAmount: this.selectedApplicationQuote.amount,
      currencyCode: this.loan ? this.loan.currencyCode : null,
      repaymentDuration: Number(
        this.schedulePaymentForm.controls['repaymentDuration'].value
      ),
      interest: this.interestRateToUse,
      interestAmount: this.loan ? this.loan.amount * (this.interestRateToUse / 100) : 0,
      expectedAmount: this.loan ? this.loan.amount : 0,
      overrideInterest: true,
      startDate: this.schedulePaymentForm.controls['startDate'].value,
      // invoiceLoanId: this.loan.id,
      // frequency: Number(
      //   this.schedulePaymentForm.controls['frequencyPerMonth'].value
      // ),
      // paymentDetails: [...this.paymentPlanList],
    };

    this.store.dispatch(
      QuoteActions.updatePaymentsPlan({
        payload,
        invoiceId: this.loan ? this.loan.invoiceId : 0,
      })
    );
    this.closeTray();
  }

  showDownloadPreview(
    paymentSchedule: IGetLoanPaymentsScheduleResponse['entity']
  ) {
    // const data = {
    // paymentSchedule.invoiceLoanPaymentDetails,
    //   applicant: this.selectedApplicationQuote.application.applicant,
    // };
    this.closeTray();
    this.dialog.open(PaymentScheduleDocumentDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        paymentSchedule,
        selectedApplicationQuote: this.selectedApplicationQuote,
      },
    });
  }

  viewFinancialDocument() {
    this.viewDocumentMode = true;
    this.viewedquoteDocumentData = {
      fileName: 'Financial Statement receipt',
      selectedApplicant: this.selectedApplicant,
      applicationQuoteId: this.applicationQuoteId,
      paymentHistory: this.paymentsScheduleHistory$,
      selectedApplicationQuote: this.selectedApplicationQuote,
    };
    this.closeTray();
    this.dialog.open(FinancialStatementDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: this.viewedquoteDocumentData,
      disableClose: false,
    });
  }

  viewPaymentDocument(item: string) {
    this.viewDocumentMode = true;
    this.viewedquoteDocumentData = {
      fileName: 'Payment receipt',
      extension: item.split(/[#?]/)[0].split('.')?.pop()?.trim(),
      documentUrl: item,
      loan: this.loan ? this.loan : null,
      selectedApplicant: this.selectedApplicant,
      applicationQuoteId: this.applicationQuoteId,
      paymentHistory: this.paymentsScheduleHistory$,
      selectedApplicationQuote: this.selectedApplicationQuote,
      paymentReceiptDocUrl: item,
    };
    this.closeTray();
    // const dialogRef = this.dialog.open(QuoteDocumentViewComponent, {
    this.dialog.open(PaymentReceiptDialogComponent, {
      width: '65%',
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: this.viewedquoteDocumentData,
      disableClose: false,
    });
  }

  approveLoan(paymentHistory: PaymentScheduleHistory) {
    this.store.dispatch(
      QuoteActions.updatePaymentsScheduleHistory({
        payload: {
          id: paymentHistory.id,
          paymentStatus: 1,
          userId: '',
          paymentSchdeuleId: paymentHistory.paymentSchdeuleId,
        },
      })
    );
  }

  prepFormGroupForUpdateOnRemaningBalance(): void {
    this.isEditMode = 'UPDATE_AFTER_PAYMENT';
    this.schedulePaymentForm.controls['allowInterestOveride'].setValue(true);
    this.schedulePaymentForm.controls['changeRequestMessage'].setValue('');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
