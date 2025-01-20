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
import * as UsersActions from 'src/app/@core/stores/users/users.actions';
import * as UsersSelectors from 'src/app/@core/stores/users/users.selectors';

import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserInformationComponent } from '../create-edit-user/user-information/user-information.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit, OnDestroy {
  addEditUserForm!: FormGroup;
  accessLevels = accessLevels;
  isLoading!: Observable<boolean>;
  allCountryCodes!: Observable<any[] | null>;
  allCountryCodesSub!: Subscription;
  getAllActiveRolesSub!: Subscription;
  allActiveRoles: any;
  allDivisions: any;
  allUnits: any;
  allDepartments: any;
  allLocation: any;
  //allowMobileAccess!: boolean;
  allowMobileAccess!: boolean;
  allowWebAccess!: boolean;
  numberOfDevices!: number;
  getAllDivisionsSelectorSub!: Subscription;

  getAllDepartmentByDivisionId!: Subscription;
  // getAllUnitsByDivisionId!: Subscription;
  getAllUnitsByDepartmentId!: Subscription;
  getAllLocationSelectorSub!: Subscription;
  allFilteredCountryCodes!: Observable<any[] | null>;

  newDeviceId: any;
  jobTitles$: Observable<any> = this.store
    .select(departmentsSelectors.getAllJobTitle)
    .pipe(map((resp) => resp?.pageItems));

  // isSlideChecked: boolean = false;

  constructor(
    // private dialogRef: MatDialogRef<CreateEditUserComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(select(UsersSelectors.getUsersIsLoading));

    this.buildForm();

    this.getCountryCodes();
    this.getAllSuperAdminRole();
    this.getDivisions();
    this.getLocation();
    this.store.dispatch(
      DepartmentsActions.GetJobTitle({ payload: { skip: 0, take: 100 } })
    );

    this.toggleChanges({
      checked: this.addEditUserForm.value.allowMobileAccess,
    } as MatSlideToggleChange);
  }

  toggleChanges($event: MatSlideToggleChange) {
    this.allowWebAccess = $event.checked;
  }

  toggleChangeMultipleDev($event: MatSlideToggleChange) {
    this.allowMobileAccess = $event.checked;
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
    this.addEditUserForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      roleId: [null, [Validators.required]],
      countryCode: [null, [Validators.required]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
      ],
      division: [null, [Validators.required]],
      department: [null, [Validators.required]],
      // unitId: [null, [Validators.required]],
      unitId: [null],
      allowMobileAccess: [false],
      allowWebAccess: [false],
      //numberOfDevices: [],
      device: this.fb.array([this.createDeviceIdArray()]),
      location: [null, [Validators.required]],
      jobTitle: [null, [Validators.required]],
    });
  }

  createDeviceIdArray() {
    return this.fb.group({
      deviceId: [],
    });
  }

  get newUserFormControls() {
    return this.addEditUserForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'firstName' &&
      this.newUserFormControls['firstName'].hasError('required')
    ) {
      return `Please enter first name`;
    } else if (
      instance === 'lastName' &&
      this.newUserFormControls['lastName'].hasError('required')
    ) {
      return `Please enter last name`;
    } else if (
      instance === 'email' &&
      this.newUserFormControls['email'].hasError('required')
    ) {
      return 'Please enter email';
    } else if (
      instance === 'email' &&
      this.newUserFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'countryCode' &&
      this.newUserFormControls['countryCode'].hasError('required')
    ) {
      return `Select`;
    } else if (
      instance === 'roleId' &&
      this.newUserFormControls['roleId'].hasError('required')
    ) {
      return `Please select role`;
    } else if (
      instance === 'division' &&
      this.newUserFormControls['division'].hasError('required')
    ) {
      return `Please enter division`;
    } else if (
      instance === 'department' &&
      this.newUserFormControls['department'].hasError('required')
    ) {
      return `Please enter department`;
    } else if (
      instance === 'unitId' &&
      this.newUserFormControls['unitId'].hasError('required')
    ) {
      return `Please enter unit`;
    } else if (
      instance === 'phoneNumber' &&
      this.newUserFormControls['phoneNumber'].hasError('required')
    ) {
      return 'Please enter phone number';
    } else if (
      instance === 'phoneNumber' &&
      this.newUserFormControls['phoneNumber'].hasError('pattern')
    ) {
      return 'Sorry, this is not a valid phone number';
      // } else if (
      //   instance === 'numberOfDevices' &&
      //   this.newUserFormControls['numberOfDevices'].hasError('required')
      // ) {
      //   return `Please enter numberOf Devices`;
    } else if (
      instance === 'location' &&
      this.newUserFormControls['location'].hasError('required')
    ) {
      return `Please select location`;
    } else if (
      instance === 'jobTitle' &&
      this.newUserFormControls['jobTitle'].hasError('required')
    ) {
      return `Please selects job title`;
    } else {
      return;
    }
  }

  get addEditUserFormArray(): FormArray {
    return this.addEditUserForm.get('device') as FormArray;
  }

  addDeviceId() {
    this.addEditUserFormArray.push(this.createDeviceIdArray());
  }

  removeDeviceId(index: number) {
    this.addEditUserFormArray.removeAt(index);
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

  getDivisions() {
    this.store.dispatch(
      DepartmentsActions.GetActiveDivisions({
        payload: { skip: 0, take: 0 },
      })
    );

    this.getAllDivisionsSelectorSub = this.store
      .pipe(select(departmentsSelectors.getActiveDivisions))
      .subscribe((resData) => {
        if (resData !== null) {
          this.allDivisions = resData;
        }
      });
  }

  getDepartmentByDivisionId(division: MatSelectChange) {
    this.store.dispatch(
      DepartmentsActions.GetAllDepartmentsByDivisionId({
        payload: { id: division.value, skip: 0, take: 0 },
      })
    );

    this.getAllDepartmentByDivisionId = this.store
      .pipe(select(departmentsSelectors.getDepartmentByDivisionId))
      .subscribe((resData: any) => {
        if (resData !== null) {
          this.allDepartments = resData;
        }
      });
  }

  getUnitByDepartmentId(department: MatSelectChange) {
    this.store.dispatch(
      DepartmentsActions.GetAllUnitsByDepartmentId({
        payload: { id: department.value },
      })
    );

    this.getAllUnitsByDepartmentId = this.store
      .pipe(select(departmentsSelectors.getUnitsByDepartmentId))
      .subscribe((resData: any) => {
        if (resData !== null) {
          this.allUnits = resData;
        }
      });
  }

  getLocation() {
    this.store.dispatch(
      DepartmentsActions.GetAllBranches({
        payload: { skip: 0, take: 0 },
      })
    );

    this.getAllLocationSelectorSub = this.store
      .pipe(select(departmentsSelectors.getAllBranches))
      .subscribe((resData) => {
        if (resData !== null) {
          this.allLocation = resData;
        }
      });
  }

  onFilterdeviceid() {
    const a = this.addEditUserForm.value.device;

    this.newDeviceId = a.map((el: any) => {
      return el.deviceId;
    });
  }

  createUser() {
    this.store.dispatch(UsersActions.IsLoading({ payload: true }));
    this.onFilterdeviceid();
    this.store.dispatch(
      UsersActions.CreateUser({
        payload: {
          firstName: this.addEditUserForm.value.firstName,
          lastName: this.addEditUserForm.value.lastName,
          email: this.addEditUserForm.value.email,
          countryCode: this.addEditUserForm.value.countryCode,
          phoneNumber: this.addEditUserForm.value.phoneNumber,
          roleId: this.addEditUserForm.value.roleId,
          unitId: this.addEditUserForm.value.unitId,
          allowMobileAccess: this.addEditUserForm.value.allowMobileAccess,
          allowWebAccess: this.addEditUserForm.value.allowWebAccess,
          // numberOfDevices: this.addEditUserForm.value.numberOfDevices,
          deviceId: this.newDeviceId,
          branchId: this.addEditUserForm.value.location,
          jobTitleId: this.addEditUserForm.value.jobTitle,
        },
      })
    );
  }

  openUserInformation() {
    this.dialog.open(UserInformationComponent, {
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
    if (this.getAllDivisionsSelectorSub) {
      this.getAllDivisionsSelectorSub.unsubscribe();
    }

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
