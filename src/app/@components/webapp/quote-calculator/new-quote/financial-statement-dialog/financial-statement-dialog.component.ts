import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicantActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as ApplicantSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import * as QuoteCalculatorActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as QuoteCalculatorSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
import { IApplicant } from 'src/app/@core/interfaces/applicant.interface';
import { IPaymentDetail } from 'src/app/@core/models/quote-calculator.model';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
// import { sortArrayWithCondition } from 'src/app/@core/utils/helpers';

@Component({
  selector: 'app-financial-statement-dialog',
  templateUrl: './financial-statement-dialog.component.html',
  styleUrls: ['./financial-statement-dialog.component.scss'],
})
export class FinancialStatementDialogComponent
  implements OnInit, AfterViewInit
{
  dataSource: any[] = [];
  localDataSource: any[] = [];
  applicationQuoteId!: number;
  financialStateDocUrl!: string;
  selectedApplicationQuote: any = {};
  selectedApplicant!: IApplicant;
  paymentsScheduleHistory$!: Observable<IPaymentDetail[]>;

  totalAmountPaid: number = 0;
  totalToBePaid: number = 0;
  balanceDue: number = 0;
  applicantId!: number;
  invoiceLoanId!: number;

  fxRate: number = 594;
  totalCountryFee = 0;
  totalLocalFee = 12500;

  loading$!: Observable<boolean>;
  previewing: boolean = true;
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

  localFeePercentage = 0.5;
  countryFeePercentage = 0.2;

  showLocalFee = true;
  showPaymentPlan = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<FinancialStatementDialogComponent>
  ) {}

  ngOnInit(): void {
    this.applicantId = this.data.applicantId;
    this.applicationQuoteId = this.data.applicationQuoteId;
    this.dataSource = this.data.paymentDetails;
    this.selectedApplicationQuote = this.data.selectedApplicationQuote;
    this.invoiceLoanId = this.data.invoiceLoanId;

    this.getTotalPaid();
    this.getApplicantById();

    if (this.selectedApplicationQuote.applicationQuoteItems) {
      this.localDataSource =
        this.selectedApplicationQuote?.applicationQuoteItems.filter(
          (item: any) => item.feeCategory === 1
        );
    }

    if (!this.data.selectedMigrationRouteInvoiceItem) {
      this.totalLocalFee = 12500;
      this.localFeePercentage = 0.5;
      this.countryFeePercentage = 0.2;
    } else {
      this.totalLocalFee =
        this.data.selectedMigrationRouteInvoiceItem.localFeeAmount ?? 12500;
      this.localFeePercentage =
        this.data.selectedMigrationRouteInvoiceItem.percentageLocalFee / 100 ??
        0.5;
      this.countryFeePercentage =
        this.data.selectedMigrationRouteInvoiceItem.percentageCountryFee /
          100 ?? 0.2;

      this.showLocalFee =
        this.data.selectedMigrationRouteInvoiceItem.showLocalFee ?? true;
      this.showPaymentPlan =
        this.data.selectedMigrationRouteInvoiceItem.isPaymentPlan ?? true;
    }

    // this.generateFinancialStatementPdf();
  }

  ngAfterViewInit(): void {
    this.financialStateDocUrl = this.data.financialStateDocUrl;
    this.previewing = false;
  }

  getApplicantById(): void {
    if (!this.applicantId) return;
    this.store.dispatch(
      ApplicantActions.GetSingleApplicants({
        payload: { id: this.applicantId },
      })
    );

    this.store
      .pipe(select(ApplicantSelectors.getSingleApplicants))
      .subscribe((res) => {
        if (res) this.selectedApplicant = res;
      });
  }

  generateFinancialStatementPdf(): void {
    if (!this.applicationQuoteId) return;
    let payload: any;
    if (this.invoiceLoanId) {
      payload = {
        applicationQuoteId: this.applicationQuoteId,
        invoiceLoanId: this.invoiceLoanId,
      };
    } else {
      payload = { applicationQuoteId: this.applicationQuoteId };
    }

    this.store.dispatch(
      QuoteCalculatorActions.GenerateFinancialStatement(payload)
    );

    this.store
      .pipe(select(QuoteCalculatorSelectors.GetFinancialStatement))
      .subscribe((res) => {
        if (res) {
          this.financialStateDocUrl = res;
        }
      });
  }

  getTotalPaid() {
    if (this.paymentsScheduleHistory$) {
      this.paymentsScheduleHistory$.subscribe((res) => {
        this.totalAmountPaid = res.reduce(
          (acc, cur) => acc + cur.amountPaid,
          0
        );
      });
      this.totalToBePaid = this.totalLocalFee + this.totalCountryFee;
      this.balanceDue = this.totalToBePaid - this.totalAmountPaid;
    }
  }

  handleAfterLoading(): void {
    this.previewing = false;
  }

  onPdfViewProgress($event: any): void {
    this.previewing = true;
    if ($event.loaded === $event.total) {
      this.previewing = false;
    }
  }
  onPdfViewError($event: any): void {
    this.previewing = false;
    const notification: Notification = {
      state: 'warning',
      message: 'Failed To View Financial Statement. Pls Retry Again.',
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-error'
    );
  }

  roundDownNumber(number: number) {
    return Math.floor(number);
  }

  closeDialog() {
    this.dialogRef.close();
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
          link.download =
            `${this.selectedApplicant?.fullName}-financial-statement` ??
            'financial-statement.pdf';

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
}
