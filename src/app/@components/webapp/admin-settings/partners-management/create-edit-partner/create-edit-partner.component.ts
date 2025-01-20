// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { accessLevels } from 'src/app/@core/enums/access-level.enum';

// import { Observable, Subscription } from 'rxjs';
// import { PartnerInformationComponent } from './partner-information/partner-information.component';
// import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
// import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
// import { Store, select } from '@ngrx/store';
// import * as fromApp from 'src/app/@core/stores/app.reducer';

// import * as RolesActions from 'src/app/@core/stores/roles/roles.actions';
// import * as RolesSelectors from 'src/app/@core/stores/roles/roles.selectors';
// import * as UsersActions from 'src/app/@core/stores/users/users.actions';

// import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
// import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

// import { MatSelectChange } from '@angular/material/select';
// import { MatSlideToggleChange } from '@angular/material/slide-toggle';

// @Component({
//   selector: 'app-create-edit-partner',
//   templateUrl: './create-edit-partner.component.html',
//   styleUrls: ['./create-edit-partner.component.scss'],
// })
// export class CreateEditPartnerComponent implements OnInit, OnDestroy {
//   addEditUserForm!: FormGroup;
//   accessLevels = accessLevels;
//   isLoading!: Observable<boolean>;
//   allCountryCodes!: Observable<any[] | null>;
//   allCountryCodesSub!: Subscription;
//   getAllRolesSub!: Subscription;
//   allRoles: any;
//   allDivisions: any;
//   allUnits: any;
//   allDepartments: any;
//   allLocation: any;
//   //allowMobileAccess!: boolean;
//   allowMobileAccess!: boolean;
//   allowWebAccess!: boolean;
//   numberOfDevices!: number;
//   getAllDivisionsSelectorSub!: Subscription;

//   getAllDepartmentByDivisionId!: Subscription;
//   // getAllUnitsByDivisionId!: Subscription;
//   getAllUnitsByDepartmentId!: Subscription;
//   getAllLocationSelectorSub!: Subscription;

//   newDeviceId: any;

//   // isSlideChecked: boolean = false;

//   constructor(
//     // private dialogRef: MatDialogRef<CreateEditUserComponent>,
//     // @Inject(MAT_DIALOG_DATA) public data: any,
//     private fb: FormBuilder,
//     public dialog: MatDialog,
//     private store: Store<fromApp.AppState>
//   ) {}

//   ngOnInit() {
//     this.isLoading = this.store.pipe(
//       select(generalSelectors.getGeneralIsLoading)
//     );

//     this.buildForm();

//     this.getCountryCodes();
//     this.getAllSuperAdminRole();

//     this.getDivisions();

//     this.getLocation();

//     //this.patchEditUsersForm();

//     //console.log(this.data, 'data');

//     this.toggleChanges({
//       checked: this.addEditUserForm.value.allowMobileAccess,
//     } as MatSlideToggleChange);

//     //console.log(this.newDeviceId, 'bbbbeftrb');
//   }

//   toggleChanges($event: MatSlideToggleChange) {
//     this.allowWebAccess = $event.checked;
//   }

//   toggleChangeMultipleDev($event: MatSlideToggleChange) {
//     this.allowMobileAccess = $event.checked;
//   }

//   // toggle() {
//   //   console.log(this.toggleStyle);
//   //   this.toggleStyle = !this.toggleStyle;
//   // }

//   buildForm() {
//     this.addEditUserForm = this.fb.group({
//       firstName: [null, [Validators.required]],
//       lastName: [null, [Validators.required]],
//       email: [null, [Validators.required, Validators.email]],
//       roleId: [null, [Validators.required]],
//       countryCode: [null, [Validators.required]],
//       phoneNumber: [
//         null,
//         [Validators.required, Validators.pattern('^[+0-9]{7,15}$')],
//       ],
//       division: [null, [Validators.required]],
//       department: [null, [Validators.required]],
//       unitId: [null, [Validators.required]],
//       allowMobileAccess: [],
//       allowWebAccess: [],
//       //numberOfDevices: [],
//       device: this.fb.array([this.createDeviceIdArray()]),
//       location: [null, [Validators.required]],
//       jobTitle: [null, [Validators.required]],
//     });
//   }

