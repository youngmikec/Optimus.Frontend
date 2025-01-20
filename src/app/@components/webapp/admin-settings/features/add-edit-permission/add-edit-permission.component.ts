import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { accessLevels } from 'src/app/@core/enums/access-level.enum';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as FeaturesActions from 'src/app/@core/stores/features/features.actions';
import * as featuresSelectors from 'src/app/@core/stores/features/features.selectors';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styleUrls: ['./add-edit-permission.component.scss'],
})
export class AddEditPermissionComponent implements OnInit {
  addEditPermissionForm!: FormGroup;
  accessLevels = accessLevels;
  isLoading!: Observable<boolean>;
  getAllFeaturesSub!: Subscription;
  features!: any[];
  selectedAccess: any[] = [];
  superAdminValue: boolean = false;
  regularUserValue: boolean = false;
  adminValue: boolean = false;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.buildForm();

    this.isLoading = this.store.pipe(
      select(featuresSelectors.getFeaturesIsLoading)
    );

    this.features = this.data.features;

    if (this.data.type === 'edit') {
      this.addEditPermissionForm.patchValue({
        permissionName: this.data.permission.name,
        featureName: this.data.permission.parentFeatureId,
      });

      for (
        let i = 0;
        i < this.data.permission.permissionAccessLevels.length;
        i++
      ) {
        // console.log(this.data.permission.permissionAccessLevels[i]);

        this.selectedAccess.push(
          this.data.permission.permissionAccessLevels[i].accessLevel
        );

        if (this.data.permission.permissionAccessLevels[i].accessLevel === 1)
          this.regularUserValue = true;
        if (this.data.permission.permissionAccessLevels[i].accessLevel === 3)
          this.superAdminValue = true;
        if (this.data.permission.permissionAccessLevels[i].accessLevel === 2)
          this.adminValue = true;
      }
    }
  }

  buildForm() {
    this.addEditPermissionForm = this.fb.group({
      permissionName: ['', Validators.required],
      featureName: ['', Validators.required],
      accessLevel: [''],
    });
  }

  get addEditPermissionFormControls() {
    return this.addEditPermissionForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'permissionName' &&
      this.addEditPermissionFormControls['permissionName'].hasError('required')
    ) {
      return 'Please enter Permission name';
    } else if (
      instance === 'featureName' &&
      this.addEditPermissionFormControls['featureName'].hasError('required')
    ) {
      return 'Please select feature name';
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectAccessLevel(e: any) {
    // optivaUser = 1
    // systemSupport = 2
    // vendor = 3

    if (e.checked) {
      this.selectedAccess.push(parseInt(e.source.value));
    } else {
      for (let i = 0; i < this.selectedAccess.length; i++) {
        if (this.selectedAccess[i] === parseInt(e.source.value)) {
          this.selectedAccess.splice(i, 1);
        }
      }
    }
  }

  onSubmit() {
    this.store.dispatch(FeaturesActions.IsLoading({ payload: true }));

    if (this.data.type === 'create') {
      this.createPermission();
    } else {
      this.editPermission();
    }
  }

  createPermission() {
    this.store.dispatch(
      FeaturesActions.CreateFeature({
        payload: {
          name: this.addEditPermissionForm.value.permissionName,
          parentFeatureId: this.addEditPermissionForm.value.featureName
            ? this.addEditPermissionForm.value.featureName
            : 0,
          permissionAccessLevels: this.selectedAccess,
        },
      })
    );
  }

  editPermission() {
    this.store.dispatch(
      FeaturesActions.EditFeature({
        payload: {
          id: this.data.permission.id,
          parentFeatureId: this.addEditPermissionForm.value.featureName,
          name: this.addEditPermissionForm.value.permissionName,
          permissionAccessLevels: this.selectedAccess,
        },
      })
    );
  }
}
