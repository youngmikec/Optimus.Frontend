import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as userSelectors from 'src/app/@core/stores/users/users.selectors';
import { Subscription } from 'rxjs';
import * as ApplicantsActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as applicantsSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-applications',
  templateUrl: './create-applications.component.html',
  styleUrls: ['./create-applications.component.scss'],
})
export class CreateApplicationsComponent implements OnInit, OnDestroy {
  applicantForm!: FormGroup;
  // genderEnums: String[] = ['male', 'female'];
  loggedInUser: any;
  user: any;
  userSub!: Subscription;
  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateApplicationsComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(applicantsSelectors.getApplicantsIsLoading)
    );

    this.buildapplicantForm();

    this.getUser();

    this.patchApplicantsForm();
  }

  getUser() {
    this.store.pipe(select(authSelectors.getUser)).subscribe((res) => {
      if (res !== null) {
        this.loggedInUser = res;
      }
    });

    this.store.dispatch(
      UserActions.GetUserById({
        payload: {
          userId: this.loggedInUser?.UserId,
          loggedInUser: this.loggedInUser?.loggedInUser,
        },
      })
    );

    this.userSub = this.store
      .pipe(select(userSelectors.getUserById))
      .subscribe((res) => {
        if (res !== null) {
          this.user = res;
        }
      });
  }

  buildapplicantForm() {
    this.applicantForm = this.fb.group({
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      mobileNo: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      physical_address: [null, [Validators.required]],
    });
  }

  get applicantFormControls() {
    return this.applicantForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'lastName' &&
      this.applicantFormControls['lastName'].hasError('required')
    ) {
      return `Please enter your last name`;
    } else if (
      instance === 'firstName' &&
      this.applicantFormControls['firstName'].hasError('required')
    ) {
      return `Please enter your first name`;
    } else if (
      instance === 'gender' &&
      this.applicantFormControls['gender'].hasError('required')
    ) {
      return `Please select your gender`;
    } else if (
      instance === 'email' &&
      this.applicantFormControls['email'].hasError('required')
    ) {
      return `Please enter your email address`;
    } else if (
      instance === 'email' &&
      this.applicantFormControls['email'].hasError('email')
    ) {
      return `Invalid email`;
    } else if (
      instance === 'mobileNo' &&
      this.applicantFormControls['mobileNo'].hasError('required')
    ) {
      return `Please enter your phone number`;
    } else if (
      instance === 'physical_address' &&
      this.applicantFormControls['physical_address'].hasError('required')
    ) {
      return `Please enter your physical address`;
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  patchApplicantsForm() {
    if (this.data?.instance === 'update') {
      this.applicantForm.patchValue({
        lastName: this.data.applicant.lastName,
        firstName: this.data.applicant.firstName,
        gender: this.data.applicant.gender,
        mobileNo: this.data.applicant.mobileNo,
        email: this.data.applicant.email,
        physical_address: this.data.applicant.address,
      });
    }
  }

  onSubmit() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    // this.store.dispatch(
    //   CurrencyActions.CreateCurrency({
    //     payload: {
    //       currency: this.applicantForm.value.currency,
    //     },
    //   })
    // );
    if (this.data?.instance === 'create') {
      this.createApplicant();
    } else if (this.data?.instance === 'update') {
      this.updateApplicant();
    }
  }

  createApplicant() {
    this.store.dispatch(
      ApplicantsActions.CreateApplicant({
        payload: {
          rmId: this.loggedInUser?.UserId,
          firstName: this.applicantForm.value.firstName,
          lastName: this.applicantForm.value.lastName,
          email: this.applicantForm.value.email,
          mobileNo: this.applicantForm.value.mobileNo,
          mobileNo2: '',
          gender: this.applicantForm.value.gender,
          maritalStatus: 1,
          address: this.applicantForm.value.physical_address,
          city: '',
          postalCode: '',
          state: '',
          country: '',
        },
      })
    );
  }

  updateApplicant() {
    this.store.dispatch(
      ApplicantsActions.UpdateApplicant({
        payload: {
          id: this.data.applicant.id,
          rmId: this.loggedInUser.UserId,
          firstName: this.applicantForm.value.firstName,
          lastName: this.applicantForm.value.lastName,
          email: this.applicantForm.value.email,
          mobileNo: this.applicantForm.value.mobileNo,
          mobileNo2: '',
          gender: this.applicantForm.value.gender,
          maritalStatus: 1,
          address: this.applicantForm.value.physical_address,
          city: '',
          postalCode: '',
          state: '',
          country: '',
        },
      })
    );
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
