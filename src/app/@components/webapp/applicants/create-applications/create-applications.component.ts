import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as userSelectors from 'src/app/@core/stores/users/users.selectors';
import {
  Subscription,
  map,
  Observable,
  Subject,
  ReplaySubject,
  takeUntil,
  take,
} from 'rxjs';
import * as ApplicantsActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as applicantsSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import { CountryCodeData } from '../../admin-settings/country-setup/country-setup.component';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-create-applications',
  templateUrl: './create-applications.component.html',
  styleUrls: ['./create-applications.component.scss'],
})
export class CreateApplicationsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  applicantForm!: FormGroup;
  loggedInUser: any;
  user: any;
  userSub!: Subscription;
  isLoading!: Observable<boolean>;

  allCountryCodes!: Observable<any[] | null>;
  allCountryCodesSub!: Subscription;
  allFilteredCountryCodes!: Observable<any[] | null>;

  getAllCountryCodeSub!: Subscription;
  countries: CountryCodeData[] = [];
  public filteredCountry: ReplaySubject<CountryCodeData[]> = new ReplaySubject<
    CountryCodeData[]
  >(1);

  public countryCtrl: FormControl = new FormControl(null);
  public countryFilterCtrl: FormControl = new FormControl('');
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();

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
    this.getCountryCodes();
    this.buildapplicantForm();

    this.getUser();

    this.patchApplicantsForm();

    // listen for search field value changes
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountry();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
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

  getCountryCodes() {
    this.store.dispatch(GeneralActions.GetCountryCodes());

    this.allCountryCodes = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );
    this.allFilteredCountryCodes = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );

    this.getAllCountryCodeSub = this.store
      .pipe(select(generalSelectors.getAllCountryCodes))
      .subscribe((res: any) => {
        if (res) {
          this.countries = res;
          this.filteredCountry.next(this.countries.slice());
        }
      });
  }

  onFilterCountryCode(event: any) {
    const inputValue = event.toLowerCase();

    this.allFilteredCountryCodes = this.allCountryCodes.pipe(
      map((arr: any) => {
        const result = arr.filter((countryCode: any) => {
          return (
            countryCode?.dialCode
              ?.toLowerCase()
              .substring(0, 4)
              .includes(inputValue.toLowerCase()) ||
            countryCode?.name
              ?.toLowerCase()
              .substring(0, 5)
              .includes(inputValue.toLowerCase())
          );
        });

        return result;
      })
    );
  }

  buildapplicantForm() {
    this.applicantForm = this.fb.group({
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      countryCode: [null],
      mobileNo: [
        null,
        [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
      ],
      email: [null, [Validators.required, Validators.email]],
      physical_address: [''],

      countryCode2: [null],
      mobileNo2: [null, [Validators.pattern('^[+0-9]{7,15}$')]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [''],

      area: [null],
      street: [null],
      building: [null],
      postalCode: [null],
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
      return `Enter your last name`;
    } else if (
      instance === 'firstName' &&
      this.applicantFormControls['firstName'].hasError('required')
    ) {
      return `Enter your first name`;
    } else if (
      instance === 'gender' &&
      this.applicantFormControls['gender'].hasError('required')
    ) {
      return `Select your gender`;
    } else if (
      instance === 'email' &&
      this.applicantFormControls['email'].hasError('required')
    ) {
      return `Enter your email address`;
    } else if (
      instance === 'email' &&
      this.applicantFormControls['email'].hasError('email')
    ) {
      return `Invalid email`;
    } else if (
      instance === 'mobileNo' &&
      this.applicantFormControls['mobileNo'].hasError('required')
    ) {
      return `Enter your phone number`;
    } else if (
      instance === 'mobileNo' &&
      this.applicantFormControls['mobileNo'].hasError('minLength')
    ) {
      return `Invalid phone number`;
    } else if (
      instance === 'mobileNo' &&
      this.applicantFormControls['mobileNo'].hasError('pattern')
    ) {
      return `Invalid phone number`;
    } else if (
      instance === 'physical_address' &&
      this.applicantFormControls['physical_address'].hasError('required')
    ) {
      return `Enter your physical address`;
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

        mobileNo2: this.data.applicant.mobileNo2,
        country: this.data.applicant.country,
        state: this.data.applicant.state,
        city: this.data.applicant.city,

        area: this.data.applicant.area,
        street: this.data.applicant.street,
        building: this.data.applicant.building,
        postalCode: this.data.applicant.postalCode,
        countryCode: this.data.applicant.countryCode,
        countryCode2: this.data.applicant.countryCode2,
      });
    }
  }

  onSubmit() {
    if (this.applicantForm.invalid) {
      return;
    } else {
      this.store.dispatch(ApplicantsActions.IsLoading({ payload: true }));

      if (this.data?.instance === 'create') {
        this.createApplicant();
      } else if (this.data?.instance === 'update') {
        this.updateApplicant();
      }
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
          mobileNo2: this.applicantForm.value.mobileNo2,
          gender: this.applicantForm.value.gender,
          maritalStatus: 0,

          country: this.applicantForm.value.country,
          city: this.applicantForm.value.city,
          state: this.applicantForm.value.state,

          countryCode: this.applicantForm.value.countryCode,
          countryCode2: this.applicantForm.value.countryCode2,
          area: this.applicantForm.value.area,
          street: this.applicantForm.value.street,
          building: this.applicantForm.value.building,

          address: this.applicantForm.value.physical_address,
          postalCode: this.applicantForm.value.postalCode,
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
          mobileNo2: this.applicantForm.value.mobileNo2,
          gender: this.applicantForm.value.gender,
          maritalStatus: 1,

          country: this.applicantForm.value.country,
          state: this.applicantForm.value.state,
          city: this.applicantForm.value.city,
          postalCode: '',

          countryCode: this.applicantForm.value.countryCode,
          countryCode2: this.applicantForm.value.countryCode2,
          area: this.applicantForm.value.area,
          street: this.applicantForm.value.street,
          building: this.applicantForm.value.building,

          address: this.applicantForm.value.physical_address,
        },
      })
    );
  }

  protected setInitialValue() {
    this.filteredCountry
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (
          a: CountryCodeData,
          b: CountryCodeData
        ) => a && b && a === b;
      });
  }

  protected filterCountry() {
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountry.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountry.next(
      this.countries.filter((x) => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
