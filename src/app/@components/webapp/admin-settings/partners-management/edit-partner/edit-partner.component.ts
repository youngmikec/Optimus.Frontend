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
// import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as CountryActions from 'src/app/@core/stores/countries/countries.actions';
import * as countrySelectors from 'src/app/@core/stores/countries/countries.selectors';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PartnerInformationComponent } from '../create-edit-partner/partner-information/partner-information.component';
// import * as UserActions from 'src/app/@core/stores/users/users.actions';
//import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PartnerEffects } from 'src/app/@core/stores/partners/partners.effects';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

// interface PartnerDevice {
//   deviceId: string;
//   deviceName: string;
//   id: string;
//   name: string;
//   createdByEmail?: string;
//   createdById?: string;
//   createdDate?: string;
//   lastModifiedById?: string;
//   lastModifiedByEmail?: string;
//   lastModifiedDate?: string;
//   status?: string;
//   statusDesc?: string;
// }

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss'],
})
export class EditPartnerComponent implements OnInit, OnDestroy {
  addEditPartnerForm!: FormGroup;
  accessLevels = accessLevels;
  isLoading!: Observable<boolean>;
  allCountryCodes!: Observable<any[] | null>;
  allCountryCodesSub!: Subscription;
  getAllActiveRolesSub!: Subscription;
  allActiveRoles: any;
  allLocation: any;
  //allowMobileAccess!: boolean;
  allowMobileAccess!: boolean;
  allowWebAccess!: boolean;
  numberOfDevices!: number;

  getAllLocationSelectorSub!: Subscription;
  allFilteredCountryCodes!: Observable<any[] | null>;

  newDeviceId: any;
  allUsers: any;
  getAllUserSub!: Subscription;
  userIdSub!: Subscription;
  userId: any;

  getUserByIdEffectSub!: Subscription;
  getPartnerByIdResData: any;
  userDeviceList!: any[];

  loggedInUser: any;
  routedDeviceName!: string;
  routedDeviceId!: string;
  partnerUserId!: string;

  globalSkip: number = DefaultPagination.skip;
  globalTake: number = DefaultPagination.take;
  // isSlideChecked: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    // private dialogRef: MatDialogRef<CreateEditUserComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    public route: ActivatedRoute,
    private partnerEffects: PartnerEffects
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((x: any) => {
      this.routedDeviceName = x.DeviceName;
      this.routedDeviceId = x.DeviceId;
    });
    this.isLoading = this.store.pipe(
      select(PartnerSelectors.getPartnersIsLoading)
    );

    this.getCountryCodes();

    this.getAllSuperAdminRole();

    // this.getDivisions();

    this.getLocation();

    this.getLoggedInUser();

    this.getPartnerByIdForEdit();

    this.buildForm();
    this.listenToGetPartnerByIdForEdit();

    this.toggleChanges({
      checked: this.addEditPartnerForm.value.allowMobileAccess,
    } as MatSlideToggleChange);
  }

  toggleChanges($event: MatSlideToggleChange) {
    this.allowWebAccess = $event.checked;
  }

  toggleChangeMultipleDev($event: MatSlideToggleChange) {
    this.allowMobileAccess = $event.checked;

    this.route.snapshot.paramMap.get('id');
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
      companyName: [null, [Validators.required]],
      countryCode: [null, [Validators.required]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
      ],
      alternatePhoneNumber: [null, [Validators.pattern('^[+0-9]{7,15}$')]],
      location: [null, [Validators.required]],
      street: [null, [Validators.required]],
      state: [null, [Validators.required]],
      area: [null, [Validators.required]],
      building: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
    });
  }

  get editPartnerFormControls() {
    return this.addEditPartnerForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.editPartnerFormControls['firstName'].hasError('required')
    ) {
      return `Please enter first name`;
    } else if (
      instance === 'lastName' &&
      this.editPartnerFormControls['lastName'].hasError('required')
    ) {
      return `Please enter last name`;
    } else if (
      instance === 'email' &&
      this.editPartnerFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.editPartnerFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'companyName' &&
      this.editPartnerFormControls['companyName'].hasError('required')
    ) {
      return `Please input the company name`;
    } else if (
      instance === 'location' &&
      this.editPartnerFormControls['location'].hasError('required')
    ) {
      return `Please select location`;
    } else if (
      instance === 'street' &&
      this.editPartnerFormControls['street'].hasError('required')
    ) {
      return `Please enter street name`;
    } else if (
      instance === 'state' &&
      this.editPartnerFormControls['state'].hasError('required')
    ) {
      return `Please enter state`;
    } else if (
      instance === 'building' &&
      this.editPartnerFormControls['building'].hasError('required')
    ) {
      return `Please enter building`;
    } else if (
      instance === 'area' &&
      this.editPartnerFormControls['area'].hasError('required')
    ) {
      return `Please enter area`;
    } else if (
      instance === 'postalCode' &&
      this.editPartnerFormControls['postalCode'].hasError('required')
    ) {
      return `Please enter postal code`;
    } else {
      return;
    }
  }

  get addEditPartnerFormArray(): FormArray {
    return this.addEditPartnerForm.get('device') as FormArray;
  }

  getCountryCodes() {
    this.allCountryCodes = this.store.pipe(
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
          skip: this.globalSkip,
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

  getLoggedInUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res: any) => {
      if (res !== null) {
        this.loggedInUser = res;
      }
    });
  }

  getPartnerByIdForEdit() {
    this.store.dispatch(
      PartnerActions.GetPartnerByIdForEdit({
        payload: {
          loggedInUserId: this.loggedInUser?.UserId,
          partnerUserId: this.route.snapshot.paramMap.get('id') || '',
        },
      })
    );
  }

  listenToGetPartnerByIdForEdit() {
    this.subscription.add(
      this.partnerEffects.getPartnerByIdForEdit$.subscribe((resData: any) => {
        if (resData?.entity) {
          this.getPartnerByIdResData = resData;
          this.patchEditPartnersForm(this.getPartnerByIdResData.entity);
        }
      })
    );
  }

  // toggleUserStatus(status: boolean) {
  //   this.store.dispatch(
  //     AuthActions.AuthorizeUserLogin({
  //       payload: {
  //         authorize: status,
  //         deviceId: this.routedDeviceId,
  //         deviceName: this.routedDeviceName,
  //         userEmail: this.getPartnerByIdResData?.entity?.email,
  //       },
  //     })
  //   );
  // }

  patchEditPartnersForm(partnerData: any) {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      alternatePhoneNumber,
      companyName,
      partnerUserId,
      branch,
    } = partnerData;

    this.addEditPartnerForm.patchValue({
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      alternatePhoneNumber,
      companyName,
      location: branch?.address_Country,
      state: branch?.address_State,
      street: branch?.address_Street,
      building: branch?.address_Building,
      area: branch?.address_Area,
      postalCode: branch?.address_ZipCode,
    });

    this.partnerUserId = partnerUserId;

    this.addEditPartnerFormArray.clear();
  }

  editPartner() {
    // this.onFilterdeviceid();
    this.store.dispatch(PartnerActions.IsLoading({ payload: true }));
    this.store.dispatch(
      PartnerActions.EditPartner({
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
          partnerUserId: this.partnerUserId,
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

    if (this.getAllUserSub) {
      this.getAllUserSub.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