//   createDeviceIdArray() {
//     return this.fb.group({
//       deviceId: [],
//     });
//   }

//   get newUserFormControls() {
//     return this.addEditUserForm.controls;
//   }

//   getErrorMessage(instance: string) {
//     if (
//       instance === 'firstName' &&
//       this.newUserFormControls['firstName'].hasError('required')
//     ) {
//       return `Please enter first name`;
//     } else if (
//       instance === 'lastName' &&
//       this.newUserFormControls['lastName'].hasError('required')
//     ) {
//       return `Please enter last name`;
//     } else if (
//       instance === 'email' &&
//       this.newUserFormControls['email'].hasError('required')
//     ) {
//       return 'Please enter your email';
//     } else if (
//       instance === 'email' &&
//       this.newUserFormControls['email'].hasError('email')
//     ) {
//       return 'Sorry, this is not a valid email';
//     } else if (
//       instance === 'roleId' &&
//       this.newUserFormControls['roleId'].hasError('required')
//     ) {
//       return `Please select role`;
//     } else if (
//       instance === 'division' &&
//       this.newUserFormControls['division'].hasError('required')
//     ) {
//       return `Please enter division`;
//     } else if (
//       instance === 'department' &&
//       this.newUserFormControls['department'].hasError('required')
//     ) {
//       return `Please enter department`;
//     } else if (
//       instance === 'unitId' &&
//       this.newUserFormControls['unitId'].hasError('required')
//     ) {
//       return `Please enter unit`;
//       // } else if (
//       //   instance === 'numberOfDevices' &&
//       //   this.newUserFormControls['numberOfDevices'].hasError('required')
//       // ) {
//       //   return `Please enter numberOf Devices`;
//     } else if (
//       instance === 'location' &&
//       this.newUserFormControls['location'].hasError('required')
//     ) {
//       return `Please select location`;
//     } else if (
//       instance === 'jobTitle' &&
//       this.newUserFormControls['jobTitle'].hasError('required')
//     ) {
//       return `Please enter job title`;
//     } else {
//       return;
//     }
//   }

//   get addEditUserFormArray(): FormArray {
//     return this.addEditUserForm.get('device') as FormArray;
//   }

//   addDeviceId() {
//     this.addEditUserFormArray.push(this.createDeviceIdArray());
//   }

//   removeDeviceId(index: number) {
//     this.addEditUserFormArray.removeAt(index);
//   }

//   getCountryCodes() {
//     this.allCountryCodes = this.store.pipe(
//       select(generalSelectors.getAllCountryCodes)
//     );

//     this.allCountryCodesSub = this.allCountryCodes.subscribe((countryCodes) => {
//       if (countryCodes === null) {
//         this.store.dispatch(GeneralActions.GetCountryCodes());
//       }
//     });
//   }

//   getAllSuperAdminRole() {
//     this.store.dispatch(
//       RolesActions.GetAllRole({
//         payload: { skip: 0, take: 0, searchValue: '', filter: [] },
//       })
//     );

//     this.getAllRolesSub = this.store
//       .pipe(select(RolesSelectors.getAllRoles))
//       .subscribe((resData) => {
//         //console.log(resData);
//         if (resData !== null && resData.length !== 0) {
//           this.allRoles = resData;
//         }
//       });
//   }

//   getDivisions() {
//     this.store.dispatch(
//       DepartmentsActions.GetAllDivisions({
//         payload: { skip: 0, take: 0 },
//       })
//     );

//     this.getAllDivisionsSelectorSub = this.store
//       .pipe(select(departmentsSelectors.getAllDivisions))
//       .subscribe((resData) => {
//         if (resData !== null) {
//           this.allDivisions = resData;
//         }
//       });
//   }

//   getDepartmentByDivisionId(division: MatSelectChange) {
//     this.store.dispatch(
//       DepartmentsActions.GetAllDepartmentsByDivisionId({
//         payload: { id: division.value, skip: 0, take: 0 },
//       })
//     );

