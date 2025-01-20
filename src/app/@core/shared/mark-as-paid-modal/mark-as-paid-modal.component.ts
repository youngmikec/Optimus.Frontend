import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as InvoiceActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoiceSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import { NotificationService } from '../../services/notification.service';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { IExchangeRate } from '../../interfaces/exchange-rate.interface';
import { addCommas, convertToNumber, generateUUID } from '../../utils/helpers';

export interface PaymentType {
  name: string;
  value: number;
}

@Component({
  selector: 'app-mark-as-paid-modal',
  templateUrl: './mark-as-paid-modal.component.html',
  styleUrls: ['./mark-as-paid-modal.component.scss'],
})
export class MarkAsPaidModalComponent implements OnInit, OnDestroy {
  markAsPaidForm: FormGroup;
  get createCountryFormControls() {
    return this.markAsPaidForm.controls;
  }
  isLoading!: Observable<boolean>;
  formData = new FormData();
  selectedFile!: any;
  fileSize: number = 5000000; // 5mb;
  formattedAmountPaid: string = '0';
  isFileAccepted: boolean = false;
  currencyList!: any[];
  bankCurrencyList: any[] = this.data.invoice?.invoiceBankAccounts;
  amountEquivalent: number = 0;
  selectedExchangeRate!: IExchangeRate | undefined;
  localFeeAmmount: number = 0;
  programFeeAmount: number = 0;
  totalOutstandingLocalFee: number = 0;
  totalOutstandingProgramFee: number = 0;
  programType!: number;
  showExchangeRate: boolean = true;
  PaymentWasIssuedWithOptionalCurrency: boolean = false;
  amount: string = '0';
  displayCurrency: string = 'NGN';

  exchangeRateList: IExchangeRate[] = [];
  paymentTypes: PaymentType[] = [
    { name: 'Local processing Fee', value: 1 },
    { name: 'Program Fee', value: 2 },
  ];
  // formattedCurrencyList!: any[];
  protected unsubscribe$ = new Subject<void>();
  amountPaid: any;
  ngnConversionRate: number = 0;
  fxRate: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MarkAsPaidModalComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {
    this.markAsPaidForm = this.fb.group({
      paymentType: [1, [Validators.required]],
      paymentCurrency: ['NGN', [Validators.required]],
      amountPaid: [null, [Validators.required]],
      telexNumber: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      exchangeRate: [null],
      OptionalCurrencyExchangeRate: [null],
    });

    this.isLoading = this.store.pipe(
      select(InvoiceSelector.isInvoiceCreatingSelector)
    );
  }

  ngOnInit(): void {
    this.exchangeRateList = this.data.exchangeRateList;
    this.programType = this.data?.programType;
    this.calculateProgramFees();

    this.getActiveCurrency();

    this.bankCurrencyList =
      this.data.invoice?.invoiceBankAccounts ?? this.currencyList;

    if (this.exchangeRateList.length > 0) {
      this.selectExchange(this.data.invoice.baseCurrencyCode, 'NGN');
    }

    this.markAsPaidForm.patchValue({
      paymentType: 1,
      paymentCurrency: 'NGN',
    });

    this.markAsPaidForm.get('paymentType')?.valueChanges.subscribe((value) => {
      if (
        value !== 2 &&
        this.markAsPaidForm.get('paymentCurrency')?.value === 'NGN'
      ) {
        this.markAsPaidForm.get('exchangeRate')?.setValue(null);
      }
      this.updateExchangeRateValidator();
    });

    this.markAsPaidForm
      .get('paymentCurrency')
      ?.valueChanges.subscribe((value) => {
        if (
          value === 'NGN' &&
          this.markAsPaidForm.get('paymentType')?.value !== 2
        ) {
          this.markAsPaidForm.get('exchangeRate')?.setValue(null);
        }
        this.updateExchangeRateValidator();
      });

    this.updateExchangeRateValidator();
  }

