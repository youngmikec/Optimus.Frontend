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
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserInformationComponent } from '../create-edit-user/user-information/user-information.component';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
//import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';
import { UsersEffects } from 'src/app/@core/stores/users/users.effects';
import { map } from 'rxjs/operators';
import { MobileAccessModalComponent } from '../mobile-access-modal/mobile-access-modal.component';
import { CreateEditDivisionComponent } from '../../org-settings/division/create-edit-division/create-edit-division.component';
import { CreateEditUnitsComponent } from '../../org-settings/units/create-edit-units/create-edit-units.component';

interface UserDevice {
  deviceId: string;
  deviceName: string;
  id: string;
  name: string;
  createdByEmail?: string;
  createdById?: string;
  createdDate?: string;
  lastModifiedById?: string;
  lastModifiedByEmail?: string;
  lastModifiedDate?: string;
  status?: string;
  statusDesc?: string;
}
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit, OnDestroy {
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
  allUsers: any;
  getAllUserSub!: Subscription;
  userIdSub!: Subscription;
  userId: any;

  getUserByIdEffectSub!: Subscription;
  getUserByIdResData: any;
  userDeviceList!: any[];

  loggedInUser: any;
  routedDeviceName!: string;
  routedDeviceId!: string;
  // isSlideChecked: boolean = false;

  jobTitles$: Observable<any> = this.store
    .select(departmentsSelectors.getAllJobTitle)
    .pipe(map((resp) => resp?.pageItems));

  private subscription: Subscription = new Subscription();

  constructor(
    // private dialogRef: MatDialogRef<CreateEditUserComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    public route: ActivatedRoute,
    private usersEffects: UsersEffects
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((x: any) => {
      this.routedDeviceName = x.DeviceName;
      this.routedDeviceId = x.DeviceId;
    });
    this.isLoading = this.store.pipe(select(UsersSelectors.getUsersIsLoading));

    this.getCountryCodes();

    this.getAllSuperAdminRole();

    this.getDivisions();

    this.getLocation();

    this.getLoggedInUser();

    this.getuserByIdForEdit();

    this.buildForm();
    this.listenToGetUserByIdForEdit();

    this.store.dispatch(
      DepartmentsActions.GetJobTitle({ payload: { skip: 0, take: 100 } })
    );

    this.toggleChanges({
      checked: this.addEditUserForm.value.allowMobileAccess,
    } as MatSlideToggleChange);

    //console.log(this.newDeviceId, 'bbbbeftrb');
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
      unitId: [null],
      allowMobileAccess: [false],
      allowWebAccess: [false],
      //numberOfDevices: [],
      device: this.fb.array([this.createDeviceIdArray()]),
      location: [null, [Validators.required]],
      jobTitle: [null, [Validators.required]],
    });

    // this.addEditUserForm = this.fb.group({
    //   firstName: [null, []],
    //   lastName: [null, []],
    //   email: [null, [Validators.email]],
    //   roleId: [null, []],
    //   countryCode: [null, []],
    //   phoneNumber: [null, [Validators.pattern('^[+0-9]{7,15}$')]],
    //   division: [null, []],
    //   department: [null, []],
    //   unitId: [null, []],
    //   allowMobileAccess: [false],
    //   allowWebAccess: [false],
    //   //numberOfDevices: [],
    //   device: this.fb.array([this.createDeviceIdArray()]),
    //   location: [null, []],
    //   jobTitle: [null, []],
    // });
  }

  createDeviceIdArray() {
    return this.fb.group({
      id: [0],
      deviceId: [''],
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
      return 'Please enter your email';
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
      return `Please select unit`;
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
      return `Please enter job title`;
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
      DepartmentsActions.GetAllDivisions({
        payload: { skip: 0, take: 0 },
      })
    );

    this.getAllDivisionsSelectorSub = this.store
      .pipe(select(departmentsSelectors.getAllDivisions))
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

  getLoggedInUser() {
    this.store.pipe(select(authSelections.getUser)).subscribe((res: any) => {
      if (res !== null) {
        this.loggedInUser = res;
      }
    });
  }

  getuserByIdForEdit() {
    this.store.dispatch(
      UserActions.GetUserByIdForEdit({
        payload: {
          userId: this.route.snapshot.paramMap.get('id') || '',
          loggedInUser: this.loggedInUser?.UserId,
        },
      })
    );
  }

  listenToGetUserByIdForEdit() {
    this.subscription.add(
      this.usersEffects.getUserByIdForEdit$.subscribe((resData: any) => {
        if (resData && resData.entity) {
          this.getUserByIdResData = resData;

          this.userDeviceList =
            this.getUserByIdResData?.entity?.userDevice || [];
          this.patchEditUsersForm(this.getUserByIdResData.entity);

          if (this.routedDeviceName && this.routedDeviceId) {
            this.userDeviceList.push({
              deviceId: this.routedDeviceId,
              deviceName: this.routedDeviceName,
              name: this.routedDeviceName,
            });
          }
        }
      })
    );
  }

  toggleUserStatus(status: boolean) {
    this.store.dispatch(
      AuthActions.AuthorizeUserLogin({
        payload: {
          authorize: status,
          deviceId: this.routedDeviceId,
          deviceName: this.routedDeviceName,
          userEmail: this.getUserByIdResData?.entity?.email,
        },
      })
    );
  }

  patchEditUsersForm(userData: any) {
    this.addEditUserForm.patchValue({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      roleId: userData?.roleId,

      //contactCountryCode: this.data.user.countryCode,
      countryCode: userData?.countryCode,
      phoneNumber: userData?.phoneNumber,
      //contactNumber: this.data.user.phoneNumber,
      division: userData?.divisionId,
      department: userData?.departmentId,

      allowMobileAccess: userData?.allowMobileAccess,
      //numberOfDevices: response?.user?.userLoginDeviceCount,
      // device: response?.firstName,
      // deviceId: response?.userDevice?.deviceId,
      userId: userData?.entity?.userId,
      location: userData?.branchId,
      jobTitle: userData?.jobTitleId,
      allowWebAccess: userData?.allowWebAccess,
    });

    this.addEditUserFormArray.clear();

    userData?.userDevice?.forEach((device: any, index: number) => {
      if (device) {
        this.addDeviceId();

        this.addEditUserFormArray.at(index).patchValue({
          id: device?.id,
          deviceId: device?.deviceId,
        });
      }
    });

    if (this.addEditUserForm.value.division) {
      this.getDepartmentByDivisionId({
        value: this.addEditUserForm.value.division,
      } as MatSelectChange);

      // console.log(
      //   this.getDivisionByDepartmentId({
      //     value: this.addEditUserForm.value.department,
      //   } as MatSelectChange),
      //   'matselect'
      // );

      this.addEditUserForm.patchValue({
        department: userData?.departmentId,
      });
    }

    // if (this.addEditUserForm.value.division) {
    //   this.getUnitByDivisionId({
    //     value: this.addEditUserForm.value.division,
    //   } as MatSelectChange);

    //   this.addEditUserForm.patchValue({
    //     unitId: this.data?.user?.unitId,
    //   });
    // }

    if (this.addEditUserForm.value.department) {
      this.getUnitByDepartmentId({
        value: this.addEditUserForm.value.department,
      } as MatSelectChange);

      this.addEditUserForm.patchValue({
        unitId: userData?.unitId,
      });
    }
  }

  editUser() {
    this.onFilterdeviceid();
    this.store.dispatch(UsersActions.IsLoading({ payload: true }));
    this.store.dispatch(
      UsersActions.UpdateUser({
        payload: {
          firstName: this.addEditUserForm.value.firstName,
          lastName: this.addEditUserForm.value.lastName,
          countryCode: this.addEditUserForm.value.countryCode,
          phoneNumber: this.addEditUserForm.value.phoneNumber,
          roleId: this.addEditUserForm.value.roleId,
          unitId: this.addEditUserForm.value.unitId ?? '',
          userId: this.getUserByIdResData?.entity?.userId,
          allowMobileAccess: this.addEditUserForm.value.allowMobileAccess,
          allowWebAccess: this.addEditUserForm.value.allowWebAccess,
          // numberOfDevices: this.addEditUserForm.value.numberOfDevices,
          deviceId: ['testId'],
          branchId: this.addEditUserForm.value.location,
          jobTitleId: this.addEditUserForm.value.jobTitle,
          profilePicture: '',
          signature: '',
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

  openDeviceApproveModal(status: boolean, item: UserDevice) {
    const submitData = {
      deviceId: item.deviceId,
      deviceName: item.deviceName,
      userEmail: this.getUserByIdResData?.entity?.email,
    };
    this.dialog.open(MobileAccessModalComponent, {
      data: {
        status,
        submitData,
      },
    });
  }

  onCreateEditDivision() {
    this.dialog.open(CreateEditDivisionComponent, {
      data: {
        instance: 'create',
        department: 0,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  onCreateEditUnit(unitData?: any) {
    this.dialog.open(CreateEditUnitsComponent, {
      data: {
        instance: 'create',
        unit: unitData,
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
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

    if (this.getAllUserSub) {
      this.getAllUserSub.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    //   if (this.getUnitByDepartmentId) {
    //     this.getUnitByDepartmentId.unsubscribe();
    //   }
  }
}
