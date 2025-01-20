import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as FeaturesActions from 'src/app/@core/stores/features/features.actions';
import * as featuresSelectors from 'src/app/@core/stores/features/features.selectors';
import * as RolesActions from 'src/app/@core/stores/roles/roles.actions';
import * as rolesSelectors from 'src/app/@core/stores/roles/roles.selectors';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import { MatSelectChange } from '@angular/material/select';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent implements OnInit, OnDestroy {
  createRoleForm!: FormGroup;
  isLoading!: Observable<boolean>;
  selectedFeature: number = 0;
  featureName: string = '';
  getAllPermissionByAccessLevel!: Subscription;
  features!: any[];
  selectedFeatures!: any[];
  permissions!: any[];
  object = Object.values;
  masterChecked: boolean = false;
  masterIndeterminate: boolean = false;
  totalCheckedCount: number = 0;
  checkedPermissions: any[] = [];
  rolePermissionsDictionary: any;
  accessLevels!: any;
  getAllAccessLevelSub!: Subscription;
  rolePermissions!: any[];
  // permissionId!: number;
  // permissionName!: string;

  @ViewChildren('permissionCheckbox')
  permissionCheckbox!: QueryList<MatCheckbox>;

  searchInputParam!: string | null;

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.buildForm();
    this.isLoading = this.store.pipe(select(rolesSelectors.getRolesIsLoading));

    this.getAllAccessLevelSub = this.store
      .pipe(select(GeneralSelectors.getAllAccessLevels))
      .subscribe((response) => {
        if (response !== null) {
          //console.log(response, 'mama');
          this.accessLevels = response;
          //console.log(this.accessLevels);
        } else {
          this.store.dispatch(GeneralActions.GetAllAccessLevels());
        }
      });
  }

  onInputSearch() {
    if (this.searchInputParam !== null) {
      this.searchFilterService.onSearch(this.searchInputParam);
      this.search(this.searchInputParam);
    }
  }

  search(input: string) {
    this.selectedFeatures = this.features.filter((item: any) =>
      item.name.toLowerCase().includes(input?.toLowerCase())
    );
  }

  buildForm() {
    this.createRoleForm = this.fb.group({
      role: [null, Validators.required],
      access_level: [null, Validators.required],
    });
  }

  get createRoleFormControls() {
    return this.createRoleForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'role' &&
      this.createRoleFormControls['role'].hasError('required')
    ) {
      return 'Sorry, this field is required';
    } else if (
      instance === 'access_level' &&
      this.createRoleFormControls['access_level'].hasError('required')
    ) {
      return 'Please select an Access Level';
    } else {
      return;
    }
  }

  getPermissionsByAccessLevel(accessLevel: MatSelectChange) {
    this.store.dispatch(FeaturesActions.IsLoading({ payload: true }));

    this.store.dispatch(
      FeaturesActions.GetPermissionByAccessLevel({
        payload: {
          skip: 0,
          take: 0,
          accessLevel: accessLevel.value,
        },
      })
    );

    this.getAllPermissionByAccessLevel = this.store
      .pipe(select(featuresSelectors.getPermissionsByAccessLevel))
      .subscribe((resData: any) => {
        //console.log(resData, 'resdata for features');
        if (resData !== null) {
          const allActiveFeautures = resData.entities.filter(
            (feature: any) => feature.status === 1
          );

          if (this.rolePermissions) {
            let tempFeatures: any[] = [];
            const allRolePermissionId = this.rolePermissions.map(
              (permission) => permission.permissionId
            );
            tempFeatures = allActiveFeautures.map((feature: any) => {
              return {
                ...feature,
                isSelected: allRolePermissionId.includes(feature.id)
                  ? true
                  : false,
              };
            });

            this.features = this.mapData(tempFeatures);

            this.loadSelectedFeaturePermission(this.features[0], 0);

            this.rolePermissions.forEach((permission) => {
              this.initiaLisePermissionCheckList(permission);
            });
          } else {
            this.features = this.mapData(allActiveFeautures);
            this.loadSelectedFeaturePermission(this.features[0], 0);
          }

          // this.features = this.mapData(resData.entities);
          // //console.log(this.features, 'features');
          // this.loadSelectedFeaturePermission(this.features[0], 0);
        }
      });
  }

  loadSelectedFeaturePermission(feature: any, i: number) {
    this.featureName = feature?.name;
    this.permissions = feature?.children;
    this.selectedFeature = i;
    this.updatePermissionCheckList(this.permissions);
  }

  updatePermissionCheckList(permission: any) {
    let checkedCount = 0;

    this.permissions?.forEach((permission: any) => {
      if (permission.isChecked === true) {
        checkedCount++;
        permission.status = 1;
      } else {
        permission.status = 2;
      }
    });

    this.features.forEach((featureEl) => {
      // if (featureEl.parentFeatureName === permission?.parentFeatureName) {
      //   featureEl.checkedCount = checkedCount;
      // }

      if (featureEl.id === permission.parentFeatureId) {
        featureEl.checkedCount = checkedCount;
      }
    });

    // this.features[feature.parentFeatureName].checkedCount = checkedCount;

    if (checkedCount > 0 && checkedCount < this.permissions.length) {
      this.masterIndeterminate = true;
    } else if (checkedCount == this.permissions?.length) {
      this.masterIndeterminate = false;
      this.masterChecked = true;
    } else {
      this.masterIndeterminate = false;
      this.masterChecked = false;
    }
  }

  initiaLisePermissionCheckList(permission: any) {
    let checkedCount = 0;

    this.features.forEach((featureEl) => {
      if (featureEl.id === permission.featureId) {
        checkedCount = featureEl.checkedCount;
        featureEl.checkedCount++;
      }
    });

    // this.features[feature.parentFeatureName].checkedCount = checkedCount;

    if (checkedCount > 0 && checkedCount < this.permissions.length) {
      this.masterIndeterminate = true;
    } else if (checkedCount == this.permissions.length) {
      this.masterIndeterminate = false;
      this.masterChecked = true;
    } else {
      this.masterIndeterminate = false;
      this.masterChecked = false;
    }
  }

  onSelectAllPermissions() {
    this.permissions.forEach((el) => {
      el.isChecked = this.masterChecked;
    });

    this.permissionCheckbox.forEach((checkboxEl) => {
      checkboxEl.checked = this.masterChecked;
    });

    let checkedCount = 0;

    this.permissions.forEach((permission) => {
      if (permission.isChecked === true) {
        checkedCount++;
      }
    });

    // checkedCount = this.permissions.reduce(
    //   (counter, { isChecked }) => (isChecked ? (counter += 1) : counter),
    //   0
    // ); //Still works but i don't like this function

    this.features.forEach((featureEl) => {
      if (
        featureEl?.parentFeatureName === this.permissions[0]?.parentFeatureName
      ) {
        featureEl.checkedCount = checkedCount;
      }
    });

    this.permissions.forEach((x) => {
      this.updatePermissionCheckList(x);
    });
  }

  mapData(allFeatures: any): any {
    const modifiedFeatures: any = {};

    allFeatures.forEach((feature: any, index: number) => {
      if (feature?.parentFeatureId === null || feature?.parentFeatureId === 0) {
        modifiedFeatures[feature?.name] = {
          ...feature,
          checkedCount: 0,
          children: [],
        };
      }
    });

    const children: any[] = allFeatures.filter(
      (feature: any) => feature.parentFeatureId !== null
    );

    children.forEach((child: any) => {
      if (modifiedFeatures[child.parentFeatureName]) {
        modifiedFeatures[child.parentFeatureName]['children'] = [
          ...modifiedFeatures[child.parentFeatureName]['children'],
          {
            ...child,
            isChecked: false,
          },
        ];
      }
    });
    //console.log(children, 'children');

    return this.object(modifiedFeatures);
  }

  validateCreateRoleBtn() {
    const allPermissions: any[] = [];

    this.features?.forEach((feature) => {
      if (feature.children.length !== 0) {
        allPermissions.push(...feature.children);
      }
    });

    const atLeastOnePermissionIsSelected = allPermissions.some(
      (permission) => permission.isChecked === true
    );

    if (this.createRoleForm.valid && atLeastOnePermissionIsSelected === true) {
      return false;
    } else {
      return true;
    }
  }

  createRole() {
    this.store.dispatch(RolesActions.IsLoading({ payload: true }));

    let permissions: {
      status: 1 | 2;
      permissionId: number;
      name: string;
    }[] = [];

    this.features.forEach((feature) => {
      if (feature.children.length !== 0) {
        feature.children.forEach((permission: any) => {
          if (permission.isChecked === true) {
            this.totalCheckedCount++;
            permissions.push({
              status: permission.isChecked === true ? 1 : 2,
              permissionId: permission.id,
              name: permission.name,
            });
          }
        });
      }
    });

    // Get just selected permission
    permissions = permissions.filter((permission) => {
      return permission.status === 1;
    });

    // console.log(permissions, 'All permissions');

    this.rolePermissionsDictionary = Object.assign(
      {},
      ...permissions.map((x) => ({
        permissionId: x.permissionId,
        permissionName: x.name,
      }))
    );

    const submittedPermissions: any = [];
    permissions.forEach((x: any) => {
      let y = {};
      y = {
        permissionId: x.permissionId,
        permissionname: x.name,
      };
      submittedPermissions.push(y);
    });

    // [x.permissionId]: x.name
    this.store.dispatch(
      RolesActions.CreateRoleAndPermission({
        payload: {
          name: this.createRoleForm.value.role,
          rolePermissions: submittedPermissions,
          roleAccessLevel: this.createRoleForm.value.access_level,
        },
      })
    );

    // console.log(
    //   {
    //     name: this.createRoleForm.value.role,
    //     rolePermissions: [this.rolePermissionsDictionary],
    //     accessLevel: this.createRoleForm.value.access_level,
    //   },
    //   'dict'
    // );
  }

  // editRole() {
  //   this.store.dispatch(
  //     RolesActions.CreateRoleAndPermission({
  //       payload: {
  //         name: this.createRoleForm.value.role,
  //         rolePermissions: [this.rolePermissionsDictionary],
  //         accessLevel: this.createRoleForm.value.access_level,
  //       },
  //     })
  //   );
  // }

  ngOnDestroy(): void {
    if (this.getAllPermissionByAccessLevel) {
      this.getAllPermissionByAccessLevel.unsubscribe();
    }
  }
}