  calculateProgramFees() {
    this.programFeeAmount = this.data?.invoiceStatistics?.outstandingProgramFee;
    this.localFeeAmmount = this.data?.invoiceStatistics?.outstandingProgramFee;
    // this.programFeeAmount =
    //   this.data.invoice?.invoiceQuotations[1]?.amount -
    //     this.data.invoice?.invoiceQuotations[1]?.amountPaid || 0;
    // this.localFeeAmmount =
    //   this.data.invoice?.invoiceQuotations[0]?.amount -
    //     this.data.invoice?.invoiceQuotations[0]?.amountPaid || 0;
  }

  calculateAmountEquivalent() {
    const paymentCurrency = this.markAsPaidForm.value['paymentCurrency'];
    const isBaseCurrency =
      paymentCurrency === 'NGN' ||
      paymentCurrency === this.data.invoice.baseCurrencyCode;

    this.displayCurrency = isBaseCurrency ? 'NGN' : paymentCurrency;

    const exchangeRate = isBaseCurrency
      ? this.markAsPaidForm.value['exchangeRate'] ||
        this.selectedExchangeRate?.rate ||
        this.data.invoice?.exchangeRate
      : this.markAsPaidForm.value['OptionalCurrencyExchangeRate'] ||
        this.selectedExchangeRate?.rate ||
        this.data.invoice?.exchangeRate;

    this.amountEquivalent = this.programFeeAmount * (exchangeRate || 0);
  }

  selectExchange(
    baseCurrency: string = 'USD',
    variableCurrency: string = 'NGN'
  ): IExchangeRate | undefined {
    let exchangeRate: IExchangeRate | undefined;
    if (this.exchangeRateList.length > 0) {
      exchangeRate = this.exchangeRateList.find(
        (value) =>
          value.baseCurrencyCode === baseCurrency &&
          value.variableCurrencyCode === variableCurrency
      );
    }
    return exchangeRate;
  }

  updateExchangeRateValidator(): void {
    const exchangeRateControl = this.markAsPaidForm.get('exchangeRate');
    const paymentTypeControl = this.markAsPaidForm.get('paymentType');
    const currencyControl = this.markAsPaidForm.get('paymentCurrency');

    if (!exchangeRateControl) return;

    if (paymentTypeControl?.value === 2 || currencyControl?.value !== 'NGN') {
      // If paymentType is 2, make exchangeRate required
      exchangeRateControl.setValidators([Validators.required]);
    } else {
      // Otherwise, remove the required validator
      exchangeRateControl.clearValidators();
    }

    // Update the control's validation status
    exchangeRateControl.updateValueAndValidity();
  }

  openFileInput() {
    document?.getElementById(`upload`)?.click();
  }

  get markAsPaidFormControls() {
    return this.markAsPaidForm.controls;
  }

  getErrorMessage(control: string): string {
    let message: string = '';

    if (control === 'paymentCurrency') {
      message = 'Currency is required';
    }
    if (control === 'paymentType') {
      message = 'Payment type is required';
    }
    if (control === 'paymentDate') {
      message = 'Payment Date is required';
    }
    if (control === 'exchangeRate') {
      message = 'Exchange Rate is required';
    }
    if (control === 'telexNumber') {
      message = 'Telex Number is required';
    }
    if (control === 'amountPaid') {
      message = 'Amount Paid is required';
    }
    if (control === 'OptionalCurrencyExchangeRate') {
      message = 'FX ExchangeRate is required';
    }
    return message;
  }

  selectProgramType($event: any): void {
    if ($event && $event.value === 2) {
      this.selectedExchangeRate = this.selectExchange(
        this.data.invoice.baseCurrencyCode,
        'NGN'
      );
      this.calculateAmountEquivalent();
    }
    if ($event && $event.value === 1) {
      this.markAsPaidForm.patchValue({
        OptionalCurrencyExchangeRate: null,
      });
    }
  }

  decideExchangeRate(): number {
    const optionalCurrencyRate =
      this.markAsPaidForm.value['OptionalCurrencyExchangeRate'];
    const exchangeRate = this.markAsPaidForm.value['exchangeRate'];
    const invoiceExchangeRate = this.data.invoice?.exchangeRate;

    if (this.PaymentWasIssuedWithOptionalCurrency && optionalCurrencyRate) {
      return optionalCurrencyRate;
    }

    if (!this.PaymentWasIssuedWithOptionalCurrency && exchangeRate) {
      return exchangeRate;
    }

    if (this.selectedExchangeRate?.rate) {
      return this.selectedExchangeRate.rate;
    }

    return invoiceExchangeRate ?? 0;
  }

