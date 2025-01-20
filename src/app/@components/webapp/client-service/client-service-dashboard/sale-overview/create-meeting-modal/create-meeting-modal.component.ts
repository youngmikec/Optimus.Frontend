import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Guest } from 'src/app/@core/interfaces/meetingGuest.interface';
import { Store, select } from '@ngrx/store';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as SaleServiceSelector from 'src/app/@core/stores/sale-service/sale-service.selectors';
import { Meeting } from 'src/app/@core/interfaces/meeting.interface';
import { DatePipe } from '@angular/common';

// import { Router } from '@angular/router';

@Component({
  selector: 'app-create-meeting-modal',
  templateUrl: './create-meeting-modal.component.html',
  styleUrls: ['./create-meeting-modal.component.scss'],
})
export class CreateMeetingModalComponent implements OnInit {
  meeting!: Meeting;
  meetingForm!: FormGroup;
  minDate = new Date(); // Set to today's date
  users: any[] = [];
  guest: Guest[] = [];
  submitClicked: boolean = false;
  selectedFile!: File;
  meetingTypeList: { name: string; value: string }[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl(null);
  optionalGuestCtrl = new FormControl(null);
  filteredUser!: Observable<any[]>;
  filteredUserOptional!: Observable<any[]>;
  requiredUserList: any[] = [];
  optionalUserList: any[] = [];
  formMode: string = 'create';

  fileInfo: { name: string | undefined; size: string | undefined } = {
    name: undefined,
    size: undefined,
  };

  buttonLoading!: Observable<boolean>;

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  @ViewChild('optionalInput')
  optionalGuestInput!: ElementRef<HTMLInputElement>;

  constructor(
    // private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateMeetingModalComponent>,
    private store: Store<fromApp.AppState>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterUsers();
  }

  ngOnInit(): void {
    this.buttonLoading = this.store.select(
      GeneralSelectors.getGeneralIsLoading
    );

    this.getMeetingTypes();
    this.getUsers();
    this.buildCreateMeetingForm();
    this.formMode =
      (this.data.formMode && this.data.formMode) !== 'create'
        ? 'edit'
        : 'create';

    if (this.meeting) {
      this.autofillForm();
    }
  }

  getMeetingTypes(): void {
    this.store.dispatch(SaleServiceActions.GetMeetingTypes());

    this.store
      .pipe(select(SaleServiceSelector.getAllMeetingTypes))
      .subscribe((res: any) => {
        if (res) {
          this.meetingTypeList = res.map((item: any) => ({
            name: item.name,
            value: item.value,
          }));
        }
      });
  }

  getUsers() {
    this.users = this.data.users;
    this.meeting = this.data.meeting || undefined;
  }

  get meetingFormControls() {
    return this.meetingForm.controls;
  }

  buildCreateMeetingForm() {
    this.meetingForm = this.fb.group({
      title: this.fb.control(null, Validators.required),
      guest: [null, Validators.required],
      optionalGuest: [null],
      meetingType: [null, Validators.required],
      startDate: this.fb.control(null, Validators.required),
      endDate: this.fb.control(null, Validators.required),
      attachment: [null],
      message: this.fb.control(null),
      location: this.fb.control(null, Validators.required),
      duration: this.fb.control(null, Validators.required),
    });
  }

  autofillForm() {
    if (this.meeting) {
      this.meeting.guests!.forEach((guest: Guest) => {
        if (guest.isRequired) {
          this.requiredUserList.push(guest.guestUserEmail);
        } else {
          this.optionalUserList.push(guest.guestUserEmail);
        }

        this.guest.push({
          guestUserId: guest.guestUserId,
          guestFirstName: guest.guestFirstName,
          guestLastName: guest.guestLastName,
          guestUserEmail: guest.guestUserEmail,
          isRequired: guest.isRequired,
        });

        this.users = this.users.filter((guests) => {
          return (
            guests.email.toLowerCase() !== guest.guestUserEmail.toLowerCase()
          );
        });

        this.filterUsers();
      });

      this.getMeetingFormControls['meetingType'].setValue(
        this.meeting.meetingType
      );
      this.getMeetingFormControls['guest'].setValue(this.requiredUserList);
      this.getMeetingFormControls['title'].setValue(this.meeting.title);
      this.getMeetingFormControls['startDate'].setValue(this.meeting.startDate);
      this.getMeetingFormControls['endDate'].setValue(this.meeting.endDate);
      this.getMeetingFormControls['location'].setValue(this.meeting.location);
      this.getMeetingFormControls['duration'].setValue(7); //  Hard Coded Till Api correction
      this.getMeetingFormControls['message'].setValue('Hard Coded'); //  Hard Coded Till Api correction
    }
  }

  get getMeetingFormControls() {
    return this.meetingForm.controls;
  }

  goToCreateNewInvoice() {
    this.dialogRef.close();
    // this.router.navigate(['/app/calculator/quote/quote-invoice/view']);
  }

  filterUsers() {
    this.filteredUser = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this._filter(user) : this.users.slice()
      )
    );

