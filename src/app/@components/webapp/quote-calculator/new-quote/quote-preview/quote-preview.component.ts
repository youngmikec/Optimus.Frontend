import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteTableInterface } from '../../quote-calculator.interface';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as QuoteCalculatorSelector from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import { QuoteQuestionInterface } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { sortArrayWithCondition } from 'src/app/@core/utils/helpers';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';

@Component({
  selector: 'app-quote-preview',
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss'],
})
export class QuotePreviewComponent implements OnInit, OnDestroy {
  @Input() isQuotePreviewAvailable: boolean = false;
  @Input() selectedCountry!: any;
  dataSource: MatTableDataSource<QuoteTableInterface[]> | null = null;
  localFeeDataSource: MatTableDataSource<any> | null = null;
  displayedColumns = ['routeFeeName', 'unit', 'totalAmount'];
  getApplicationQuoteSub!: Subscription;
  totalQuoteGenerated: number = 0;
  quoteCalculatorQuestionsAndAnswers$!: Observable<
    QuoteQuestionInterface[] | null
  >;
  localFeeData = [
    {
      routeFeeName: 'Local Processing Fee',
      amount: 0,
      name: 'Local Processing Fee',
      description: 'Local Processing Fee',
    },
  ];
  grandTotal = 0;

  selectedMigrationRouteInvoiceItem!: any | null;
  selectedApplicationQuote: any = {};

  constructor(private store: Store<fromApp.AppState>) {
    this.quoteCalculatorQuestionsAndAnswers$ = this.store.pipe(
      select(QuoteCalculatorSelector.getAllQuoteQuestions)
    );
  }

  ngOnInit(): void {
    this.getQuoteData();
  }

  getQuoteData() {
    this.totalQuoteGenerated = 0;
    this.getApplicationQuoteSub = this.store
      .pipe(select(ApplicationQuotesSelector.getCreatedApplicationResponse))
      .subscribe((resData: any) => {
        if (resData) {
          this.selectedApplicationQuote = resData;

          const applicationQuoteItems = resData?.applicationQuoteItems.filter(
            (item: any) => item.feeCategory !== 1
          );

          this.dataSource = new MatTableDataSource(
            sortArrayWithCondition(
              applicationQuoteItems,
              'routeFeeSerialNumber'
            )
          );

          this.totalQuoteGenerated = resData.hasDiscountApplied
            ? resData.netAmount
            : resData?.amount;
          this.getAllInvoiceItems(
            this.selectedApplicationQuote?.application?.migrationRoute
              ?.countryId
          );
        }
      });
  }

  getAllInvoiceItems(countryId: number) {
    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItemsByCountryId({
        payload: {
          skip: 0,
          take: 10,
          countryId:
            countryId ||
            this.selectedApplicationQuote?.application?.migrationRoute
              ?.countryId,
        },
      })
    );

    this.getApplicationQuoteSub = this.store
      .pipe(select(invoiceItemCongurationSelectors.getInvoiceItemsByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          // const newInvoiceConfigArr: any[] = [];

          // // const invoiceConfigList = resData.pageItems.filter(
          // //   (invoiceItem: any) =>
          // //     invoiceItem?.countryId ===
          // //     this.selectedApplicationQuote?.application?.migrationRoute
          // //       ?.countryId
          // // );

          // resData.forEach((item: any) => {
          //   if (
          //     item.migrationRouteId ===
          //     this.selectedApplicationQuote?.application?.migrationRoute?.id
          //   ) {
          //     newInvoiceConfigArr.push(item);
          //   } else if (item.allMigrationRoute) {
          //     newInvoiceConfigArr.push(item);
          //   }
          // });

          this.selectedMigrationRouteInvoiceItem = resData[0];

          this.localFeeData[0].amount =
            this.selectedMigrationRouteInvoiceItem.localFeeAmount ?? 12500;

          this.localFeeDataSource = new MatTableDataSource(this.localFeeData);

          this.grandTotal =
            this.totalQuoteGenerated + this.localFeeData[0].amount;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getApplicationQuoteSub) {
      this.getApplicationQuoteSub.unsubscribe();
    }
  }
}
