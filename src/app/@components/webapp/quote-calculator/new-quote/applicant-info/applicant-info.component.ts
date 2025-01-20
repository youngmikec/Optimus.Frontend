import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, ReplaySubject, startWith, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as ApplicantsActions from 'src/app/@core/stores/applicants/applicants.actions';
import * as applicantsSelectors from 'src/app/@core/stores/applicants/applicants.selectors';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import { CountryCodeData } from '../../../admin-settings/country-setup/country-setup.component';

@Component({
  selector: 'app-applicant-info',
  templateUrl: './applicant-info.component.html',
  styleUrls: ['./applicant-info.component.scss'],
})
export class ApplicantInfoComponent implements OnInit, OnDestroy {
  @Input() isFormBuilder: boolean = false;
  newApplicantForm!: FormGroup;
  getAllApplicantsSub!: Subscription;
  getSingleApplicantsSub!: Subscription;
  createdApplicantSub!: Subscription;
  applicantList: any[] = [];
  selectedApplicant: any = {};
  singleApplicant: any = {};
  createdApplicant: any = {};
  loading: boolean = false;
  filteredIdOptions!: Observable<any[]>;
  filteredPhoneOptions!: Observable<any[]>;
  filteredEmailOptions!: Observable<any[]>;
  newApplicant: boolean = false;
  loggedInUser!: any;
  isLoading!: Observable<boolean>;

