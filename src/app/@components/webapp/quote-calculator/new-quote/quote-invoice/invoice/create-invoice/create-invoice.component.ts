import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SendToApplicantModalComponent } from 'src/app/@core/shared/send-to-applicant-modal/send-to-applicant-modal.component';
import { SignatureModalComponent } from 'src/app/@core/shared/signature-modal/signature-modal.component';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as DepartmentsSelector from 'src/app/@core/stores/department/departments.selectors';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { ShedulePaymentPlanDialogComponent } from './shedule-payment-plan-dialog/shedule-payment-plan-dialog.component';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as InvoiceCurrenciesAction from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.actions';
import * as InvoiceCurrenciesSelector from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.selectors';
import { CreateCurrencyConversionComponent } from 'src/app/@components/webapp/admin-settings/currency-config/create-currency-conversion/create-currency-conversion.component';
import { IApplicant } from 'src/app/@core/interfaces/applicant.interface';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { IExchangeRate } from 'src/app/@core/interfaces/exchange-rate.interface';
import {
  generateUUID,
  sortArrayWithCondition,
} from 'src/app/@core/utils/helpers';
import { PermissionService } from 'src/app/@core/services/permission.service';
import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';

interface BankAccountInterface {
  id: number;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  countryId?: number;
  accountCurrencyType: number;
}

export enum ProgramType {
  CBI = 1,
  RBI = 2,
}

