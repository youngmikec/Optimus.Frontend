import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
// import { Observable } from 'rxjs';

import {
  formatPhoneNumber,
  sortArrayWithCondition,
} from 'src/app/@core/utils/helpers';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as PaymentPlanActions from 'src/app/@core/stores/paymentPlan/paymentPlan.actions';
import * as PaymentPlanSelector from 'src/app/@core/stores/paymentPlan/paymentPlan.selectors';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import { ProgramType } from '../new-quote/quote-invoice/invoice/create-invoice/create-invoice.component';
import { select, Store } from '@ngrx/store';
import {
  IApplicationQuote,
  IApplicationQuoteItem,
} from 'src/app/@core/interfaces/quoteCalculator.interface';
import { InvoiceItem } from 'src/app/@core/models/invoice';
import { IPaymentPlan } from 'src/app/@core/models/payment-plan.model';

@Component({
  selector: 'app-quote-invoice-dialog',
  templateUrl: './quote-invoice-dialog.component.html',
  styleUrls: ['./quote-invoice-dialog.component.scss'],
})
export class QuoteInvoiceDialogComponent implements OnInit {
  dataSource: any[] = [];
  localDataSource: any[] = [];
  selectedCountry!: any;
  selectedApplicationQuote!: IApplicationQuote;
  totalCountryFee = 0;
  totalLocalFee = 12500;
  netTotalAmount: number = 0;
  locationList: any[] = [
    {
      title: 'Head Office:',
      one: '11th - 14th Floor,',
      two: 'Churchgate Towers 2,',
      three: 'Churchgate street,',
      four: 'Victoria Island, Lagos Nigeria',
    },
    {
      title: 'Abuja Office:',
      one: '8th Floor, World Trade Center,',
      two: '1008, 1113 Constitutional Ave.,',
      three: 'Central Business District,',
      four: 'Abuja, Nigeria',
    },
    {
      title: 'Lekki Office:',
      one: '3rd Floor, CAPPA House 1,',
      two: 'Udeco Medical Road,',
      three: 'Off Chevron Drive,',
      four: 'Lekki, Lagos Nigeria.',
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
      two: 'Westlands Avenue, Off',
      three: 'Rhapta Road, Westlands,',
      four: 'Nairobi Kenya.',
    },
  ];

  isLoading: boolean = true;

  formatPhoneNumber = formatPhoneNumber;
  localFeePercentage: number = 0.5;
  countryFeePercentage: number = 0.3;
  localFeePercentageDueOnCitizenship: number = 0.5;
  countryFeePercentageDueOnReceipt: number = 0.4;
  countryFeePercentageDueOnCitizenship: number = 0.3;

  showLocalFee = true;
  showPaymentPlan = true;
  selectedMigrationRouteInvoiceItem!: InvoiceItem;
  paymentPlans: IPaymentPlan[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<QuoteInvoiceDialogComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(select(PaymentPlanSelector.getPaymentPlansIsLoading))
      .subscribe((resData) => {
        this.isLoading = resData;
      });

    this.selectedApplicationQuote = this.data?.quoteData;
    if (this.selectedApplicationQuote.hasDiscountApplied) {
      this.calculateNetTotalQuoteAmount(this.selectedApplicationQuote);
    }

    // this.selectedCountry = this.selectedApplicationQuote?.application?.migrationRoute?.country;

    this.getCountryById(
      this.selectedApplicationQuote?.application?.migrationRoute?.countryId
    );
    this.getAllInvoiceItems(
      this.selectedApplicationQuote?.application?.migrationRoute?.countryId
    );

    this.dataSource =
      this.selectedApplicationQuote?.applicationQuoteItems.filter(
        (item: any) => item.feeCategory !== 1
      );

    this.dataSource = sortArrayWithCondition(
      this.dataSource,
      'routeFeeSerialNumber'
    );

    if (this.selectedCountry) {
      this.dataSource = this.cleanUpQuoteItems(this.dataSource);
    }

    this.localDataSource =
      this.selectedApplicationQuote?.applicationQuoteItems.filter(
        (item: any) => item.feeCategory === 1
      );

    this.computePaymentPlan();
  }

  calculateNetTotalQuoteAmount(quoteData: IApplicationQuote) {
    if (!quoteData) return;
    if (quoteData.discountTypeApplied === 1) {
      this.netTotalAmount = quoteData?.discountApplied
        ? quoteData.amount -
          (quoteData.discountApplied / 100) * quoteData.amount
        : 0;
    } else {
      this.netTotalAmount = quoteData?.discountApplied
        ? quoteData.amount - quoteData?.discountApplied
        : quoteData.amount - 0;
    }
  }

  getCountryById(countryId?: number) {
    if (!countryId) return;

    this.store.dispatch(
      CountriesActions.GetCountryById({
        payload: {
          id: countryId,
        },
      })
    );

    this.store
      .pipe(select(CountriesSelector.getCountryById))
      .subscribe((resData: any) => {
        if (resData) {
          this.selectedCountry = resData;
          this.manageAllPaymentPlans(this.selectedCountry.id);
        }
      });
  }

  getAllInvoiceItems(countryId: number) {
    this.store.dispatch(
      InvoiceItemConfigurationActions.IsLoading({ payload: false })
    );

    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItemsByCountryId({
        payload: {
          skip: 0,
          take: 10,
          countryId: countryId || this.selectedCountry.id,
        },
      })
    );