  allCountryCodes!: Observable<any[] | null>;
  allCountryCodesSub!: Subscription;
  allFilteredCountryCodes!: Observable<any[] | null>;
  getAllCountryCodeSub!: Subscription;
  countries: CountryCodeData[] = [];
  public filteredCountry: ReplaySubject<CountryCodeData[]> = new ReplaySubject<
    CountryCodeData[]
  >(1);

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(applicantsSelectors.getApplicantsIsLoading)
    );
    this.getUser();
    this.getAllApplicants();
    this.buildNewUserForm();
    if (this.isFormBuilder) {
      this.newApplicantForm.disable();
      this.getSingleApplicant();
    } else {
      this.filterApplicantInfo();
    }
    this.getCountryCodes();
  }

  filterApplicantInfo() {
    this.filteredPhoneOptions = this.newUserFormControls[
      'phone'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filter(value || '', 'phone');
      })
    );
    this.filteredIdOptions = this.newUserFormControls['id'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filter(value || '', 'id');
      })
    );
    this.filteredEmailOptions = this.newUserFormControls[
      'email'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filter(value || '', 'email');
      })
    );
  }

  buildNewUserForm() {
    this.newApplicantForm = this.fb.group({
      id: [null],
      phone: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      countryCode: [null],
    });

    // this.newApplicantForm.controls['lastName'].disable();
    // this.newApplicantForm.controls['firstName'].disable();
  }

  private _filter(value: any, type: 'email' | 'phone' | 'id'): any[] {
    const filterValue = value?.toString().toLowerCase();

    if (type === 'email') {
      return this.applicantList.filter((option) =>
        option.email.toLowerCase().includes(filterValue)
      );
    } else if (type === 'id') {
      return this.applicantList.filter((option) =>
        option.id.toString().toLowerCase().includes(filterValue)
      );
    } else {
      return this.applicantList.filter((option) =>
        option.mobileNo.toLowerCase().includes(filterValue)
      );
    }
  }

  get newUserFormControls() {
    return this.newApplicantForm.controls;
  }

  getErrorMessage(instance: string, type = 'required') {
    if (this.newUserFormControls[instance].hasError(type)) {
      return this.errorMessage[instance][type];
    }
    return;
  }

  get errorMessage(): any {
    return {
      id: { required: 'ID is required' },
      phone: { required: 'Phone Number is required' },
      lastName: { required: 'Last Name is required' },
      firstName: { required: 'First Name is required' },
      email: { required: 'Email is required' },
      emailInvalid: { email: 'Invalid Email' },
    };
  }

  getUser() {
    this.store.pipe(select(authSelectors.getUser)).subscribe((res) => {
      if (res !== null) {
        this.loggedInUser = res;
      }
    });
  }

  getAllApplicants() {
    this.store.dispatch(
      ApplicantsActions.GetAllApplicants({
        payload: { skip: 0, take: 9999999 },
      })
    );

    this.getAllApplicantsSub = this.store
      .pipe(select(applicantsSelectors.getAllApplicants))
      .subscribe((resData) => {
        if (resData) {
          this.applicantList = resData.data;
          this.filterApplicantInfo();
          this.newApplicantForm.patchValue({
            id: this.applicantList[0].id,
          });
        }
      });
  }

  onApplicantChange(event: any, field: string) {
    if (field === 'phone') {
      this.selectedApplicant = this.applicantList.find(
        (x: any) => x.mobileNo === this.newApplicantForm.value.phone
      );

      this.newApplicantForm.patchValue({
        // phone: this.selectedApplicant.mobileNo,
        id: this.selectedApplicant.id,
        lastName: this.selectedApplicant.lastName,
        firstName: this.selectedApplicant.firstName,
        email: this.selectedApplicant.email,
        countryCode: this.selectedApplicant.countryCode,
      });
    } else if (field === 'id') {
      this.selectedApplicant = this.applicantList.find(
        (x: any) => x.id === this.newApplicantForm.value.id
      );

      this.newApplicantForm.patchValue({
        phone: this.selectedApplicant.mobileNo,
        // id: this.selectedApplicant.id,
        lastName: this.selectedApplicant.lastName,
        firstName: this.selectedApplicant.firstName,
        email: this.selectedApplicant.email,
        countryCode: this.selectedApplicant.countryCode,
      });
    } else if (field === 'email') {
      this.selectedApplicant = this.applicantList.find(
        (x: any) => x.email === this.newApplicantForm.value.email
      );

      this.newApplicantForm.patchValue({
        id: this.selectedApplicant.id,
        phone: this.selectedApplicant.mobileNo,
        lastName: this.selectedApplicant.lastName,
        firstName: this.selectedApplicant.firstName,
        // email: this.selectedApplicant.email,
        countryCode: this.selectedApplicant.countryCode,
      });
    }
  }

  // when in quote page
  getSingleApplicant() {
    const applicantId = parseInt(this.route.snapshot.paramMap.get('id') || '');
    this.store.dispatch(
      ApplicantsActions.GetSingleApplicants({
        payload: {
          id: applicantId,
        },
      })
    );

    this.getSingleApplicantsSub = this.store
      .pipe(select(applicantsSelectors.getSingleApplicants))
      .subscribe((resData) => {
        if (resData) {
          this.singleApplicant = resData;
          this.newApplicantForm.patchValue({
            id: this.singleApplicant.id,
            phone: this.singleApplicant.mobileNo,
            lastName: this.singleApplicant.lastName,
            firstName: this.singleApplicant.firstName,
            email: this.singleApplicant.email,
          });
        }
      });
  }

  onInputfieldChange(event: any, type: string) {
    let findApplicant = null;
    // let valid = false;
    if (type === 'phone') {
      setTimeout(() => {
        findApplicant = this.applicantList.find(
          (x: any) => x.mobileNo === this.newApplicantForm.value.phone
        );
        if (!findApplicant) {
          this.newApplicant = true;
          //   this.newApplicantForm.patchValue({
          //     // phone: null,
          //     id: null,
          //     lastName: null,
          //     firstName: null,
          //     email: null,
          //   });
        } else {
          this.newApplicant = false;
        }
      }, 1000);
    } else if (type === 'id') {
      setTimeout(() => {
        findApplicant = this.applicantList.find(
          (x: any) => x.id === this.newApplicantForm.value.id
        );
        if (!findApplicant) {
          this.newApplicant = true;
          //   this.newApplicantForm.patchValue({
          //     phone: null,
          //     lastName: null,
          //     firstName: null,
          //     email: null,
          //   });
        } else {
          this.newApplicant = false;
        }
      }, 1000);
    } else if (type === 'email') {
      setTimeout(() => {
        findApplicant = this.applicantList.find(
          (x: any) => x.email === this.newApplicantForm.value.email
        );
        if (!findApplicant) {
          this.newApplicant = true;
          // this.newApplicantForm.patchValue({
          //   id: null,
          //   phone: null,
          //   lastName: null,
          //   firstName: null,
          //   // email: null,
          // });
        } else {
          this.newApplicant = false;
        }
      }, 1000);
    }
  }

  onSubmit() {
    if (this.newApplicantForm.invalid) {
      return;
    } else {
      if (this.newApplicant === false) {
        this.router.navigate([
          '/app/calculator/quote/builder',
          this.selectedApplicant.id,
        ]);
      } else {
        this.createApplicant();
      }
    }
  }

  createApplicant() {
    this.store.dispatch(ApplicantsActions.IsLoading({ payload: true }));
    this.store.dispatch(
      ApplicantsActions.CreateApplicant({
        payload: {
          rmId: this.loggedInUser?.UserId,
          firstName: this.newApplicantForm.value.firstName,
          lastName: this.newApplicantForm.value.lastName,
          email: this.newApplicantForm.value.email,
          mobileNo: this.newApplicantForm.value.phone,
          mobileNo2: '',
          gender: 0,
          maritalStatus: 0,
          address: '',
          city: '',
          postalCode: '',
          state: '',
          country: '',

          countryCode: this.newApplicantForm.value.countryCode,
          countryCode2: '',
          area: '',
          street: '',
          building: '',
        },
      })
    );
    this.getCreatedApplicant();
  }

  getCreatedApplicant() {
    this.createdApplicantSub = this.store
      .pipe(select(applicantsSelectors.getCreatedApplicant))
      .subscribe((resData: any) => {
        if (resData) {
          this.createdApplicant = resData;
          this.router.navigate([
            '/app/calculator/quote/builder',
            this.createdApplicant.id,
          ]);
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

  ngOnDestroy() {
    this.getAllApplicantsSub
      ? this.getAllApplicantsSub.unsubscribe()
      : this.getAllApplicantsSub;
    this.getSingleApplicantsSub
      ? this.getSingleApplicantsSub.unsubscribe
      : this.getSingleApplicantsSub;
    this.createdApplicantSub
      ? this.createdApplicantSub.unsubscribe()
      : this.createdApplicantSub;
  }
}
