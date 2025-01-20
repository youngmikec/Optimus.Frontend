import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IApplicant } from 'src/app/@core/interfaces/applicant.interface';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import {
  ILoan,
  IPaymentDetail,
} from 'src/app/@core/models/quote-calculator.model';
import { NotificationService } from 'src/app/@core/services/notification.service';

@Component({
  selector: 'app-payment-receipt-dialog',
  templateUrl: './payment-receipt-dialog.component.html',
  styleUrls: ['./payment-receipt-dialog.component.scss'],
})
export class PaymentReceiptDialogComponent implements OnInit {
  dataSource: IPaymentDetail[] = [];
  localDataSource: any[] = [];
  applicationQuoteId!: number;
  totalCountryFee = 0;
  totalLocalFee = 12500;
  selectedApplicationQuote: any = {};
  selectedApplicant!: IApplicant;
  loan!: ILoan;
  paymentsScheduleHistory$!: Observable<IPaymentDetail[]>;
  totalPaid: number = 0;

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
  paymentReceiptDocUrl!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PaymentReceiptDialogComponent>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.selectedApplicationQuote = this.data?.quoteData;
    this.applicationQuoteId = this.data.applicationQuoteId;
    this.dataSource = this.data.paymentDetails;
    this.paymentsScheduleHistory$ = this.data.paymentHistory;
    this.selectedApplicant = this.data.selectedApplicant;
    this.selectedApplicationQuote = this.data.selectedApplicationQuote;
    this.loan = this.data.loan;

    this.paymentReceiptDocUrl = this.data.paymentReceiptDocUrl;

    this.getTotalPaid();

    this.localDataSource =
      this.selectedApplicationQuote?.applicationQuoteItems.filter(
        (item: any) => item.feeCategory === 1
      );

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
  }

  getTotalPaid() {
    if (this.paymentsScheduleHistory$) {
      this.paymentsScheduleHistory$.subscribe((res) => {
        this.totalPaid = res.reduce((acc, cur) => acc + cur.amountPaid, 0);
      });
    }
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
            `${this.selectedApplicant?.fullName}-payment-receipt` ??
            'payment-receipt.pdf';

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

  roundDownNumber(number: number) {
    return Math.floor(number);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
