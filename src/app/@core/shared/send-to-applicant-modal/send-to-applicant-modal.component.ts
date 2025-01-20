import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
// import * as ApplicationQuotesActions from 'src/app/@core/stores/applicationQuotes/applicationQuotes.actions';
import * as ApplicationQuotesSelector from 'src/app/@core/stores/applicationQuotes/applicationQuotes.selectors';
import * as GeneralSelector from 'src/app/@core/stores/general/general.selectors';
// import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';
import { IApplicant } from '../../interfaces/applicant.interface';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-send-to-applicant-modal',
  templateUrl: './send-to-applicant-modal.component.html',
  styleUrls: ['./send-to-applicant-modal.component.scss'],
})
export class SendToApplicantModalComponent implements OnInit {
  selectedApplicationQuote: any = {};
  isLoading!: Observable<boolean>;
  applicant!: IApplicant;
  type!: string;
  isSending: boolean = false;
  emailControl = new FormControl('');
  bccemailControl = new FormControl('');
  messageControl = new FormControl('');
  ccEmails: string[] = [];
  bccEmails: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SendToApplicantModalComponent>,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const notification: Notification = {
      message: 'Use comma or enter key to add your email',
      state: 'success',
    };
    this.notificationService.openSnackBar(
      notification,
      'opt-notification-success'
    );
    this.selectedApplicationQuote = this.data?.quoteData;
    this.isLoading = this.store.pipe(
      select(ApplicationQuotesSelector.getApplicationQuotesIsLoading)
    );
    this.store
      .pipe(select(GeneralSelector.getGeneralIsLoading))
      .subscribe((res) => (this.isSending = res));
    this.applicant = this.data?.applicant;
    this.type = this.data?.type;
  }

  addEmail(event: MatChipInputEvent, type: string): void {
    const value = (event.value || '').trim();

    if (value && this.isValidEmail(value)) {
      if (type === 'cc') {
        this.ccEmails.push(value);
        event.input!.value = '';
        this.emailControl.setValue(null);
      } else {
        this.bccEmails.push(value);
        event.input!.value = '';
        this.bccemailControl.setValue(null);
      }
    }
  }

  addBccEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.isValidEmail(value)) {
      this.bccEmails.push(value);
      event.input!.value = '';
    }
    this.bccemailControl.setValue(null);
  }

  addEmailFromInput(type: string): void {
    const value =
      type === 'cc'
        ? (this.emailControl.value || '').trim()
        : (this.bccemailControl.value || '').trim();

    if (value && this.isValidEmail(value)) {
      type === 'cc' ? this.ccEmails.push(value) : this.bccEmails.push(value);
    }

    type === 'cc'
      ? this.emailControl.setValue('')
      : this.bccemailControl.setValue('');
  }

  remove(email: string, type: string): void {
    let index: number = 0;
    if (type == 'cc') {
      index = this.ccEmails.indexOf(email);
    } else {
      index = this.bccEmails.indexOf(email);
    }

    if (index >= 0 && type == 'cc') {
      this.ccEmails.splice(index, 1);
    } else {
      this.bccEmails.splice(index, 1);
    }
  }

  isValidEmail(email: string): boolean {
    // Simple email validation check
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  sendQuote() {
    if (!this.data) {
      const notification: Notification = {
        state: 'warning',
        title: 'System Notification',
        message: "You're offline",
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
      return;
    }

    const sendMailPayload = {
      message: this.messageControl.value,
      cc: this.ccEmails,
      bcc: this.bccEmails,
    };

    this.data.action(sendMailPayload);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