  selectCurrency($event: any): void {
    if ($event && $event.value !== this.data.invoice.baseCurrency) {
      if (
        $event.value !== 'NGN' &&
        $event.value !== this.data.invoice?.baseCurrencyCode
      ) {
        this.PaymentWasIssuedWithOptionalCurrency = true;
      } else {
        this.PaymentWasIssuedWithOptionalCurrency = false;
      }
      if ($event.value === 'NGN') {
        this.showExchangeRate = false;
      } else {
        this.showExchangeRate = true;
      }
      this.selectedExchangeRate = this.selectExchange(
        this.data.invoice.baseCurrencyCode,
        $event.value
      );
      this.calculateAmountEquivalent();
    }
  }

  // Function to format number with commas
  formatAmount(event: any) {
    const input = event.target.value;
    // Remove any commas from the input for processing
    const plainNumber = input.replace(/,/g, '');
    // Format the number with commas
    this.amount = addCommas(plainNumber);
    this.markAsPaidForm.patchValue({
      amountPaid: convertToNumber(this.amount),
    });
  }

  onUpload(e: any) {
    if (e.target.files[0]?.size < this.fileSize) {
      this.selectedFile = e.target.files[0];
      this.isFileAccepted = true;
    } else {
      this.isFileAccepted = false;
      const notification: Notification = {
        state: 'warning',
        message: 'The maximum image size is 1MB',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
    }
  }

  handleAmountPaidChange($event: any): void {
    if ($event) {
      this.amountPaid = $event.target.value;
      this.markAsPaidForm.patchValue({
        amountPaid: $event,
      });
    }
  }

  getActiveCurrency() {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: 0, take: 9999 },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(CurrencySelector.getAllCurrencies)
      )
      .subscribe((resData: any) => {
        if (resData !== null) {
          // this.currencyList = resData.filter((curr: any) => curr.status === 1);
          this.currencyList = resData.filter((curr: any) => {
            return this.programType === 1
              ? curr.currencyCode === 'NGN' || curr.currencyCode === 'USD'
              : curr.currencyCode === 'EUR' || curr.currencyCode === 'NGN';
          });
        }

        this.bankCurrencyList =
          this.data.invoice?.invoiceBankAccounts ?? this.currencyList;
      });
  }

  onSubmit() {
    if (this.markAsPaidForm.invalid) {
      return;
    } else {
      this.formData.append(
        'FeeCategory',
        this.markAsPaidForm.value.paymentType
      );

      this.formData.append(
        'ExchangeRate',
        this.markAsPaidForm.value.exchangeRate
      );
      this.formData.append(
        'OptionalCurrencyExchangeRate',
        this.markAsPaidForm.value.OptionalCurrencyExchangeRate
      );
      this.formData.append(
        'PaymentWasIssuedWithOptionalCurrency',
        this.PaymentWasIssuedWithOptionalCurrency ? 'true' : 'false'
      );

      this.formData.append(
        'PaymentDate',
        this.markAsPaidForm.value.paymentDate
      );

      this.formData.append(
        'CurrencyCode',
        this.markAsPaidForm.value.paymentCurrency
      );
      this.formData.append('AmountPaid', this.markAsPaidForm.value.amountPaid);
      this.formData.append(
        'TelexNumber',
        this.markAsPaidForm.value.telexNumber
      );

      this.formData.append('InvoiceId', this.data.invoice.id);
      this.formData.append(
        'ApplicationQuoteId',
        this.data.invoice.applicationQuoteId
      );
      this.formData.append('RequestId', generateUUID());

      this.formData.append('Document', this.selectedFile);

      this.store.dispatch(
        InvoiceActions.markAsPaid({
          form: this.formData,
          applicationQuoteId: this.data.invoice.applicationQuoteId,
        })
      );
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