//     this.getAllDepartmentByDivisionId = this.store
//       .pipe(select(departmentsSelectors.getDepartmentByDivisionId))
//       .subscribe((resData: any) => {
//         if (resData !== null) {
//           this.allDepartments = resData;

//           // console.log(this.allDepartments, 'dept');
//         }
//       });

//     // if (this.data?.instance === 'update') {
//     //   this.editDivision();
//     // }
//     //console.log(this.getDivisionByDepartmentId(department));
//   }

//   // getUnitByDivisionId(division: MatSelectChange) {
//   //   this.store.dispatch(
//   //     DepartmentsActions.GetAllUnitsByDivisionId({
//   //       payload: { id: division.value },
//   //     })
//   //   );

//   //   this.getAllUnitsByDivisionId = this.store
//   //     .pipe(select(departmentsSelectors.getUnitsByDivisionId))
//   //     .subscribe((resData: any) => {
//   //       if (resData !== null) {
//   //         this.allUnits = resData;
//   //       }
//   //     });
//   // }

//   getUnitByDepartmentId(department: MatSelectChange) {
//     this.store.dispatch(
//       DepartmentsActions.GetAllUnitsByDepartmentId({
//         payload: { id: department.value },
//       })
//     );

//     this.getAllUnitsByDepartmentId = this.store
//       .pipe(select(departmentsSelectors.getUnitsByDepartmentId))
//       .subscribe((resData: any) => {
//         if (resData !== null) {
//           this.allUnits = resData;
//         }
//       });
//   }

//   getLocation() {
//     this.store.dispatch(
//       DepartmentsActions.GetAllBranches({
//         payload: { skip: 0, take: 0 },
//       })
//     );

//     this.getAllLocationSelectorSub = this.store
//       .pipe(select(departmentsSelectors.getAllBranches))
//       .subscribe((resData) => {
//         if (resData !== null) {
//           this.allLocation = resData;
//         }
//       });
//   }

//   // editDivision() {
//   //   this.addEditUserForm.patchValue({
//   //     division: this.data?.user?.divisionId,
//   //   });
//   // }

//   // a = this.addEditUserForm.value.device;
//   // b = this.a.map((el: any) => {
//   //   return el.deviceId;
//   // });

//   onFilterdeviceid() {
//     const a = this.addEditUserForm.value.device;

//     this.newDeviceId = a.map((el: any) => {
//       return el.deviceId;
//     });
//   }

//   // patchEditUsersForm() {
//   //   if (this.data?.instance === 'update') {
//   //     this.addEditUserForm.patchValue({
//   //       firstName: this.data?.user?.firstName,
//   //       lastName: this.data?.user?.lastName,
//   //       email: this.data?.user?.email,
//   //       roleId: this.data?.user?.roleId,

//   //       //contactCountryCode: this.data.user.countryCode,
//   //       countryCode: this.data?.user?.countryCode,
//   //       phoneNumber: this.data?.user?.phoneNumber,
//   //       //contactNumber: this.data.user.phoneNumber,
//   //       division: this.data?.user?.divisionId,
//   //       department: this.data?.user?.departmentId,

//   //       allowMobileAccess: this.data?.user?.allowMobileAccess,
//   //       //numberOfDevices: this.data?.user?.userLoginDeviceCount,
//   //       deviceId: this.data?.user?.userDevice?.deviceId,
//   //       userId: this.data?.user?.userId,
//   //       location: this.data?.user?.branchId,
//   //       jobTitle: this.data?.user?.jobTitle,
//   //       allowWebAccess: this.data?.user?.allowWebAccess,
//   //     });

//   //     if (this.addEditUserForm.value.division) {
//   //       this.getDepartmentByDivisionId({
//   //         value: this.addEditUserForm.value.division,
//   //       } as MatSelectChange);

//   //       // console.log(
//   //       //   this.getDivisionByDepartmentId({
//   //       //     value: this.addEditUserForm.value.department,
//   //       //   } as MatSelectChange),
//   //       //   'matselect'
//   //       // );

//   //       this.addEditUserForm.patchValue({
//   //         department: this.data?.user?.departmentId,
//   //       });
//   //     }

//   //     // if (this.addEditUserForm.value.division) {
//   //     //   this.getUnitByDivisionId({
//   //     //     value: this.addEditUserForm.value.division,
//   //     //   } as MatSelectChange);

