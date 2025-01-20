import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { accessLevels } from 'src/app/@core/enums/access-level.enum';

import { Observable, Subscription } from 'rxjs';
//import { UserInformationComponent } from './user-information/user-information.component';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import * as RolesActions from 'src/app/@core/stores/roles/roles.actions';
import * as RolesSelectors from 'src/app/@core/stores/roles/roles.selectors';
import * as PartnerActions from 'src/app/@core/stores/partners/partners.actions';
import * as PartnerSelectors from 'src/app/@core/stores/partners/partners.selectors';

import * as CountryActions from 'src/app/@core/stores/countries/countries.actions';
import * as countrySelectors from 'src/app/@core/stores/countries/countries.selectors';

// import { MatSelectChange } from '@angular/material/select';
// import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PartnerInformationComponent } from '../create-edit-partner/partner-information/partner-information.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss'],
})
export class CreatePartnerComponent implements OnInit, OnDestroy {
  addEditPartnerForm!: FormGroup;
  accessLevels = accessLevels;
  isLoading!: Observable<boolean>;
  allCountryCodes!: Observable<any[] | null>;
  allCountryCodesSub!: Subscription;
  getAllActiveRolesSub!: Subscription;
  allActiveRoles: any;
  allLocation: any;
  getAllLocationSelectorSub!: Subscription;
  allFilteredCountryCodes!: Observable<any[] | null>;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(PartnerSelectors.getPartnersIsLoading)
    );

    this.buildForm();

    this.getCountryCodes();
    this.getAllSuperAdminRole();
    this.getLocation();
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

  buildForm() {
    this.addEditPartnerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      countryCode: [null, [Validators.required]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
      ],
      alternatePhoneNumber: [null, [Validators.pattern('^[+0-9]{7,15}$')]],
      companyName: [null, [Validators.required]],
      location: [null, [Validators.required]],
      street: [null, [Validators.required]],
      state: [null, [Validators.required]],
      area: [null, [Validators.required]],
      building: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
    });
  }

  get newPartnerFormControls() {
    return this.addEditPartnerForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.newPartnerFormControls['firstName'].hasError('required')
    ) {
      return `Please enter first name`;
    } else if (
      instance === 'lastName' &&
      this.newPartnerFormControls['lastName'].hasError('required')
    ) {
      return `Please enter last name`;
    } else if (
      instance === 'email' &&
      this.newPartnerFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.newPartnerFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'companyName' &&
      this.newPartnerFormControls['companyName'].hasError('required')
    ) {
      return `Please input the company name`;
    } else if (
      instance === 'location' &&
      this.newPartnerFormControls['location'].hasError('required')
    ) {
      return `Please select location`;
    } else if (
      instance === 'street' &&
      this.newPartnerFormControls['street'].hasError('required')
    ) {
      return `Please enter street name`;
    } else if (
      instance === 'state' &&
      this.newPartnerFormControls['state'].hasError('required')
    ) {
      return `Please enter state`;
    } else if (
      instance === 'building' &&
      this.newPartnerFormControls['building'].hasError('required')
    ) {
      return `Please enter building`;
    } else if (
      instance === 'area' &&
      this.newPartnerFormControls['area'].hasError('required')
    ) {
      return `Please enter area`;
    } else if (
      instance === 'postalCode' &&
      this.newPartnerFormControls['postalCode'].hasError('required')
    ) {
      return `Please enter postal code`;
    } else {
      return;
    }
  }

  get addEditUserFormArray(): FormArray {
    return this.addEditPartnerForm.get('device') as FormArray;
  }

  getCountryCodes() {
    this.allCountryCodes = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );
    this.allFilteredCountryCodes = this.store.pipe(
      select(generalSelectors.getAllCountryCodes)
    );

    this.allCountryCodesSub = this.allCountryCodes.subscribe((countryCodes) => {
      if (countryCodes === null) {
        this.store.dispatch(GeneralActions.GetCountryCodes());
      }
    });
  }

  getAllSuperAdminRole() {
    this.store.dispatch(
      RolesActions.GetAllActiveRoles({
        payload: { skip: 0, take: 0 },
      })
    );

    this.getAllActiveRolesSub = this.store
      .pipe(select(RolesSelectors.getAllActiveRoles))
      .subscribe((resData) => {
        if (resData !== null && resData.length !== 0) {
          this.allActiveRoles = resData;
        }
      });
  }

  getLocation() {
    this.store.dispatch(
      CountryActions.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );

    this.getAllLocationSelectorSub = this.store
      .pipe(select(countrySelectors.getAllCountry))
      .subscribe((resData) => {
        if (resData !== null) {
          this.allLocation = resData;
        }
      });
  }

  createPartner() {
    this.store.dispatch(PartnerActions.IsLoading({ payload: true }));
    // this.onFilterdeviceid();
    this.store.dispatch(
      PartnerActions.CreatePartner({
        payload: {
          firstName: this.addEditPartnerForm.value.firstName,
          lastName: this.addEditPartnerForm.value.lastName,
          email: this.addEditPartnerForm.value.email,
          countryCode: this.addEditPartnerForm.value.countryCode,
          country: this.addEditPartnerForm.value.location,
          phoneNumber: this.addEditPartnerForm.value.phoneNumber,
          alternatePhoneNumber:
            this.addEditPartnerForm.value.alternatePhoneNumber,
          companyName: this.addEditPartnerForm.value.companyName,
          state: this.addEditPartnerForm.value.state,
          city: this.addEditPartnerForm.value.area,
          streetNumber: this.addEditPartnerForm.value.street,
          building: this.addEditPartnerForm.value.building,
          zipCode: this.addEditPartnerForm.value.postalCode,
        },
      })
    );
  }

  openPartnerInformation() {
    this.dialog.open(PartnerInformationComponent, {
      panelClass: [
        'customSideBarDialogContainer',
        'animate__animated',
        'animate__slideInRight',
      ],
      width: '375px',
      position: { right: '0' },
      disableClose: true,
    });
  }

  ngOnDestroy(): void {
    if (this.allCountryCodesSub) {
      this.allCountryCodesSub.unsubscribe();
    }

    if (this.getAllActiveRolesSub) {
      this.getAllActiveRolesSub.unsubscribe();
    }

    if (this.getAllLocationSelectorSub) {
      this.getAllLocationSelectorSub.unsubscribe();
    }
  }
}
