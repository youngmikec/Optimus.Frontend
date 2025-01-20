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
import { ActivatedRoute, Params } from '@angular/router';
import { RolesEffects } from 'src/app/@core/stores/roles/roles.effects';
import { SearchFilterService } from 'src/app/@core/services/search-filter.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss'],
})
export class EditRoleComponent implements OnInit, OnDestroy {
  editRoleForm!: FormGroup;
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
  roleId!: number;
  getRoleFromActivatedRouteSub!: Subscription;
  getRoleByIdEffectSub!: Subscription;
  getRoleByIdEffectResData: any;
  rolePermissions!: any[];

  startedEditing!: boolean;

  @ViewChildren('permissionCheckbox')
  permissionCheckbox!: QueryList<MatCheckbox>;

  searchInputParam!: string | null;

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private rolesEffects: RolesEffects,
    private searchFilterService: SearchFilterService
  ) {}

  ngOnInit(): void {
    this.searchFilterService.listenToActivatedRouteSubscription();
    this.searchFilterService.listenToSearchSubject();
    this.startedEditing = false;
    this.buildForm();
    this.isLoading = this.store.pipe(select(rolesSelectors.getRolesIsLoading));

    this.getAllAccessLevelSub = this.store
      .pipe(select(GeneralSelectors.getAllAccessLevels))
      .subscribe((response) => {
        if (response !== null) {
          this.accessLevels = response;
          // console.log(this.accessLevels);
        } else {
          this.store.dispatch(GeneralActions.GetAllAccessLevels());
        }
      });

    this.listenToGetRoleByIdEffectSub();

    this.getRoleById();

    this.listenToGetPermissionByAccessLevelSelectorSub();
  }

  buildForm() {
    this.editRoleForm = this.fb.group({
      role: [null, Validators.required],
      access_level: [null, Validators.required],
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

  get editRoleFormControls() {
    return this.editRoleForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'role' &&
      this.editRoleFormControls['role'].hasError('required')
    ) {
      return 'Sorry, this field is required';
    } else if (
      instance === 'access_level' &&
      this.editRoleFormControls['access_level'].hasError('required')
    ) {
      return 'Please select an Access Level';
    } else {
      return;
    }
  }

  getRoleById() {
    this.getRoleFromActivatedRouteSub = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          // this.roleId = params.id;

          this.store.dispatch(
            RolesActions.GetRoleById({
              payload: {
                id: params['id'],
              },
            })
          );
        }
      }
    );
  }

  listenToGetRoleByIdEffectSub() {
    this.getRoleByIdEffectSub = this.rolesEffects.getRoleById$.subscribe(
      (resData) => {
        if (resData !== null) {
          this.roleId = resData.payload?.id;

          this.getRoleByIdEffectResData = resData;

          this.rolePermissions = resData.payload.rolePermissions;

          this.patchEditRoleForm(this.getRoleByIdEffectResData);
        }
      }
    );
  }

  patchEditRoleForm(response: any) {
    this.editRoleForm.patchValue({
      role: response?.payload?.name,
      access_level: response?.payload?.roleAccessLevel,
    });

    this.getPermissionsByAccessLevel({
      value: response?.payload?.roleAccessLevel,
    } as MatSelectChange);
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
  }

  listenToGetPermissionByAccessLevelSelectorSub() {
    this.getAllPermissionByAccessLevel = this.store
      .pipe(select(featuresSelectors.getPermissionsByAccessLevel))
      .subscribe((resData: any) => {
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
            //this.patchEditRoleForm(this.getRoleByIdEffectResData);
            this.rolePermissions.forEach((permission) => {
              this.initialisePermissionCheckList(permission);
            });

            if (
              this.features !== undefined &&
              this.getRoleByIdEffectResData !== undefined
            ) {
              const permissionsDictionary =
                this.getRoleByIdEffectResData.payload.rolePermissions;

              permissionsDictionary.forEach((permissionDic: any) => {
                this.features?.forEach((feature) => {
                  if (feature.name === permissionDic.featureName) {
                    feature.children.forEach((permission: any) => {
                      if (permission.id === permissionDic.permissionId) {
                        if (permissionDic.status === 1) {
                          permission.isChecked = true;
                          this.updatePermissionCheckList(permission);
                        }
                      }
                    });
                  }
                });
              });
              this.startedEditing = true;
            }
          } else {
            this.features = this.mapData(allActiveFeautures);
            this.loadSelectedFeaturePermission(this.features[0], 0);
            this.startedEditing = true;
          }
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

    // I dont know what this does but commenting it out solved my problem
    if (this.startedEditing === true) {
      this.features.forEach((featureEl) => {
        if (featureEl.id === permission.parentFeatureId) {
          featureEl.checkedCount = checkedCount;
        }
      });
    }

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

  initialisePermissionCheckList(permission: any) {
    this.correctWayToShowCheckedFeatureCount();
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

  // this is a temp fix for the feature count not correct issue.
  // the whole flow needs to be rewritten for a correct / bugless page
  correctWayToShowCheckedFeatureCount() {
    this.startedEditing = false;

    this.features.forEach((x: any, index: number, arr: any[]) => {
      let count = 0;

      if (x.children.length > 0) {
        count = 0;
        x.children.forEach((y: any) => {
          if (y.isSelected === true) {
            count = count + 1;
          }
        });
      }
      this.features[index].checkedCount2 = count;
    });
  }

  onSelectAllPermissions() {
    this.startedEditing = true;
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
    // console.log(children, 'children');
    return this.object(modifiedFeatures);
  }

  validateUpdateRoleBtn() {
    const allPermissions: any[] = [];

    this.features?.forEach((feature) => {
      if (feature.children.length !== 0) {
        allPermissions.push(...feature.children);
      }
    });

    const atLeastOnePermissionIsSelected = allPermissions.some(
      (permission) => permission.isChecked === true
    );

    if (this.editRoleForm.valid && atLeastOnePermissionIsSelected === true) {
      return false;
    } else {
      return true;
    }
  }

  editRole() {
    this.store.dispatch(RolesActions.IsLoading({ payload: true }));

    let permissions: {
      status: 1 | 2;
      permissionId: number;
      name: string;
    }[] = [];

    this.features.forEach((feat: any) => {
      if (feat.children.length > 0) {
        feat.children.forEach((perm: any) => {
          if (perm.isChecked === true) {
            this.totalCheckedCount++;

            permissions.push({
              status: perm.isChecked === true ? 1 : 2,
              permissionId: perm.id,
              name: perm.name,
            });
          }
        });
      }
    });

    // Get just selected permission
    permissions = permissions.filter((permission) => {
      return permission.status === 1;
    });

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

    this.store.dispatch(
      RolesActions.EditRoleAndPermission({
        payload: {
          roleId: this.roleId,
          name: this.editRoleForm.value.role,
          rolePermissions: submittedPermissions,
          roleAccessLevel: this.editRoleForm.value.access_level,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllPermissionByAccessLevel) {
      this.getAllPermissionByAccessLevel.unsubscribe();
    }

    if (this.getAllAccessLevelSub) {
      this.getAllAccessLevelSub.unsubscribe();
    }

    if (this.getRoleFromActivatedRouteSub) {
      this.getRoleFromActivatedRouteSub.unsubscribe();
    }

    if (this.getRoleByIdEffectSub) {
      this.getRoleByIdEffectSub.unsubscribe();
    }
  }
}
