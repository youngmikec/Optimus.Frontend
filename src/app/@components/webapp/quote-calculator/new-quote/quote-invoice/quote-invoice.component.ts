import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { QuoteTableInterface } from '../../quote-calculator.interface';
import { ActivatedRoute } from '@angular/router';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as invoiceItemsConfigurationSelector from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import { sortArrayWithCondition } from 'src/app/@core/utils/helpers';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';

interface QuestionResponse {
  id?: string;
  name: string;
  response: string;
}

@Component({
  selector: 'app-quote-invoice',
  templateUrl: './quote-invoice.component.html',
  styleUrls: ['./quote-invoice.component.scss'],
})
export class QuoteInvoiceComponent implements OnInit, OnDestroy {
  questionResponseList: QuestionResponse[] = [];
  applicationQuoteId!: number;
  isLoading!: Observable<boolean>;
  isCountryLoading!: Observable<boolean>;
  isInvoiceItemsLoading!: Observable<boolean>;
  getApplicationQuoteByIdSub!: Subscription;
  selectedApplicationQuote: any = {};
  selectedContry!: any;
  totalQuoteGenerated: number = 0;
  hasDiscountApplied = false;
  dataSource!: MatTableDataSource<QuoteTableInterface[]>;
  displayedColumns = ['fees', 'quantity', 'amount'];

  localFeeDataSource!: MatTableDataSource<any>;
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

  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {
    this.isLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
    this.isCountryLoading = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );
    this.isInvoiceItemsLoading = this.store.pipe(
      select(invoiceItemsConfigurationSelector.getInvoiceItemsIsLoading)
    );
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('applicationId')) {
      this.applicationQuoteId = parseInt(
        this.route.snapshot.paramMap.get('applicationId') || ''
      );

      this.getApplicationQuoteById();
    }
  }

  getApplicationQuoteById() {
    this.totalQuoteGenerated = 0;
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.applicationQuoteId,
        },
      })
    );

    this.getApplicationQuoteByIdSub = this.store
      .pipe(select(ApplicationQuotesSelector.getApplicationQuoteById))
      .subscribe((res: any) => {
        if (res !== null) {
          this.getCountryById(res?.application?.migrationRoute?.countryId);
          this.selectedApplicationQuote = res;

          const applicationQuoteItems =
            this.selectedApplicationQuote?.applicationQuoteItems.filter(
              (item: any) => item.feeCategory !== 1
            );

          this.dataSource = new MatTableDataSource(
            sortArrayWithCondition(
              applicationQuoteItems,
              'routeFeeSerialNumber'
            )
          );
          this.getAllInvoiceItems(res?.application?.migrationRoute?.countryId);

          this.totalQuoteGenerated = res?.hasDiscountApplied
            ? res?.netAmount
            : res?.amount;

          this.hasDiscountApplied = res?.hasDiscountApplied;
        }
      });
  }

  getAllInvoiceItems(countryId: number) {
    this.store.dispatch(
      InvoiceItemConfigurationActions.GetInvoiceItemsByCountryId({
        payload: {
          skip: 0,
          take: 10,
          countryId: countryId || this.selectedContry.id,
        },
      })
    );

    this.getApplicationQuoteByIdSub = this.store
      .pipe(select(invoiceItemCongurationSelectors.getInvoiceItemsByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          // const newInvoiceConfigArr: any[] = [];

          // const invoiceConfigList = resData;

          // invoiceConfigList.forEach((item: any) => {
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
            this.selectedMigrationRouteInvoiceItem?.localFeeAmount ?? 12500;

          this.localFeeDataSource = new MatTableDataSource(this.localFeeData);

          this.grandTotal =
            this.totalQuoteGenerated + this.localFeeData[0].amount;
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.store.dispatch(ApplicationQuotesActions.Clear());
    this.getApplicationQuoteByIdSub
      ? this.getApplicationQuoteByIdSub.unsubscribe()
      : null;
  }
}
