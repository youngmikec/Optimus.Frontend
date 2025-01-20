import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import { formatPhoneNumber } from 'src/app/@core/utils/helpers';
// import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import {
  InvoicePaymentDetail,
  ISendEmailPayload,
} from 'src/app/@core/interfaces/invoicePaymentDetail.interface';
import { SendToApplicantModalComponent } from 'src/app/@core/shared/send-to-applicant-modal/send-to-applicant-modal.component';
import { IApplicationQuote } from 'src/app/@core/interfaces/quoteCalculator.interface';
import { IApplicant } from 'src/app/@core/interfaces/applicant.interface';
// import { sortArrayWithCondition } from 'src/app/@core/utils/helpers';

@Component({
  selector: 'app-invoice-receipt-dialog',
  templateUrl: './invoice-receipt-dialog.component.html',
  styleUrls: ['./invoice-receipt-dialog.component.scss'],
})
export class InvoiceReceiptDialogComponent implements OnInit {
  dataSource: any[] = [];
  localDataSource: any[] = [];
  selectedApplicationQuote!: IApplicationQuote;
  applicant!: IApplicant;
  totalCountryFee = 0;
  totalLocalFee = 12500;
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
  totalAmount: number = 0;
  paymentData!: InvoicePaymentDetail;
  isLoading!: Observable<boolean>;
  isSending!: Observable<boolean>;
  formatPhoneNumber = formatPhoneNumber;

  showLocalFee = true;
  showPaymentPlan = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<InvoiceReceiptDialogComponent>
  ) {}

  ngOnInit(): void {
    this.selectedApplicationQuote = this.data?.quoteData;
    this.applicant = this.data?.applicant;

    this.paymentData = this.data?.item;
    this.isLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
    this.isSending = this.store.pipe(
      select(InvoicesSelector.isInvoiceLoadingSelector)
    );
    //this.paymentData.paymentDetailsPDFUrl
    // this.dataSource =
    //   this.selectedApplicationQuote?.applicationQuoteItems.filter(
    //     (item: any) => item.feeCategory !== 1
    //   );
    // this.dataSource = sortArrayWithCondition(
    //   this.dataSource,
    //   'routeFeeSerialNumber'
    // );
    // this.totalCountryFee = 0;
    // this.dataSource.forEach((fee) => {
    //   this.totalCountryFee = this.totalCountryFee + fee.amount;
    // });

    // this.localDataSource =
    //   this.selectedApplicationQuote?.applicationQuoteItems.filter(
    //     (item: any) => item.feeCategory === 1
    //   );
  }

  roundDownNumber(number: number) {
    return Math.floor(number);
  }

  openSendToApplicantModal() {
    if (!this.paymentData.paymentDetailsPDFUrl) return;

    this.dialog.open(SendToApplicantModalComponent, {
      data: {
        action: (data: any = null) => {
          this.sendPdfToApplicant(data);
        },
        type: 'Payment Receipt',
        applicant: this.applicant,
      },
      disableClose: true,
    });
  }

  sendPdfToApplicant(data: ISendEmailPayload): void {
    this.store.dispatch(
      InvoicesActions.SetLoadingState({ payload: { isLoading: true } })
    );
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      InvoicesActions.SendInvoicePaymentToEmail({
        payload: {
          id: this.paymentData.id,
          applicationQuoteId: this.selectedApplicationQuote
            ? this.selectedApplicationQuote.id
            : 0,
          ...data,
        },
      })
    );
  }
  downloadPdf() {
    if (this.paymentData.paymentDetailsPDFUrl) {
      fetch(this.paymentData.paymentDetailsPDFUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download =
            this.selectedApplicationQuote?.application?.applicant?.name ??
            'quote.pdf';

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
    if (this.paymentData.paymentDetailsPDFUrl) {
      const link = document.createElement('a');
      link.href = this.paymentData.paymentDetailsPDFUrl;
      link.target = '_blank';
      link.download =
        this.selectedApplicationQuote?.application?.applicant?.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
