import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';

@Component({
  selector: 'app-create-company-profile',
  templateUrl: './create-company-profile.component.html',
  styleUrls: ['./create-company-profile.component.scss'],
})
export class CreateCompanyProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  isLoading!: Observable<boolean>;
  logoPreview: any;
  allCountryCodes!: any[];
  allCountryCodesSub!: Subscription;

  allFilteredCountryCodes!: Observable<any[] | null>;
  allCountryCodesObs!: Observable<any[] | null>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCompanyProfileComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );

    this.buildForm();

    this.getCountryCodes();

    this.patchHeadOffice();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      companyLogo: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      area: ['', Validators.required],
      streetName: ['', Validators.required],
      building: ['', Validators.required],
      zipCode: ['', Validators.required],
      website: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: [null, [Validators.required]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
      ],
    });
  }

  get profileFormControls() {
    return this.profileForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'country' &&
      this.profileFormControls['country'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'state' &&
      this.profileFormControls['state'].hasError('required')
    ) {
      return 'Please enter your state';
    } else if (
      instance === 'area' &&
      this.profileFormControls['area'].hasError('required')
    ) {
      return `Please enter area `;
    } else if (
      instance === 'streetName' &&
      this.profileFormControls['streetName'].hasError('required')
    ) {
      return `Enter street name`;
    } else if (
      instance === 'building' &&
      this.profileFormControls['building'].hasError('required')
    ) {
      return `Please enter building`;
    } else if (
      instance === 'zipCode' &&
      this.profileFormControls['zipCode'].hasError('required')
    ) {
      return `Please enter zip code`;
    } else if (
      instance === 'email' &&
      this.profileFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.profileFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'website' &&
      this.profileFormControls['website'].hasError('required')
    ) {
      return `Please enter website address`;
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onUploadLogo(event: Event) {
    const _event: any = event.target as HTMLInputElement;

    const file = _event.files[0];

    if (file && file.size <= 1000000) {
      const reader = new FileReader();

      reader.onload = () => {
        const fullBase64String = reader.result!.toString();
        const base64String = fullBase64String.split(',');

        this.profileForm.patchValue({
          companyLogo: base64String[1],
          // mimeType: file.type,
          // pictureExtension: file.name.split('.')[1],,
        });

        // this.customizationForm.patchValue({
        //   logo: base64String[1],
        // });

        // this.customizationForm.get('logo')!.updateValueAndValidity();

        this.logoPreview = fullBase64String;
      };

      reader.readAsDataURL(file);
    } else {
      const notification: Notification = {
        state: 'warning',
        message: 'The maximum image size is 1MB',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
    }
  }

  getCountryCodes() {
    this.store.dispatch(GeneralActions.GetCountryCodes());

    this.allCountryCodesSub = this.store
      .pipe(select(generalSelectors.getAllCountryCodes))
      .subscribe((res: any) => {
        if (res) {
          this.allCountryCodes = [...res];
          this.allCountryCodes.sort((a, b) =>
            a['name'].localeCompare(b['name'])
          );
        }
      });

    this.allCountryCodesObs = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );
    this.allFilteredCountryCodes = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );
  }

  onFilterCountryCode(event: any) {
    const inputValue = event.toLowerCase();

    this.allFilteredCountryCodes = this.allCountryCodesObs.pipe(
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

  patchHeadOffice() {
    if (this.data?.instance === 'update') {
      this.profileForm.patchValue({
        //companyName: this.data.headOffice.companyName,
        companyLogo: this.data.headOffice.companyLogo,
        country: this.data.headOffice.address_Country,
        state: this.data.headOffice.address_State,
        area: this.data.headOffice.address_Area,
        building: this.data.headOffice.address_Building,
        streetName: this.data.headOffice.address_Street,
        zipCode: this.data.headOffice.address_ZipCode,
        website: this.data.headOffice.website,
        email: this.data.headOffice.email,
        phoneNumber: this.data.headOffice.contactNumber,
        countryCode: this.data.headOffice.contactNumberCountryCode,
        headOfficeAddress: '',
      });

      this.logoPreview = this.data.headOffice.companyLogo;
    }
  }
  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createCompanyProfile();
    } else if (this.data?.instance === 'update') {
      this.updateCompanyProfile();
    }
  }

  createCompanyProfile() {
    this.store.dispatch(
      DepartmentsActions.CreateCompanyProfile({
        payload: {
          companyName: 'Optiva',
          companyLogo: this.profileForm.value.companyLogo,
          address_Country: this.profileForm.value.country,
          address_State: this.profileForm.value.state,
          address_Area: this.profileForm.value.area,
          address_Building: this.profileForm.value.building,
          address_Street: this.profileForm.value.streetName,
          address_ZipCode: this.profileForm.value.zipCode,
        },
      })
    );
  }

  updateCompanyProfile() {
    this.store.dispatch(
      DepartmentsActions.UpdateCompanyProfile({
        payload: {
          id: this.data.headOffice.id,
          companyName: this.profileForm.value.companyName,
          companyLogo: this.profileForm.value.companyLogo,
          address_Country: this.profileForm.value.country,
          address_State: this.profileForm.value.state,
          address_Area: this.profileForm.value.area,
          address_Building: this.profileForm.value.building,
          address_Street: this.profileForm.value.streetName,
          address_ZipCode: this.profileForm.value.zipCode,
          website: this.profileForm.value.website,
          email: this.profileForm.value.email,
          contactNumber: this.profileForm.value.phoneNumber,
          contactNumberCountryCode: this.profileForm.value.countryCode,
          headOfficeAddress: '',
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.allCountryCodesSub) {
      this.allCountryCodesSub.unsubscribe();
    }
  }
}