//   //     //   this.addEditUserForm.patchValue({
//   //     //     unitId: this.data?.user?.unitId,
//   //     //   });
//   //     // }

//   //     if (this.addEditUserForm.value.department) {
//   //       this.getUnitByDepartmentId({
//   //         value: this.addEditUserForm.value.department,
//   //       } as MatSelectChange);

//   //       this.addEditUserForm.patchValue({
//   //         unitId: this.data?.user?.unitId,
//   //       });
//   //     }
//   //   }
//   // }

//   // onSubmit() {
//   //   this.store.dispatch(UsersActions.IsLoading({ payload: true }));
//   //   if (this.data?.instance === 'create') {
//   //     this.createUser();
//   //   } else if (this.data?.instance === 'update') {
//   //     this.editUser();
//   //   }
//   // }

//   createUser() {
//     //console.log(this.addEditUserForm.value.device);

//     this.onFilterdeviceid();

//     // console.log(this.newDeviceId);
//     this.store.dispatch(
//       UsersActions.CreateUser({
//         payload: {
//           firstName: this.addEditUserForm.value.firstName,
//           lastName: this.addEditUserForm.value.lastName,
//           email: this.addEditUserForm.value.email,
//           countryCode: this.addEditUserForm.value.countryCode,
//           phoneNumber: this.addEditUserForm.value.phoneNumber,
//           roleId: this.addEditUserForm.value.roleId,
//           unitId: this.addEditUserForm.value.unitId,
//           allowMobileAccess: this.addEditUserForm.value.allowMobileAccess,
//           allowWebAccess: this.addEditUserForm.value.allowWebAccess,
//           // numberOfDevices: this.addEditUserForm.value.numberOfDevices,
//           deviceId: this.newDeviceId,
//           branchId: this.addEditUserForm.value.location,
//           jobTitle: this.addEditUserForm.value.jobTitle,
//         },
//       })
//     );
//   }

//   // editUser() {
//   //   this.onFilterdeviceid();

//   //   this.store.dispatch(
//   //     UsersActions.UpdateUser({
//   //       payload: {
//   //         firstName: this.addEditUserForm.value.firstName,
//   //         lastName: this.addEditUserForm.value.lastName,
//   //         countryCode: this.addEditUserForm.value.countryCode,
//   //         phoneNumber: this.addEditUserForm.value.phoneNumber,
//   //         roleId: this.addEditUserForm.value.roleId,
//   //         unitId: this.addEditUserForm.value.unitId,
//   //         userId: this.data?.user.userId,
//   //         allowMobileAccess: this.addEditUserForm.value.allowMobileAccess,
//   //         allowWebAccess: this.addEditUserForm.value.allowWebAccess,
//   //         // numberOfDevices: this.addEditUserForm.value.numberOfDevices,
//   //         deviceId: this.newDeviceId,
//   //         branchId: this.addEditUserForm.value.location,
//   //         jobTitle: this.addEditUserForm.value.jobTitle,
//   //         profilePicture: this.data?.user.profilePicture,
//   //       },
//   //     })
//   //   );
//   // }

//   // closeDialog() {
//   //   this.dialogRef.close();
//   // }

//   openUserInformation() {
//     this.dialog.open(PartnerInformationComponent, {
//       panelClass: [
//         'customSideBarDialogContainer',
//         'animate__animated',
//         'animate__slideInRight',
//       ],
//       width: '375px',
//       position: { right: '0' },
//       disableClose: true,
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.getAllDivisionsSelectorSub) {
//       this.getAllDivisionsSelectorSub.unsubscribe();
//     }

//     if (this.allCountryCodesSub) {
//       this.allCountryCodesSub.unsubscribe();
//     }

//     if (this.getAllRolesSub) {
//       this.getAllRolesSub.unsubscribe();
//     }

//     if (this.getAllLocationSelectorSub) {
//       this.getAllLocationSelectorSub.unsubscribe();
//     }

//     //   if (this.getUnitByDepartmentId) {
//     //     this.getUnitByDepartmentId.unsubscribe();
//     //   }
//   }
// }
