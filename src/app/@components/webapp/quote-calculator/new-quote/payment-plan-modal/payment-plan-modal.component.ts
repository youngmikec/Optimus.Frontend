import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ILoan, IOptions, ISchedulePaymentPlan } from 'src/app/@core/models/quote-calculator.model';
import { QuoteCalculatorService } from 'src/app/@core/services/quote-calculator.service';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import * as QuoteActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';

@Component({
  selector: 'app-payment-plan-modal',
  templateUrl: './payment-plan-modal.component.html',
  styleUrls: ['./payment-plan-modal.component.scss'],
})
export class PaymentPlanModalComponent implements OnInit, OnDestroy {
  @Output() closePaymentPlan: EventEmitter<'paymentPlan'> = new EventEmitter();
  @Input() loan!: ILoan;
  @Input() selectedApplicationQuote!: any;
  @Input() selectedCountry!: any;

  checked = false;
  disabled = false;
  // isInterestOveride = false;
  isLeapYear: boolean = false;
  paymentPlanList: any[] = [];

  isLoading = this.store.pipe(
    select(QuoteSelectors.getQuoteCalculatorIsLoading)
  );

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
    repaymentDuration: [null, [Validators.required]],
    interest: [0, [Validators.required]],

    interestAmount: [null],
    expectedAmount: [null],
    startDate: [null, [Validators.required]],
    frequencyPerMonth: [null, [Validators.required]],

    allowInterestOveride: [false],
    newInterestRate: [0],
    changeRequestMessage: [''],
  });

  protected unsubscribe$ = new Subject<void>();

  get interestRateToUse(): number {
    return Number(this.schedulePaymentForm.controls['interest'].value);
    // return this.schedulePaymentForm.controls['allowInterestOveride'].value
    //   ? this.schedulePaymentForm.controls['newInterestRate'].value
    //   : this.schedulePaymentForm.controls['interest'].value;
  }

  constructor(
    public store: Store<fromApp.AppState>,
    private quoteService: QuoteCalculatorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.schedulePaymentForm.controls['interest'].setValue(
      this.loan.interestRate
    );
    this.schedulePaymentForm.controls['newInterestRate'].setValue(
      this.loan.interestRate
    );

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
    const amountToPay =
      (this.interestRateToUse / 100) * this.loan.amount + this.loan.amount;

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

  save(): void {
    if (this.schedulePaymentForm.invalid) return;

    const payload: ISchedulePaymentPlan = {
      quoteAmount: this.selectedApplicationQuote.amount,
      // currencyCode: this.selectedCountry?.currency?.currencyCode,
      currencyCode: this.loan.currencyCode,
      repaymentDuration: Number(
        this.schedulePaymentForm.controls['repaymentDuration'].value
      ),
      interest: this.schedulePaymentForm.controls['interest'].value,
      interestAmount: this.loan.amount * (this.interestRateToUse / 100),
      expectedAmount: this.loan.amount,
      overrideInterest: false,
      // overrideInterest:
      //   this.schedulePaymentForm.controls['allowInterestOveride'].value,
      startDate: this.schedulePaymentForm.controls['startDate'].value,
      invoiceLoanId: this.loan.id,
      frequency: Number(
        this.schedulePaymentForm.controls['frequencyPerMonth'].value
      ),

      paymentDetails: [...this.paymentPlanList],
      // newInterest: this.schedulePaymentForm.controls['newInterestRate'].value,
      // requestMessage:
      //   this.schedulePaymentForm.controls['changeRequestMessage'].value,
      userId: this.selectedApplicationQuote.userId,
    };
    // console.log(payload, this.loan.invoiceId);

    this.store.dispatch(
      QuoteActions.schedulePaymentPlan({
        payload,
        invoiceId: this.loan.invoiceId,
      })
    );

    this.store
      .pipe(select(QuoteSelectors.IsPaymentPlanDataCreated))
      .subscribe((res) => {
        return res && this.closeTray();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