    this.store
      .pipe(select(invoiceItemCongurationSelectors.getInvoiceItemsByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.selectedMigrationRouteInvoiceItem = resData[0];
        }
      });
  }

  getAllPPaymentPlansByCountryId(countryId: number) {
    this.store.dispatch(PaymentPlanActions.IsLoading({ payload: true }));
    this.store.dispatch(
      PaymentPlanActions.GetAllPaymentPlanByCountryId({
        payload: { id: countryId, skip: 0, take: 100 },
      })
    );
  }

  manageAllPaymentPlans(countryId: number) {
    this.getAllPPaymentPlansByCountryId(countryId);

    this.store
      .pipe(select(PaymentPlanSelector.getAllInvoiceCurrenciesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.paymentPlans = resData
            .filter(
              (item: IPaymentPlan) =>
                item.status === 1 &&
                item.migrationRouteId ===
                  this.selectedApplicationQuote?.application?.migrationRoute?.id
            )
            .map((item: IPaymentPlan) => ({
              ...item,
              percentage: item.percentage / 100,
            }))
            .sort(
              (a: IPaymentPlan, b: IPaymentPlan) =>
                a.serialNumber - b.serialNumber
            );
        }
      });
  }

  cleanUpQuoteItems(quoteItems: IApplicationQuoteItem[]) {
    let newQuoteItems: IApplicationQuoteItem[] = [];
    if (this.selectedCountry.name === 'Antigua and Barbuda') {
      const exist = quoteItems.some(
        (item: IApplicationQuoteItem) =>
          item.name === `Antigua & Barbuda Gov't Processing Fee`
      );
      newQuoteItems = exist
        ? quoteItems.filter(
            (item: IApplicationQuoteItem) =>
              !(
                item.name === `Antigua & Barbuda Gov't Processing Fee` &&
                (item.amount === 0 || item.numberOfPeople >= 6)
              )
          )
        : quoteItems;
    } else {
      newQuoteItems = quoteItems;
    }
    newQuoteItems.forEach((fee) => {
      this.totalCountryFee = this.totalCountryFee + fee.amount;
    });
    return newQuoteItems;
  }

  computePaymentPlan() {
    if (
      this.selectedMigrationRouteInvoiceItem ||
      this.data.selectedMigrationRouteInvoiceItem
    ) {
      const invoiceItem =
        this.selectedMigrationRouteInvoiceItem ||
        this.data.selectedMigrationRouteInvoiceItem;
      this.totalLocalFee = invoiceItem.localFeeAmount ?? 570;
      this.localFeePercentage = invoiceItem.percentageLocalFee / 100 || 0.5;
      this.countryFeePercentage = invoiceItem.percentageCountryFee / 100 || 0.3;

      this.localFeePercentageDueOnCitizenship = 1 - this.localFeePercentage;

      if (
        this.selectedCountry &&
        this.selectedCountry.programType === ProgramType.RBI
      ) {
        this.countryFeePercentageDueOnReceipt =
          this.countryFeePercentage || 0.3; // 40 %
        this.countryFeePercentageDueOnCitizenship =
          1 - this.countryFeePercentageDueOnReceipt;
        this.localFeePercentageDueOnCitizenship = 1 - this.localFeePercentage;
      }

      if (
        this.selectedCountry &&
        this.selectedCountry.programType === ProgramType.CBI
      ) {
        // due on receipt
        this.countryFeePercentageDueOnReceipt = Number(
          (this.countryFeePercentage + 0.1).toFixed(2)
        ); // ie additional 10% to make up for 40%;
        // due on citizenship supposed to 30%
        this.countryFeePercentageDueOnCitizenship = Number(
          (
            1 -
            (this.countryFeePercentage + this.countryFeePercentageDueOnReceipt)
          ).toFixed(2)
        ); // 100% minus the addtion of 30% country fee and 40% country fee due on receipt.
      }

      this.showLocalFee = invoiceItem.showLocalFee || true;
      this.showPaymentPlan = invoiceItem.isPaymentPlan || true;
    } else {
      this.localFeePercentageDueOnCitizenship = 1 - this.localFeePercentage;
      if (
        this.selectedCountry &&
        this.selectedCountry.programType === ProgramType.RBI
      ) {
        this.countryFeePercentageDueOnReceipt =
          this.countryFeePercentage || 0.3; // 40 %
        this.countryFeePercentageDueOnCitizenship =
          1 - this.countryFeePercentageDueOnReceipt;
      } else {
        this.countryFeePercentageDueOnCitizenship =
          1 - this.countryFeePercentage;
      }
    }
  }

  calculateAmountByPlanType(plan: IPaymentPlan): number {
    let amount: number = 0;
    if (plan.feeCategoryDesc === 'CountryFee') {
      amount =
        plan.percentage > 0
          ? this.selectedApplicationQuote?.hasDiscountApplied
            ? this.netTotalAmount * plan.percentage
            : this.totalCountryFee * plan.percentage
          : this.selectedApplicationQuote?.hasDiscountApplied
          ? this.netTotalAmount
          : this.totalCountryFee;
    } else {
      amount =
        plan.percentage > 0
          ? this.totalLocalFee * plan.percentage
          : this.totalLocalFee;
    }
    return amount;
  }

  roundDownNumber(number: number) {
    return Math.floor(number);
  }

  roundUpNumber(number: number) {
    return number;
    // return Math.ceil(number);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
