import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { QuoteInvoiceDialogComponent } from '../../quote-invoice-dialog/quote-invoice-dialog.component';
import { ProceedToPaymentModalComponent } from '../proceed-to-payment-modal/proceed-to-payment-modal.component';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import { ConfirmQuoteComponent } from '../confirm-quote/confirm-quote.component';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { PaymentPlansData } from '../../../admin-settings/country-setup/country-dashboard/payment-plan/payment-plan.component';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemCongurationSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import { SendToApplicantModalComponent } from 'src/app/@core/shared/send-to-applicant-modal/send-to-applicant-modal.component';

@Component({
  selector: 'app-quote-topbar',
  templateUrl: './quote-topbar.component.html',
  styleUrls: ['./quote-topbar.component.scss'],
})
export class QuoteTopbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() showResend: boolean = false;
  @Input() isQuotePreviewAvailable: boolean = false;
  @Input() selectedCountry!: any;
  @Input() selectedApplicationQuote!: any;
  @Input() refreshData: boolean = false;

  quoteData!: any | null;
  getApplicationQuoteSub!: Subscription;
  getApplicationQuoteByIdSub!: Subscription;
  isLoading!: Observable<boolean>;

  paymentPlanByCountryList!: PaymentPlansData[];
  getAllPaymentPlansSub!: Subscription;
  applicationQuoteId!: number;
  deviceWidth: number = window.innerWidth;

  selectedMigrationRouteInvoiceItem!: any | null;

  constructor(
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.isLoading = this.store.pipe(
    //   select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    // )

    this.isLoading = this.store.pipe(
      select(GeneralSelectors.getGeneralIsLoading)
    );

    if (this.route.snapshot.paramMap.get('applicationId')) {
      this.applicationQuoteId = parseInt(
        this.route.snapshot.paramMap.get('applicationId') || ''
      );
    }

    if (this.refreshData && this.selectedApplicationQuote) {
      this.getAllInvoiceItems(this.selectedCountry.id);
    }

    this.getQuoteDataById();
    if (this.showResend === true) {
      this.getQuoteDataById();
    } else {
      this.getQuoteData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedApplicationQuote']) {
      const currentQuoteValue =
        changes['selectedApplicationQuote'].currentValue;
      const refreshValue = changes['refreshData'].currentValue;

      if (refreshValue && currentQuoteValue) {
        this.quoteData = currentQuoteValue;
        this.selectedCountry =
          currentQuoteValue.application.migrationRoute.country;
        this.getAllInvoiceItems(
          currentQuoteValue.application.migrationRoute.countryId
        );
      }

      // Perform an action on change
    }
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event) {
    this.deviceWidth = (event.target as Window).innerWidth;
  }

  goBack() {
    history.back();
  }

  getQuoteData() {
    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.applicationQuoteId,
        },
      })
    );

    this.store
      .pipe(select(ApplicationQuotesSelector.getCreatedApplicationResponse))
      .subscribe((resData: any) => {
        if (resData) {
          this.quoteData = resData;
          this.getAllInvoiceItems(
            this.quoteData?.application?.migrationRoute?.countryId
          );
        }
      });
  }

  getQuoteDataById() {
    this.store.dispatch(
      ApplicationQuotesActions.GetApplicationQuoteById({
        payload: {
          id: this.applicationQuoteId,
        },
      })
    );

    this.getApplicationQuoteByIdSub = this.store
      .pipe(select(ApplicationQuotesSelector.getApplicationQuoteById))
      .subscribe((resData: any) => {
        if (resData) {
          this.quoteData = resData;

          this.getAllInvoiceItems(
            this.quoteData?.application?.migrationRoute?.countryId
          );
        }
      });
  }

  decideDialogWidth(width: number): string {
    let response: string = '65%';
    if (width >= 1300) {
      response = '65%';
    } else if (width >= 1000 && width < 1300) {
      response = '75%';
    } else if (width >= 800 && width < 1000) {
      response = '85%';
    } else if (width >= 450 && width < 800) {
      response = '95%';
    } else {
      response = '98%';
    }
    return response;
  }

  openInvoiceDialog() {
    if (this.isQuotePreviewAvailable === false) return;
    const dialogWidth: string = this.decideDialogWidth(this.deviceWidth);
    this.dialog.open(QuoteInvoiceDialogComponent, {
      width: dialogWidth,
      height: '100vh',
      position: {
        right: '0',
        top: '0',
      },
      data: {
        quoteData: this.quoteData,
        country: this.selectedCountry,
        selectedMigrationRouteInvoiceItem:
          this.selectedMigrationRouteInvoiceItem,
        selectedCurrency: this.selectedCountry?.currency,
      },
    });
  }

  sendApplicationQuoteToEmail(data: any): void {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      ApplicationQuotesActions.SendApplicationQuotesToEmail({
        payload: {
          id: this.quoteData.id,
          ...data,
        },
      })
    );
  }

  openSendToApplicantModal() {
    if (!this.isQuotePreviewAvailable) return;
    // this.invoiceCreateMode = InvoiceCreateMode.sendMail;
    this.dialog.open(SendToApplicantModalComponent, {
      data: {
        action: (data: any = null) => {
          this.sendApplicationQuoteToEmail(data);
        },
        type: 'quote',
        applicant: this.quoteData?.application?.applicant,
      },
      disableClose: true,
    });
  }

  openProceedToPaymentModal() {
    if (this.isQuotePreviewAvailable === false) return;
    this.dialog.open(ProceedToPaymentModalComponent, {
      data: {
        countryFeeAmount: this.quoteData.hasDiscountApplied
          ? this.quoteData.netAmount
          : this.quoteData?.amount,
        // countryFeeAmount:
        //   this.quoteData?.amount *
        //   ((this.selectedMigrationRouteInvoiceItem?.percentageCountryFee ??
        //     20) /
        //     100),
        // localFeeAmount:
        //   this.selectedMigrationRouteInvoiceItem?.localFeeAmount *
        //   ((this.selectedMigrationRouteInvoiceItem?.percentageLocalFee ?? 50) /
        //     100),
        localFeeAmount: this.selectedMigrationRouteInvoiceItem?.localFeeAmount,
        localFeeCurrency:
          this.selectedMigrationRouteInvoiceItem?.localCurrencyCode ?? 'NGN',
        applicationQuoteId: this.applicationQuoteId,
        applicationId: this.quoteData?.application?.id,
        country: {
          id: this.quoteData?.application?.migrationRoute?.countryId,
          name: this.quoteData?.application?.migrationRoute?.countryName,
        },
        view: 'readyToBuy',
        selectedCurrency: this.selectedCountry.currency,
        hasDiscountApplied: this.quoteData?.hasDiscountApplied,
        discountAppliedMessage: this.quoteData?.discountAppliedMessage,
        netAmount: this.quoteData?.netAmount,
      },
    });
  }

  confirmQuote() {
    this.dialog.open(ConfirmQuoteComponent, {
      data: {
        quoteData: this.quoteData,
      },
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

    this.getApplicationQuoteByIdSub = this.store
      .pipe(select(invoiceItemCongurationSelectors.getInvoiceItemsByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          // const newInvoiceConfigArr: any[] = [];

          // // const invoiceConfigList = resData.pageItems.filter(
          // //   (invoiceItem: any) =>
          // //     invoiceItem?.countryId ===
          // //     this.quoteData?.application?.migrationRoute?.countryId
          // // );

          // resData.pageItems.forEach((item: any) => {
          //   if (
          //     item.migrationRouteId ===
          //     this.quoteData?.application?.migrationRoute?.id
          //   ) {
          //     newInvoiceConfigArr.push(item);
          //     this.selectedMigrationRouteInvoiceItem = item;
          //   } else if (item.allMigrationRoute) {
          //     newInvoiceConfigArr.push(item);
          //   }
          // });

          this.selectedMigrationRouteInvoiceItem = resData[0];
        }
      });
  }

  downloadPdf() {
    if (this.quoteData.fileUrl) {
      fetch(this.quoteData?.fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download =
            this.quoteData?.application?.applicant?.fullName ?? 'quote.pdf';

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

  printPdf() {
    if (this.quoteData.fileUrl) {
      const link = document.createElement('a');
      link.href = this.quoteData.fileUrl;
      link.target = '_blank';
      link.download = this.quoteData?.application?.applicant?.fullName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  goToCreateNewInvoice() {
    this.router.navigate([
      `app/calculator/quote/quote-invoice/${this.quoteData.id}/view`,
    ]);
  }

  ngOnDestroy(): void {
    if (this.getApplicationQuoteSub) {
      this.getApplicationQuoteSub.unsubscribe();
    }
    if (this.getApplicationQuoteByIdSub) {
      this.getApplicationQuoteByIdSub.unsubscribe();
    }
  }
}