    // Optional Guest
    this.filteredUserOptional = this.optionalGuestCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this._filter(user) : this.users.slice()
      )
    );
  }

  addRequiredGuest(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add guest
    if (value) {
      this.requiredUserList.push(value);
      this.getMeetingFormControls['guest'].setValue(this.requiredUserList);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }

  addOptionalGuest(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add guest
    if (value) {
      this.optionalUserList.push(value);
      this.getMeetingFormControls['guest'].setValue(this.optionalUserList);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.optionalGuestCtrl.setValue(null);
  }

  removeRequiredGuest(user: string): void {
    const index = this.requiredUserList.indexOf(user);

    this.guest = this.guest.filter(
      (guest) => guest.guestUserEmail.toLowerCase() !== user.toLowerCase()
    );

    if (index >= 0) {
      this.requiredUserList.splice(index, 1);
      this.getMeetingFormControls['guest'].setValue(this.requiredUserList);

      // Push the removed user back to the users array
      const removedUser = (this.data.users as any[]).find(
        (guest) => guest.email.toLowerCase() === user.toLowerCase()
      );

      if (removedUser) {
        this.users.push(removedUser);
        this.filterUsers();
      }
    }
  }

  // Remove for optional field
  removeOptionalGuest(user: string): void {
    const index = this.optionalUserList.indexOf(user);

    this.guest = this.guest.filter(
      (guest) => guest.guestUserEmail.toLowerCase() !== user.toLowerCase()
    );

    if (index >= 0) {
      this.optionalUserList.splice(index, 1);
      this.getMeetingFormControls['optionalGuest'].setValue(
        this.optionalUserList
      );

      // Push the removed user back to the users array
      const removedUser = (this.data.users as any[]).find(
        (guest) => guest.email.toLowerCase() === user.toLowerCase()
      );

      if (removedUser) {
        this.users.push(removedUser);
        this.filterUsers();
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent, optional: boolean): void {
    const value = event.option.value;

    if (optional) {
      this.optionalUserList.push(event.option.viewValue);
      this.guest.push({
        guestUserId: value.userId,
        guestFirstName: value.firstName,
        guestLastName: value.lastName,
        guestUserEmail: value.email,
        isRequired: false,
      });
      this.optionalGuestInput.nativeElement.value = '';
      this.optionalGuestCtrl.setValue(null);
      this.getMeetingFormControls['optionalGuest'].setValue(
        this.optionalUserList
      );
    } else {
      this.requiredUserList.push(event.option.viewValue);
      this.guest.push({
        guestUserId: value.userId,
        guestFirstName: value.firstName,
        guestLastName: value.lastName,
        guestUserEmail: value.email,
        isRequired: true,
      });
      this.userInput.nativeElement.value = '';
      this.userCtrl.setValue(null);
      this.getMeetingFormControls['guest'].setValue(this.requiredUserList);
    }

    this.users = this.users.filter((guest) => {
      return guest.email.toLowerCase() !== value.email.toLowerCase();
    });

    this.filterUsers();
  }

  /** Uploading Files */
  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileInfo = {
        name: file.name,
        size: this.formatFileSize(file.size),
      };

      this.selectedFile = file;

      // Assign the file directly to the form control
      this.meetingForm.patchValue({
        attachment: file.name,
      });
    } else {
      this.fileInfo = { name: undefined, size: undefined };
    }
  }

  clearFile() {
    this.fileInfo = { name: undefined, size: undefined };
    // this.selectedFile = null;
    this.meetingForm.patchValue({
      attachment: null,
    });
  }

  submit() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.submitClicked = true;

    this.store.dispatch(
      SaleServiceActions.CreateMeeting({
        payload: {
          applicationId: this.data.applicationId,
          title: this.getMeetingFormControls['title'].value,
          startDate: this.formatDateTime(
            this.getMeetingFormControls['startDate'].value
          ),
          endDate: this.formatDateTime(
            this.getMeetingFormControls['endDate'].value
          ),
          location: this.getMeetingFormControls['location'].value,
          fileAttachment: this.selectedFile,
          meetingGuestRequests: this.guest,
        },
      })
    );
  }

  updateMeeting() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.submitClicked = true;

    this.store.dispatch(
      SaleServiceActions.UpdateMeeting({
        payload: {
          meetingId: this.meeting.meetingId,
          title: this.getMeetingFormControls['title'].value,
          startDate: this.formatDateTime(
            this.getMeetingFormControls['startDate'].value
          ),
          endDate: this.formatDateTime(
            this.getMeetingFormControls['endDate'].value
          ),
          location: this.getMeetingFormControls['location'].value,
          message: this.getMeetingFormControls['message'].value,
          fileAttachment: this.getMeetingFormControls['attachment'].value,
          meetingGuestRequests: this.guest,
        },
      })
    );
  }

  formatDateTime(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'email' &&
      this.getMeetingFormControls['email'].hasError('required')
    ) {
      return 'Please enter Domain name';
    } else if (
      instance === 'startDate' &&
      this.getMeetingFormControls['startDate'].hasError('required')
    ) {
      return 'Please enter Start Date';
    } else if (
      instance === 'endDate' &&
      this.getMeetingFormControls['endDate'].hasError('required')
    ) {
      return 'Please enter End Date';
    } else if (
      instance === 'location' &&
      this.getMeetingFormControls['location'].hasError('required')
    ) {
      return 'Please enter Location';
    } else if (
      instance === 'duration' &&
      this.getMeetingFormControls['duration'].hasError('required')
    ) {
      return 'Please enter Duration';
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

  private formatFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private _filter(value: any): string[] {
    // Check if value is a string
    if (typeof value !== 'string') {
      return [];
    }

    const filterValue = value.toLowerCase();

    return this.users.filter((user) =>
      user.email.toLowerCase().includes(filterValue)
    );
  }
}
