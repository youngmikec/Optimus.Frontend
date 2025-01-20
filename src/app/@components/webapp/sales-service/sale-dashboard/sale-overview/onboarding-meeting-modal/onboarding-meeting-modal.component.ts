import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, finalize } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import {
  OnboardingMeetingEnum,
  SalesService,
} from 'src/app/@core/stores/sale-service/sales-service.service';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';

export interface IGuest {
  guestUserId?: string;
  guestFirstName: string;
  guestLastName: string;
  guestUserEmail: string;
  isRequired: boolean;
}

@Component({
  selector: 'app-onboarding-meeting-modal',
  templateUrl: './onboarding-meeting-modal.component.html',
  styleUrls: ['./onboarding-meeting-modal.component.scss'],
})
export class OnboardingMeetingModalComponent implements OnInit, OnDestroy {
  public meetingForm!: FormGroup;
  public guestForm!: FormGroup;

  public minDate = new Date();

  public submitClicked: boolean = false;
  public DMSOfficer!: any;

  public buttonLoading!: Observable<boolean>;
  private subscription: Subscription = new Subscription();

  public showGuestForm: boolean = false;
  public guests: IGuest[] = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OnboardingMeetingModalComponent>,
    private store: Store<fromApp.AppState>,
    private datePipe: DatePipe,
    private salesService: SalesService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buttonLoading = this.store.select(
      GeneralSelectors.getGeneralIsLoading
    );

    this.buildCreateMeetingForm();
    if (this.data.officer) {
      this.DMSOfficer = this.data.officer?.mainOfficer[0];
      this.setDMSOfficer();
    }
  }

  buildCreateMeetingForm() {
    this.meetingForm = this.fb.group({
      title: this.fb.control(null, Validators.required),
      guests: this.fb.control([], Validators.required),
      startDate: this.fb.control(null, Validators.required),
      message: this.fb.control(null),
      location: this.fb.control(null, Validators.required),
    });

    this.guestForm = this.fb.group({
      guestFirstName: this.fb.control(null, Validators.required),
      guestLastName: this.fb.control(null, Validators.required),
      guestUserEmail: this.fb.control(null, Validators.required),
    });
  }

  get getMeetingFormControls() {
    return this.meetingForm.controls;
  }

  setDMSOfficer() {
    const { approvalName, approvalId, approvalEmail } = this.DMSOfficer;
    this.guests.push({
      guestUserId: approvalId,
      guestFirstName: approvalName.split(' ')[0],
      guestLastName: approvalName.split(' ')[1],
      guestUserEmail: approvalEmail,
      isRequired: true,
    });
  }

  saveGuest() {
    if (this.guestForm.invalid) return;

    const { guestFirstName, guestLastName, guestUserEmail } =
      this.guestForm.value;

    this.guests.push({
      guestFirstName,
      guestLastName,
      guestUserEmail,
      isRequired: true,
    });
    this.meetingForm.get('guests')?.setValue(this.guests);

    this.guestForm.reset();
    this.showGuestForm = false;
  }

  addGuest() {
    if (this.guests.length < 4) this.showGuestForm = true;
    else {
      const notification: Notification = {
        state: 'error',
        message: 'You cannot add more than 3 guest',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
    }
  }

  removeGuest(guest: IGuest): void {
    const index = this.guests.findIndex(
      (gst: IGuest) => gst.guestUserEmail === guest.guestUserEmail
    );
    if (index >= 0) this.guests.splice(index, 1);

    this.meetingForm.get('guests')?.setValue(this.guests);
  }

  formatDateTime(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss')!;
  }

  submit() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    const { title, guests, startDate, message, location } =
      this.meetingForm.value;

    const payload: OnboardingMeetingEnum = {
      applicationId: this.data.applicationId,
      title,
      meetingGuestRequests: guests,
      startDate: this.formatDateTime(startDate),
      message,
      location,
    };

    this.subscription.add(
      this.salesService
        .createOnBoardingMeetings(payload)
        .pipe(
          finalize(() =>
            this.store.dispatch(GeneralActions.IsLoading({ payload: false }))
          )
        )
        .subscribe({
          next: (resp: any) => {
            if (resp.succeeded)
              this.dialogRef.close({
                success: true,
                formValues: {
                  title,
                  startDate,
                },
              });
          },
        })
    );
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'startDate' &&
      this.getMeetingFormControls['startDate'].hasError('required')
    ) {
      return 'Please enter Start Date';
    } else if (
      instance === 'location' &&
      this.getMeetingFormControls['location'].hasError('required')
    ) {
      return 'Please enter Location';
    } else if (
      instance === 'guest' &&
      this.getMeetingFormControls['guest'].hasError('required')
    ) {
      return 'Please select guest';
    } else if (
      instance === 'title' &&
      this.getMeetingFormControls['title'].hasError('required')
    ) {
      return 'Please enter Title';
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
