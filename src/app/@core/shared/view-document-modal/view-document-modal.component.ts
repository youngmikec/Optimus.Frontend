import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as InvoicesActions from 'src/app/@core/stores/invoices/invoices.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { IApplicationQuote } from '../../interfaces/quoteCalculator.interface';
import { SendToApplicantModalComponent } from '../send-to-applicant-modal/send-to-applicant-modal.component';
import { ISendEmailPayload } from '../../interfaces/invoicePaymentDetail.interface';

@Component({
  selector: 'app-view-document-modal',
  templateUrl: './view-document-modal.component.html',
  styleUrls: ['./view-document-modal.component.scss'],
})
export class ViewDocumentModalComponent implements OnInit {
  imageUrl!: string;
  fileType!: 'PDF' | 'IMAGE';
  pdfUrl!: string;
  isLoading!: Observable<boolean>;
  quoteData!: IApplicationQuote;
  entity: any;
  documentType!: 'invioce' | 'payment';
  isPdfLoading: boolean = true;
  applicant: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ViewDocumentModalComponent>
  ) {
    this.getFIleType();
  }

  ngOnInit(): void {
    this.pdfUrl = this.data.url;
    this.entity = this.data.entity;
    this.documentType = this.data.documentType;
    this.quoteData = this.data.applicationQuote;
    this.isLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
  }

  getFIleType() {
    const format = this.data?.url?.slice(-4);

    if (format === '.pdf') {
      this.fileType = 'PDF';
    } else {
      this.fileType = 'IMAGE';
    }
  }

  handleAfterLoading(): void {
    this.isPdfLoading = false;
  }

  sendPdfToApplicant(data: ISendEmailPayload): void {
    this.store.dispatch(ApplicationQuotesActions.IsLoading({ payload: true }));
    this.store.dispatch(
      InvoicesActions.SendInvoiceToEmail({
        payload: {
          id: this.entity.id,
          applicationQuoteId: this.quoteData.id,
          ...data,
        },
      })
    );
  }

  openSendToApplicantModal() {
    if (!this.pdfUrl) return;

    this.dialog.open(SendToApplicantModalComponent, {
      data: {
        action: (data: any = null) => {
          this.sendPdfToApplicant(data);
        },
        type: 'invoice',
        applicant: this.applicant,
      },
      disableClose: true,
    });
  }

  downloadPdf() {
    if (this.pdfUrl) {
      fetch(this.pdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download =
            this.quoteData?.application?.applicant?.name ?? 'quote.pdf';

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
    if (this.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.target = '_blank';
      link.download = this.quoteData?.application?.applicant?.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