enum InvoiceCreateMode {
  create = 'create',
  download = 'download',
  sendMail = 'sendMail',
}

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {
  createInvoiceForm!: FormGroup;
  locationList: any[] = [
    {
      title: 'Head Office:',
      one: '11th-14th Floor, Churchgate Towers 2,',
      two: 'PC 30, Churchgate street,',
      three: 'Victoria Island, Lagos',
      four: 'Nigeria.',
    },
    {
      title: 'Abuja Office:',
      one: '8th Floor, World Trade Center,',
      two: '1113, Constitutional Ave.,',
      three: 'Central Business District,',
      four: 'Abuja Nigeria.',
    },
    {
      title: 'Lekki Office:',
      one: '3rd Floor, CAPPA House',
      two: '1, Udeco Medical Road,',
      three: 'Off Chevron Drive, Lekki,',
      four: 'Lagos Nigeria.',
    },
    {
      title: 'Enugu Office:',
      one: 'Centers 57 & 59,',
      two: 'Palms Polo Park Mall,',
      three: 'Abakaliki Road,',
      four: 'Enugu, Nigeria.',
    },
    {
      title: 'East Africa Regional Office:',
      one: 'Pearle Heaven, House B7,',
      two: 'Westlands Avenue,',
      three: 'Off Rhapta Road,',
      four: 'Westlands, Nairobi Kenya.',
    },
  ];

  invoiceCreateMode!: InvoiceCreateMode;

  isLoading!: Observable<boolean>;
  invoiceReceiptType: string = 'country';

  applicationQuoteId!: number;
  dataSource!: any[];
  activeBankAccounts!: BankAccountInterface[];
  bankAccounts!: BankAccountInterface[];
  activeNairaBankAccounts!: BankAccountInterface[];
  activeDollarBankAccounts!: BankAccountInterface[];

  currencyList!: any[];
  formattedCurrencyList!: any[];
  selectedCurrency!: any;
  totalQuoteGenerated: number = 0;
  localProcessingFee: number = 0;
  countryFee: number = 0;
  countryFeeInNGN: number = 0;
  totalPayable: number = 0;
  defaultExchangeRate: number = 750;
  totalProgramCost = 0;
  selectedApplicationQuote!: IApplicationQuote;
  baseCurrencyCode: string = 'USD';
  programType!: ProgramType;

  selectedCountry!: any;
  invoiceAmount: number = 0; // value is calculated in Naira;
  activeExchangeRateList!: any;
  selectedExchangeRate!: IExchangeRate;
  selectedEuroExchangeRate!: IExchangeRate;
  isCountryLoading!: Observable<boolean>;
  isBanksLoading!: Observable<boolean>;
  getApplicationQuoteIsLoading!: Observable<boolean>;
  applicant!: IApplicant;
  numOfBankAcounts: number = 2;
  secondBankCurrency: string = 'USD';
  optionalBankCurrency: string = '';
  optionalBankAmount: number = 0;
  optionalBankAmountInUsd: number = 0;
  optionalBankAmountInNgn: number = 0;
  secondBankOptions: BankAccountInterface[] = [];
  optionalBankOptions: BankAccountInterface[] = [];
  numOfBanksArray: string[] = [];
  invoiceCurrencies: any[] = [];
  familySize: number = 1;

  protected unsubscribe$ = new Subject<void>();

  invoiceItems = [
    { name: 'Country Fee', percent: 0, amount: 0, currency: '' },
    { name: 'Local Processing Fee', percent: 0, amount: 0, currency: '' },
  ];

  signature!: string;
  signaturePreview!: string;
  invoiceCurrency: any;

  selectedMigrationRouteInvoiceItem!: any | null;
  bankAccountDetails = [
    {
      fieldName: 'Bank name',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'Bank address',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'Beneficiary',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'Account number',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'Beneficiary address',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'Swift code',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    // {
    //   fieldName: 'USD correspondent bank',
    //   nairaValue: '',
    //   secondBankValue: '',
    //   optionalBankValue: '',
    // },
    // {
    //   fieldName: 'USD correspondent bank swift code',
    //   nairaValue: '',
    //   secondBankValue: '',
    //   optionalBankValue: '',
    // },
  ];

  otherBankAccountDetails = [
    {
      fieldName: 'Swift code',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'USD correspondent bank',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
    {
      fieldName: 'USD correspondent bank swift code',
      nairaValue: '',
      secondBankValue: '',
      optionalBankValue: '',
    },
  ];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    public permissionService: PermissionService
  ) {
    this.buildCreateInvoiceForm();
    this.store.dispatch(
      InvoicesActions.createInvoiceSuccess({ payload: false })
    );

    this.isLoading = this.store.pipe(
      select(InvoicesSelector.isInvoiceCreatingSelector)
    );
    this.isCountryLoading = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );
    this.getApplicationQuoteIsLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
  }

  ngOnInit(): void {
    this.buildCreateInvoiceForm();
    this.getActiveCurrency();

    this.getApplicationQuoteById();
    this.getActiveExchangeRates();
    this.getActiveBankAccounts();

    this.calculateAmount();
    this.calculateLocalAmount();
  }

  setNumOfBanksArray(numOfAccounts: number): void {
    this.numOfBanksArray = numOfAccounts === 2 ? ['1', '2'] : ['1', '2', '3'];
  }

  setBankOptions() {
    if (this.programType === ProgramType.CBI) {
      this.secondBankCurrency = 'USD';
      this.secondBankOptions = this.getBankAccountByCurrencyCode(
        'USD',
        this.selectedCountry
      );
    } else {
      // if program type = RBI secondBankOptions is based on baseCurrency
      this.secondBankCurrency = 'USD';
      this.secondBankOptions = this.getBankAccountByCurrencyCode(
        'USD',
        this.selectedCountry
      );

      this.optionalBankCurrency =
        this.selectedCountry?.currency?.currencyCode || 'EUR';
      this.optionalBankOptions = this.getBankAccountByCurrencyCode(
        this.selectedCountry?.currency?.currencyCode || 'EUR',
        this.selectedCountry
      );
    }
  }

  getBankAccountByCurrencyCode(
    type: string,
    country: any
  ): BankAccountInterface[] {
    let banks: BankAccountInterface[] = [];
    if (this.bankAccounts && this.bankAccounts.length > 0) {
      banks = this.bankAccounts.filter((account: any) => {
        if (country) {
          if (type === 'NGN') {
            return (
              account.accountCurrencyType === 0 &&
              account.countryId === country.id
            );
          } else if (type === 'USD') {
            return (
              account.accountCurrencyType === 1 &&
              account.countryId === country.id
            );
          } else {
            return (
              account.accountCurrencyType > 1 &&
              account.countryId === country.id
            );
          }
        } else {
          if (type === 'NGN') {
            return account.accountCurrencyType === 0;
          } else if (type === 'USD') {
            return account.accountCurrencyType === 1;
          } else {
            return account.accountCurrencyType > 1;
          }
        }
      });
    }
    return banks;
  }

  setSelectedExchangeRate(): void {
    if (this.activeExchangeRateList.length > 0) {
      this.selectedExchangeRate = this.activeExchangeRateList.find(
        (xrate: any) =>
          xrate.baseCurrencyCode === 'USD' &&
          xrate.variableCurrencyCode === 'NGN'
      );

      this.selectedEuroExchangeRate = this.activeExchangeRateList.find(
        (xrate: IExchangeRate) =>
          xrate.baseCurrencyCode === 'EUR' &&
          xrate.variableCurrencyCode === 'USD'
      );
    }
  }

  getActiveBankAccounts() {
    this.store.dispatch(
      DepartmentsActions.GetActiveBankAccounts({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(DepartmentsSelector.getActiveBankAccounts)
      )
      .subscribe((resData: BankAccountInterface[]) => {
        if (resData !== null) {
          this.activeBankAccounts = resData;
          this.bankAccounts = resData;
          this.setBankOptions();
          this.activeNairaBankAccounts = resData.filter(
            (account) => account.accountCurrencyType === 0
          );

          this.activeDollarBankAccounts = resData.filter(
            (account) => account.accountCurrencyType === 1
          );
          this.activeDollarBankAccounts = resData.filter(
            (account) => account.accountCurrencyType === 1
          );
        }
      });
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
            return (
              curr.currencyCode === 'NGN' ||
              curr.currencyCode === 'EUR' ||
              curr.currencyCode === 'USD'
            );
          });
          if (this.currencyList.length > 0) {
            this.formattedCurrencyList =
              this.numOfBankAcounts === 1
                ? this.currencyList
                : this.currencyList.filter((currency) =>
                    this.selectedCountry
                      ? currency.currencyCode ===
                        this.selectedCountry?.currency?.currencyCode
                      : currency.currencyCode !== 'NGN'
                  );
            this.invoiceCurrency = this.currencyList.find(
              (currency: any) => currency.currencyCode === 'NGN'
            );
          }
        }
      });
  }

  getApplicationQuoteById() {
    if (this.route.snapshot.paramMap.get('applicationId')) {
      this.applicationQuoteId = parseInt(
        this.route.snapshot.paramMap.get('applicationId') || ''
      );
    }

    if (!this.applicationQuoteId) return;

    this.totalQuoteGenerated = 0;
    this.totalProgramCost = 0;
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
          this.getInvoiceCurrenciesByCountryId(
            res.application.migrationRoute?.countryId
          );
          this.getAllInvoiceItems();
          this.applicant = res?.application?.applicant;

          this.selectedApplicationQuote = res;
          const quoteItems = sortArrayWithCondition(
            this.selectedApplicationQuote?.applicationQuoteItems,
            'routeFeeSerialNumber'
          );
          if (quoteItems.length > 0) {
            const quote = quoteItems.find(
              (item) => item.name === "Gov't Fee" || item.numberOfPeople > 1
            );
            this.familySize = quote ? quote.numberOfPeople : 1;
          }
          this.dataSource =
            this.selectedApplicationQuote?.applicationQuoteItems;
        }
      });
  }

  getAllInvoiceItems() {
    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItems({
        payload: { skip: 0, take: 10 },
      })
    );

    this.store
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
              this.selectedApplicationQuote?.application?.migrationRoute
                ?.countryId
          );

          invoiceConfigList.forEach((item: any) => {
            if (
              item.migrationRouteId ===
              this.selectedApplicationQuote?.application?.migrationRoute?.id
            ) {
              newInvoiceConfigArr.push(item);
            } else if (item.allMigrationRoute) {
              newInvoiceConfigArr.push(item);
            }
          });

          this.selectedMigrationRouteInvoiceItem = newInvoiceConfigArr[0];

          this.invoiceItems[0].percent = Math.floor(
            this.selectedMigrationRouteInvoiceItem?.percentageCountryFee ?? 30
          );

          if (
            this.selectedApplicationQuote.hasDiscountApplied &&
            this.selectedApplicationQuote.netAmount
          ) {
            this.invoiceItems[0].amount = Math.floor(
              this.selectedApplicationQuote.netAmount *
                (this.invoiceItems[0].percent / 100)
            );
          }
          if (
            !this.selectedApplicationQuote.hasDiscountApplied &&
            this.selectedApplicationQuote.amount
          ) {
            this.invoiceItems[0].amount = Math.floor(
              this.selectedApplicationQuote.amount *
                (this.invoiceItems[0].percent / 100)
            );
          }

          this.invoiceItems[0].currency = this.baseCurrencyCode;

          this.invoiceItems[1].percent = Math.floor(
            this.selectedMigrationRouteInvoiceItem?.percentageLocalFee ?? 50
          );

          this.invoiceItems[1].amount = Math.floor(
            (this.invoiceItems[1].percent / 100) *
              (this.selectedMigrationRouteInvoiceItem?.localFeeAmount ??
                5750000)
          );

          this.invoiceItems[1].currency = 'NGN';

          this.totalQuoteGenerated = Math.floor(this.invoiceItems[0].amount);
          const amountDueInNGN: number = this.calculateCurrencyEquivalent(
            this.totalQuoteGenerated,
            'USD',
            'NGN'
          );

          this.invoiceAmount =
            amountDueInNGN + Math.floor(this.invoiceItems[1].amount);

          // this.countryFee = Math.floor(this.invoiceItems[0].amount);
          // this.localProcessingFee = Math.floor(this.invoiceItems[1].amount);
          if (
            this.selectedApplicationQuote.hasDiscountApplied &&
            this.selectedApplicationQuote.netAmount
          ) {
            this.totalProgramCost = this.selectedApplicationQuote.netAmount;
          }
          if (
            !this.selectedApplicationQuote.hasDiscountApplied &&
            this.selectedApplicationQuote.amount
          ) {
            this.totalProgramCost = this.selectedApplicationQuote.amount;
          }
        }
      });
  }

  getCurrencyCode(currencyCode: string): string {
    return currencyCode === 'USD' ? 'NGN' : currencyCode;
  }

  getTotalPayable(invoiceReceiptType: string): number {
    let total: number = 0;
    let exchangeRate;
    if (this.activeExchangeRateList) {
      exchangeRate = this.activeExchangeRateList.find((rate: any) => {
        return invoiceReceiptType === 'country'
          ? rate.baseCurrencyCode === 'USD' &&
              rate.variableCurrencyCode ===
                this.getCurrencyCode(this.selectedCurrency?.currencyCode)
          : rate.baseCurrencyCode ===
              this.getCurrencyCode(this.selectedCurrency?.currencyCode) &&
              rate.variableCurrencyCode === 'NGN';
      });
    }
    if (exchangeRate) {
      total =
        invoiceReceiptType === 'country'
          ? Math.floor(this.countryFee * exchangeRate.rate)
          : Math.floor(this.localProcessingFee / exchangeRate.rate);
    }
    return total;
  }

  buildCreateInvoiceForm() {
    this.createInvoiceForm = this.fb.group({
      useApplicantInvoiceCurrency: [true],
      nairaBankAccount: [null, [Validators.required]],
      secondBankAccount: [null],
      optionalThirdBankAccount: [null],
      // dollarBankAccount: [null],
      numOfBankAcounts: ['2'],
      // bankAccount: [null, [Validators.required]],
      invoiceCurrencyId: ['NGN', [Validators.required]],

      invoiceQuotationPercentage: [null, [Validators.required]],
      invoiceQuotationDescription: ['Country Fee', [Validators.required]],
      invoiceQuotationAmount: [null],

      localInvoiceQuotationPercentage: [null, [Validators.required]],
      localInvoiceQuotationDescription: [
        'Local Processing Fee',
        [Validators.required],
      ],
      localInvoiceQuotationAmount: [null],
    });
  }

  get createInvoiceFormControls() {
    return this.createInvoiceForm.controls;
  }

  getErrorMessage(instance: string) {
    // if (
    //   instance === 'nairaBankAccount' &&
    //   this.createInvoiceFormControls['nairaBankAccount'].hasError('required')
    // ) {
    //   return `This field is required`;
    // } else if (
    if (
      instance === 'invoiceQuotationPercentage' &&
      this.createInvoiceFormControls['invoiceQuotationPercentage'].hasError(
        'required'
      )
    ) {
      return `This field is required`;
    } else if (
      instance === 'invoiceQuotationDescription' &&
      this.createInvoiceFormControls['invoiceQuotationDescription'].hasError(
        'required'
      )
    ) {
      return `This field is required`;
    } else if (
      instance === 'localInvoiceQuotationPercentage' &&
      this.createInvoiceFormControls[
        'localInvoiceQuotationPercentage'
      ].hasError('required')
    ) {
      return `This field is required`;
    } else if (
      instance === 'localInvoiceQuotationDescription' &&
      this.createInvoiceFormControls[
        'localInvoiceQuotationDescription'
      ].hasError('required')
    ) {
      return `This field is required`;
    } else if (
      instance === 'invoiceCurrencyId' &&
      this.createInvoiceFormControls['invoiceCurrencyId'].hasError('required')
    ) {
      return `This field is required`;
    }
    // else if (
    //   instance === 'dollarBankAccount' &&
    //   this.createInvoiceFormControls['dollarBankAccount'].hasError('required')
    // ) {
    //   return `This field is required`;
    // }
    else {
      return;
    }
  }

  openSignatureModal() {
    this.dialog.open(SignatureModalComponent, {
      data: {
        action: (data: any) => {
          this.signature = data.signature;
          this.signaturePreview = data.signature;
        },
        type: 'invoice',
        userId: '',
      },
      disableClose: true,
    });
  }

  openSendToApplicantModal() {
    this.invoiceCreateMode = InvoiceCreateMode.sendMail;
    this.dialog.open(SendToApplicantModalComponent, {
      data: {
        action: (data: any = null) => {
          this.createInvoice(data);
        },
        type: 'invoice',
        applicant: this.applicant,
      },
      disableClose: true,
    });
  }

  onSubmit(mode: string) {
    if (this.createInvoiceForm.invalid) return;

    this.invoiceCreateMode =
      mode === 'download'
        ? InvoiceCreateMode.download
        : mode === 'create'
        ? InvoiceCreateMode.create
        : InvoiceCreateMode.sendMail;

    this.dialog.open(ShedulePaymentPlanDialogComponent, {
      data: {
        action: () => {
          this.createInvoice();
        },
        remainingPercentage: this.getInvoiceQuotation()[0].percentage ?? 0,
        applicationQuoteId: this.selectedApplicationQuote.id,
      },
      disableClose: true,
    });
  }

  createInvoice(additionalData: any = null) {
    delete this.createInvoiceForm.value.numOfBankAcounts;
    this.store.dispatch(
      InvoicesActions.createInvoiceLoading({ payload: true })
    );
    this.store.dispatch(
      InvoicesActions.createInvoiceSuccess({ payload: false })
    );

    const baseCurrency = this.currencyList.find(
      (curr) =>
        curr.currencyCode === this.selectedCountry?.currency?.currencyCode
    );

    const payload = {
      invoice: {
        requestId: generateUUID(),
        sendMail:
          this.invoiceCreateMode === InvoiceCreateMode.sendMail ? true : false,
        applicationQuoteId: this.selectedApplicationQuote.id,
        baseCurrencyId: baseCurrency.id,
        amount: this.totalPayable,
        // amount:
        //   this.selectedApplicationQuote.amount +
        //   (this.selectedMigrationRouteInvoiceItem?.localFeeAmount ?? 12500),
        useApplicantInvoiceCurrency:
          this.createInvoiceForm.value.useApplicantInvoiceCurrency,
        invoiceCurrencyId: this.invoiceCurrency ? this.invoiceCurrency.id : 2,
        invoiceAmount: this.invoiceAmount,
        exchangeRateId: this.selectedExchangeRate?.id, // exchange rate id
        rate: this.selectedExchangeRate?.rate, // exchange rate
        signature: this.signature,
        invoiceQuantity: this.familySize,
        optionalBankCurrency: this.optionalBankCurrency,
        invoiceDetails: this.getModifiedInvoiceDetails(),
        invoiceBankAccounts: this.getModifiedInvoiceBankAccounts(),
        invoiceQuotations: this.getInvoiceQuotation(),
      },
    };

    if (additionalData !== null) {
      payload.invoice = {
        ...payload.invoice,
        ...additionalData,
      };
    }

    if (this.invoiceCreateMode === InvoiceCreateMode.sendMail) {
      this.store.dispatch(GeneralActions.IsLoading({ payload: true }));
    }
    this.store.dispatch(InvoicesActions.createInvoice(payload));

    if (this.invoiceCreateMode === InvoiceCreateMode.download) {
      this.store
        .pipe(select(InvoicesSelector.getInvoiceQuotePDFURLS))
        .subscribe((res) => {
          const countryFeeInvoiceQuotePDFURL = res.countryFeeInvoiceQuotePDFURL;
          const localFeeInvoiceQuotePDFURL = res.localFeeInvoiceQuotePDFURL;
          const invoiceQuotePDFURL = res.invoiceQuotePDFURL;

          if (invoiceQuotePDFURL) {
            this.downloadInvoice(invoiceQuotePDFURL, 'invoice-quote');
          }
          if (countryFeeInvoiceQuotePDFURL) {
            this.downloadInvoice(countryFeeInvoiceQuotePDFURL, 'country-fee');
          }
          if (localFeeInvoiceQuotePDFURL) {
            this.downloadInvoice(
              localFeeInvoiceQuotePDFURL,
              'local-processing-fee'
            );
          }
        });
    }
    // this.downloadInvoice();
  }

  // download invoice
  downloadInvoice(invoiceUrl?: string, name: string = '') {
    if (invoiceUrl !== undefined) {
      fetch(invoiceUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download = this.applicant?.fullName + name ?? 'quote.pdf';

          document.body.appendChild(link);
          link.click();
          const notification: Notification = {
            state: 'success',
            message: 'Download successful',
          };
          this.notificationService.openSnackBar(
            notification,
            'opt-notification-success'
          );
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

  getModifiedInvoiceDetails() {
    const baseCurrency = this.currencyList.find(
      (curr) => curr.currencyCode === 'NGN'
    );

    return this.invoiceItems.map((item) => {
      return {
        name: item.name,
        description: item.name,

        invoiceItemDescription: item.name,
        invoiceItemName: item.name,

        baseCurrencyId: baseCurrency.id ?? 0,
        amount: item.amount,
        invoiceCurrencyId: this.invoiceCurrency ? this.invoiceCurrency.id : 2,
        invoiceAmount: item.amount,

        exchangeRateId: 20, // exchange rate
      };
    });
  }

  getBankCurrencyByCode(code: number = 0): string {
    let currency: string = '';
    currency = code === 0 ? 'NGN' : code === 1 ? 'USD' : 'EUR';
    return currency;
  }

  getModifiedInvoiceBankAccounts() {
    let banks: any = [];
    if (this.numOfBankAcounts === 1) {
      banks = [
        {
          name: this.createInvoiceForm.value.nairaBankAccount?.bankName,
          description: this.createInvoiceForm.value.nairaBankAccount?.bankName,
          bankAccountId: this.createInvoiceForm.value.nairaBankAccount?.id,
          bankCurrencyCode: this.getBankCurrencyByCode(
            this.createInvoiceForm.value.nairaBankAccount?.accountCurrencyType
          ),
        },
      ];
    }

    if (this.numOfBankAcounts === 2) {
      banks =
        this.programType === 1
          ? [
              {
                name: this.createInvoiceForm.value.nairaBankAccount?.bankName,
                description:
                  this.createInvoiceForm.value.nairaBankAccount?.bankName,
                bankAccountId:
                  this.createInvoiceForm.value.nairaBankAccount?.id,
                bankCurrencyCode: this.getBankCurrencyByCode(
                  this.createInvoiceForm.value.nairaBankAccount
                    ?.accountCurrencyType
                ),
              },
              {
                name: this.createInvoiceForm.value.secondBankAccount?.bankName,
                description:
                  this.createInvoiceForm.value.secondBankAccount?.bankName,
                bankAccountId:
                  this.createInvoiceForm.value.secondBankAccount?.id,
                bankCurrencyCode: this.getBankCurrencyByCode(
                  this.createInvoiceForm.value.secondBankAccount
                    ?.accountCurrencyType
                ),
              },
            ]
          : [
              {
                name: this.createInvoiceForm.value.nairaBankAccount?.bankName,
                description:
                  this.createInvoiceForm.value.nairaBankAccount?.bankName,
                bankAccountId:
                  this.createInvoiceForm.value.nairaBankAccount?.id,
                bankCurrencyCode: this.getBankCurrencyByCode(
                  this.createInvoiceForm.value.nairaBankAccount
                    ?.accountCurrencyType
                ),
              },
              {
                name: this.createInvoiceForm.value.optionalThirdBankAccount
                  ?.bankName,
                description:
                  this.createInvoiceForm.value.optionalThirdBankAccount
                    ?.bankName,
                bankAccountId:
                  this.createInvoiceForm.value.optionalThirdBankAccount?.id,
                bankCurrencyCode: this.getBankCurrencyByCode(
                  this.createInvoiceForm.value.optionalThirdBankAccount
                    ?.accountCurrencyType
                ),
              },
            ];
    }

    if (this.numOfBankAcounts === 3) {
      banks = [
        {
          name: this.createInvoiceForm.value.nairaBankAccount?.bankName,
          description: this.createInvoiceForm.value.nairaBankAccount?.bankName,
          bankAccountId: this.createInvoiceForm.value.nairaBankAccount?.id,
          bankCurrencyCode: this.getBankCurrencyByCode(
            this.createInvoiceForm.value.nairaBankAccount?.accountCurrencyType
          ),
        },
        {
          name: this.createInvoiceForm.value.secondBankAccount?.bankName,
          description: this.createInvoiceForm.value.secondBankAccount?.bankName,
          bankAccountId: this.createInvoiceForm.value.secondBankAccount?.id,
          bankCurrencyCode: this.getBankCurrencyByCode(
            this.createInvoiceForm.value.secondBankAccount?.accountCurrencyType
          ),
        },
        {
          name: this.createInvoiceForm.value.optionalThirdBankAccount?.bankName,
          description:
            this.createInvoiceForm.value.optionalThirdBankAccount?.bankName,
          bankAccountId:
            this.createInvoiceForm.value.optionalThirdBankAccount?.id,
          bankCurrencyCode: this.getBankCurrencyByCode(
            this.createInvoiceForm.value.optionalThirdBankAccount
              ?.accountCurrencyType
          ),
        },
      ];
    }

    return banks;
  }

  getInvoiceQuotation() {
    this.createInvoiceForm.controls['invoiceQuotationAmount'].enable();
    this.createInvoiceForm.controls['localInvoiceQuotationAmount'].enable();
    const quotationAmount = this.createInvoiceForm.value.invoiceQuotationAmount;
    const localQuotationAmount =
      this.createInvoiceForm.value.localInvoiceQuotationAmount;
    this.createInvoiceForm.controls['invoiceQuotationAmount'].disable();
    this.createInvoiceForm.controls['localInvoiceQuotationAmount'].disable();
    return [
      {
        percentage: this.createInvoiceForm.value.invoiceQuotationPercentage,
        itemDescription:
          this.createInvoiceForm.value.invoiceQuotationDescription,
        amount: Number(quotationAmount),
        feeCategory: 2,
        currencyCode: this.baseCurrencyCode,
      },
      {
        percentage:
          this.createInvoiceForm.value.localInvoiceQuotationPercentage,
        itemDescription:
          this.createInvoiceForm.value.localInvoiceQuotationDescription,
        amount: Number(localQuotationAmount),
        feeCategory: 1,
        currencyCode: 'NGN',
      },
    ];
  }

  getInvoiceCurrenciesByCountryId(countryId: number) {
    if (!countryId) return;
    this.store.dispatch(InvoiceCurrenciesAction.IsLoading({ payload: true }));

    this.store.dispatch(
      InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
        payload: {
          id: countryId,
        },
      })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(InvoiceCurrenciesSelector.getAllInvoiceCurrenciesByCountryId)
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.invoiceCurrencies = res.filter(
            (currency: any) => currency.status === 1
          );
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
          this.selectedCountry = res;
          this.programType = this.selectedCountry.programType;
          this.setBankOptions();
          this.setNumOfBanksArray(this.programType === ProgramType.CBI ? 2 : 3);
          this.formattedCurrencyList =
            this.numOfBankAcounts === 1
              ? this.currencyList
              : this.currencyList.filter((currency) =>
                  this.selectedCountry
                    ? currency.currencyCode ===
                      this.selectedCountry?.currency?.currencyCode
                    : currency.currencyCode !== 'NGN'
                );
        }
      });
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
          this.setSelectedExchangeRate();
        }
      });
  }

  getActiveExchangeRateById(id: number, type: string) {
    this.store.dispatch(
      CurrencyActions.GetExchangeRateById({ payload: { id } })
    );

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(CurrencySelector.getExchangeRateById)
      )
      .subscribe((resData: any) => {
        if (resData) {
          if (type === 'USD') {
            this.selectedExchangeRate = resData;
          }
          if (type === 'EUR') {
            this.selectedEuroExchangeRate = resData;
          }

          this.countryFeeInNGN =
            this.selectedExchangeRate.rate * this.countryFee;
          this.totalPayable = this.countryFeeInNGN + this.localProcessingFee;

          // Calculate EUR equivalent of the Dollar Amount.
          if (this.invoiceItems[0].currency === 'USD') {
            this.optionalBankAmount = this.calculateCurrencyEquivalent(
              this.countryFee,
              'USD',
              this.optionalBankCurrency
            );
          } else {
            this.optionalBankAmount = this.calculateCurrencyEquivalent(
              this.countryFee,
              this.optionalBankCurrency,
              'USD'
            );
          }
        }
      });
  }

  calculateCurrencyEquivalent(
    amount: number,
    baseCurrencyCode: string,
    variableCurrencyCode: string
  ): number {
    let convertedAmount: number = 0;
    if (this.activeExchangeRateList && this.activeExchangeRateList.length > 0) {
      const exchangeRate = this.activeExchangeRateList.find(
        (rate: any) =>
          rate.baseCurrencyCode === baseCurrencyCode &&
          rate.variableCurrencyCode === variableCurrencyCode
      );
      if (exchangeRate) {
        convertedAmount = exchangeRate.rate * amount;
      } else {
        const rate = this.activeExchangeRateList.find(
          (rate: any) =>
            rate.baseCurrencyCode === 'USD' &&
            rate.variableCurrencyCode === baseCurrencyCode
        );
        if (rate) {
          const preConvertedAmount = rate.rate * amount;
          const newRate = this.activeExchangeRateList.filter(
            (rate: any) =>
              rate.baseCurrencyCode === 'USD' &&
              rate.variableCurrencyCode === variableCurrencyCode
          );
          convertedAmount = newRate ? newRate.rate * preConvertedAmount : 0;
        }
      }
    }
    return convertedAmount;
  }

  calculateAmount() {
    this.createInvoiceForm.controls['invoiceQuotationAmount'].disable();
    this.createInvoiceForm
      ?.get('invoiceQuotationPercentage')
      ?.valueChanges.subscribe((value) => {
        const percentage = parseFloat(value) / 100;
        if (!isNaN(percentage)) {
          const amount = percentage * this.totalQuoteGenerated;
          this.createInvoiceForm.controls['invoiceQuotationAmount'].enable();
          this.createInvoiceForm
            ?.get('invoiceQuotationAmount')
            ?.setValue(amount.toFixed(2));
          this.createInvoiceForm.controls['invoiceQuotationAmount'].disable();
          this.countryFee = parseInt(amount.toFixed(2));

          if (this.selectedExchangeRate) {
            this.countryFeeInNGN =
              this.selectedExchangeRate.rate * this.countryFee;
            this.totalPayable = this.countryFeeInNGN + this.localProcessingFee;

            // Calculate EUR equivalent of the Dollar Amount.
            if (this.invoiceItems[0].currency === 'USD') {
              this.optionalBankAmount = this.calculateCurrencyEquivalent(
                this.countryFee,
                'USD',
                this.optionalBankCurrency
              );
            } else {
              this.optionalBankAmount = this.calculateCurrencyEquivalent(
                this.countryFee,
                this.optionalBankCurrency,
                'USD'
              );
            }
          } else {
            const xchangeRate = this.activeExchangeRateList.find(
              (xrate: any) =>
                xrate.baseCurrencyCode === this.invoiceItems[0].currency ||
                ('USD' && xrate.variableCurrencyCode === 'NGN')
            );
            this.selectedExchangeRate = xchangeRate;
            this.countryFeeInNGN = xchangeRate
              ? xchangeRate.rate * this.countryFee
              : this.defaultExchangeRate * this.countryFee;
            this.totalPayable = this.countryFeeInNGN + this.localProcessingFee;
          }
        }
      });
  }

  calculateLocalAmount() {
    this.createInvoiceForm.controls['localInvoiceQuotationAmount'].disable();
    this.createInvoiceForm
      ?.get('localInvoiceQuotationPercentage')
      ?.valueChanges.subscribe((value) => {
        const percentage = parseFloat(value) / 100;
        if (!isNaN(percentage)) {
          const amount = percentage * this.invoiceItems[1].amount;
          this.createInvoiceForm.controls[
            'localInvoiceQuotationAmount'
          ].enable();
          this.createInvoiceForm
            ?.get('localInvoiceQuotationAmount')
            ?.setValue(amount.toFixed(2));
          this.createInvoiceForm.controls[
            'localInvoiceQuotationAmount'
          ].disable();
          this.localProcessingFee = parseInt(amount.toFixed(2));
          this.totalPayable = this.countryFeeInNGN + this.localProcessingFee;
        }
      });
  }

  onNumOfBankAccountsChange() {
    const value = this.createInvoiceForm.value.numOfBankAcounts;

    if (value) {
      this.numOfBankAcounts = parseInt(value);
      this.setBankOptions();
      this.getActiveCurrency();

      if (this.numOfBankAcounts === 1) {
        this.createInvoiceForm
          .get('nairaBankAccount')
          ?.setValidators([Validators.required]);
      } else if (this.numOfBankAcounts === 2) {
        this.optionalBankOptions = this.getBankAccountByCurrencyCode(
          'EUR',
          this.selectedCountry
        );
        this.secondBankOptions = this.getBankAccountByCurrencyCode(
          'USD',
          this.selectedCountry
        );
        this.createInvoiceForm
          .get('nairaBankAccount')
          ?.setValidators([Validators.required]);
        if (this.programType === ProgramType.RBI) {
          this.createInvoiceForm
            .get('optionalBankAccount')
            ?.setValidators([Validators.required]);
          this.createInvoiceForm.get('optionalBankAccount')?.enable;
        } else {
          this.createInvoiceForm
            .get('secondBankAccount')
            ?.setValidators([Validators.required]);
          this.createInvoiceForm
            .get('optionalBankAccount')
            ?.setValidators(null);
        }
      } else {
        this.optionalBankOptions = this.getBankAccountByCurrencyCode(
          'EUR',
          this.selectedCountry
        );
        this.secondBankOptions = this.getBankAccountByCurrencyCode(
          'USD',
          this.selectedCountry
        );
        this.createInvoiceForm
          .get('nairaBankAccount')
          ?.setValidators([Validators.required]);
        this.createInvoiceForm
          .get('secondBankAccount')
          ?.setValidators([Validators.required]);
        this.createInvoiceForm
          .get('optionalBankAccount')
          ?.setValidators([Validators.required]);
      }
    }
  }

  onSecondAccountChange() {
    const { secondBankAccount } = this.createInvoiceForm.value;

    this.bankAccountDetails[0].secondBankValue = secondBankAccount.bankName;
    let bankAddress: string = '';
    let beneficiaryAddress = '';

    if (secondBankAccount.bankAddress_Building) {
      bankAddress += `${secondBankAccount.bankAddress_Building},`;
    }
    if (secondBankAccount.bankAddress_StreetNumber) {
      bankAddress += `${secondBankAccount.bankAddress_StreetNumber},`;
    }
    if (secondBankAccount.bankAddress_Area) {
      bankAddress += `${secondBankAccount.bankAddress_Area},`;
    }
    if (secondBankAccount.bankAddress_State) {
      bankAddress += `${secondBankAccount.bankAddress_State},`;
    }
    if (secondBankAccount.bankAddress_Country) {
      bankAddress += `${secondBankAccount.bankAddress_Country}.`;
    }

    if (secondBankAccount.beneficiaryAddress_Building) {
      beneficiaryAddress += `${secondBankAccount.beneficiaryAddress_Building},`;
    }
    if (secondBankAccount.beneficiaryAddress_StreetNumber) {
      beneficiaryAddress += `${secondBankAccount.beneficiaryAddress_StreetNumber},`;
    }
    if (secondBankAccount.beneficiaryAddress_Area) {
      beneficiaryAddress += `${secondBankAccount.beneficiaryAddress_Area},`;
    }
    if (secondBankAccount.beneficiaryAddress_State) {
      beneficiaryAddress += `${secondBankAccount.beneficiaryAddress_State},`;
    }
    if (secondBankAccount.beneficiaryAddress_Country) {
      beneficiaryAddress += `${secondBankAccount.beneficiaryAddress_Country}.`;
    }

    this.bankAccountDetails[1].secondBankValue = bankAddress;

    this.bankAccountDetails[2].secondBankValue = secondBankAccount.accountName;

    this.bankAccountDetails[3].secondBankValue =
      secondBankAccount.accountNumber;

    this.bankAccountDetails[4].secondBankValue = beneficiaryAddress;

    this.bankAccountDetails[5].secondBankValue = secondBankAccount.swiftCode;
  }

  onNairaAccountChange() {
    const { nairaBankAccount } = this.createInvoiceForm.value;
    this.bankAccountDetails[0].nairaValue = nairaBankAccount.bankName;

    let bankAddress: string = '';
    let beneficiaryAddress = '';

    if (nairaBankAccount.bankAddress_Building) {
      bankAddress += `${nairaBankAccount.bankAddress_Building},`;
    }
    if (nairaBankAccount.bankAddress_StreetNumber) {
      bankAddress += `${nairaBankAccount.bankAddress_StreetNumber},`;
    }
    if (nairaBankAccount.bankAddress_Area) {
      bankAddress += `${nairaBankAccount.bankAddress_Area},`;
    }
    if (nairaBankAccount.bankAddress_State) {
      bankAddress += `${nairaBankAccount.bankAddress_State},`;
    }
    if (nairaBankAccount.bankAddress_Country) {
      bankAddress += `${nairaBankAccount.bankAddress_Country}.`;
    }

    if (nairaBankAccount.beneficiaryAddress_Building) {
      beneficiaryAddress += `${nairaBankAccount.beneficiaryAddress_Building},`;
    }
    if (nairaBankAccount.beneficiaryAddress_StreetNumber) {
      beneficiaryAddress += `${nairaBankAccount.beneficiaryAddress_StreetNumber},`;
    }
    if (nairaBankAccount.beneficiaryAddress_Area) {
      beneficiaryAddress += `${nairaBankAccount.beneficiaryAddress_Area},`;
    }
    if (nairaBankAccount.beneficiaryAddress_State) {
      beneficiaryAddress += `${nairaBankAccount.beneficiaryAddress_State},`;
    }
    if (nairaBankAccount.beneficiaryAddress_Country) {
      beneficiaryAddress += `${nairaBankAccount.beneficiaryAddress_Country}.`;
    }

    this.bankAccountDetails[1].nairaValue = bankAddress;

    this.bankAccountDetails[2].nairaValue = nairaBankAccount.accountName;

    this.bankAccountDetails[3].nairaValue = nairaBankAccount.accountNumber;

    this.bankAccountDetails[4].nairaValue = beneficiaryAddress;

    this.bankAccountDetails[5].nairaValue = nairaBankAccount.swiftCode;
  }

  onOptionalAccountChange() {
    const { optionalThirdBankAccount } = this.createInvoiceForm.value;
    let bankAddress: string = '';
    let beneficiaryAddress = '';

    if (optionalThirdBankAccount.bankAddress_Building) {
      bankAddress += `${optionalThirdBankAccount.bankAddress_Building},`;
    }
    if (optionalThirdBankAccount.bankAddress_StreetNumber) {
      bankAddress += `${optionalThirdBankAccount.bankAddress_StreetNumber},`;
    }
    if (optionalThirdBankAccount.bankAddress_Area) {
      bankAddress += `${optionalThirdBankAccount.bankAddress_Area},`;
    }
    if (optionalThirdBankAccount.bankAddress_State) {
      bankAddress += `${optionalThirdBankAccount.bankAddress_State},`;
    }
    if (optionalThirdBankAccount.bankAddress_Country) {
      bankAddress += `${optionalThirdBankAccount.bankAddress_Country}.`;
    }

    if (optionalThirdBankAccount.beneficiaryAddress_Building) {
      beneficiaryAddress += `${optionalThirdBankAccount.beneficiaryAddress_Building},`;
    }
    if (optionalThirdBankAccount.beneficiaryAddress_StreetNumber) {
      beneficiaryAddress += `${optionalThirdBankAccount.beneficiaryAddress_StreetNumber},`;
    }
    if (optionalThirdBankAccount.beneficiaryAddress_Area) {
      beneficiaryAddress += `${optionalThirdBankAccount.beneficiaryAddress_Area},`;
    }
    if (optionalThirdBankAccount.beneficiaryAddress_State) {
      beneficiaryAddress += `${optionalThirdBankAccount.beneficiaryAddress_State},`;
    }
    if (optionalThirdBankAccount.beneficiaryAddress_Country) {
      beneficiaryAddress += `${optionalThirdBankAccount.beneficiaryAddress_Country}.`;
    }

    this.bankAccountDetails[0].optionalBankValue =
      optionalThirdBankAccount.bankName;

    this.bankAccountDetails[1].optionalBankValue = bankAddress;

    this.bankAccountDetails[3].optionalBankValue =
      optionalThirdBankAccount.accountName;

    this.bankAccountDetails[3].optionalBankValue =
      optionalThirdBankAccount.accountNumber;

    this.bankAccountDetails[4].optionalBankValue = beneficiaryAddress;

    this.bankAccountDetails[5].optionalBankValue =
      optionalThirdBankAccount.swiftCode;
  }

  onCurrencyChange() {
    if (!this.createInvoiceForm.value.invoiceCurrencyId) return;
    this.selectedCurrency = this.currencyList.find(
      (currency) =>
        currency.id === this.createInvoiceForm.value.invoiceCurrencyId
    );
    if (this.selectedCurrency) {
      this.store
        .pipe(
          takeUntil(this.unsubscribe$),
          select(DepartmentsSelector.getActiveBankAccounts)
        )
        .subscribe((resData: BankAccountInterface[]) => {
          if (resData !== null) {
            this.activeBankAccounts = resData.filter(
              (account: BankAccountInterface) => {
                if (this.selectedCurrency.currencyCode === 'NGN') {
                  return account.accountCurrencyType === 0;
                } else if (this.selectedCurrency.currencyCode === 'USD') {
                  return (
                    account.accountCurrencyType === 1 &&
                    account.countryId === this.selectedCountry.id
                  );
                } else {
                  return (
                    account.accountCurrencyType > 1 &&
                    account.countryId === this.selectedCountry.id
                  );
                }
              }
            );

            if (this.activeBankAccounts.length < 1) {
              this.notificationService.openSnackBar(
                {
                  state: 'error',
                  message: 'No bank account found for this currency',
                },
                'opt-notification-error'
              );
            }
          }
        });
    }

    // const filteredExchangeRates = this.activeExchangeRateList.filter(
    //   (exchangeRate: any) =>
    //     exchangeRate.baseCurrencyCode === this.baseCurrencyCode
    //   // exchangeRate.baseCurrencyId === this.selectedCountry.currency.id
    // );
    // this.selectedExchangeRate = filteredExchangeRates.find(
    //   (exchangeRate: any) =>
    //     exchangeRate.variableCurrencyId ===
    //     this.createInvoiceForm.value.invoiceCurrencyId
    // );

    // if (this.selectedExchangeRate) {
    //   this.createInvoiceFormControls['invoiceCurrencyId'].setErrors({
    //     incorrect: true,
    //   });
    // } else {
    //   this.createInvoiceFormControls['invoiceCurrencyId'].setErrors(null);
    // }
  }

  onCreateCurrencyConversion(exchangeRate: IExchangeRate) {
    const dialogRef = this.dialog.open(CreateCurrencyConversionComponent, {
      data: {
        exchangeRate,
        instance: 'update',
        patchValue: {
          baseCurrencyId: exchangeRate?.baseCurrencyId,
          variableCurrencyId: exchangeRate?.variableCurrencyId,
        },
      },
      disableClose: true,
      autoFocus: true,
      backdropClass: 'opt-dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      const exchangeRateId: number = exchangeRate.id;
      this.getActiveExchangeRateById(
        exchangeRateId,
        exchangeRate.baseCurrencyCode
      );
      this.getActiveExchangeRates();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
