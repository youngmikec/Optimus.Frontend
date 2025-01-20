import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as FeaturesActions from 'src/app/@core/stores/features/features.actions';
import * as featuresSelectors from 'src/app/@core/stores/features/features.selectors';

@Component({
  selector: 'app-add-edit-feature',
  templateUrl: './add-edit-feature.component.html',
  styleUrls: ['./add-edit-feature.component.scss'],
})
export class AddEditFeatureComponent implements OnInit {
  addEditFeatureForm!: FormGroup;
  isLoading!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditFeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(featuresSelectors.getFeaturesIsLoading)
    );

    this.buildForm();

    if (this.data.type === 'edit') {
      this.addEditFeatureForm.patchValue({
        featureName: this.data.feature.name,
      });
    }
  }

  buildForm() {
    this.addEditFeatureForm = this.fb.group({
      featureName: ['', Validators.required],
    });
  }

  get addEditFeatureFormControls() {
    return this.addEditFeatureForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'featureName' &&
      this.addEditFeatureFormControls['featureName'].hasError('required')
    ) {
      return 'Please enter Feature name';
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(FeaturesActions.IsLoading({ payload: true }));

    if (this.data.type === 'edit') {
      this.store.dispatch(
        FeaturesActions.EditFeature({
          payload: {
            id: this.data.feature.id,
            parentFeatureId: 0,
            name: this.addEditFeatureForm.value.featureName,
            permissionAccessLevels: [],
          },
        })
      );
    } else {
      this.store.dispatch(
        FeaturesActions.CreateFeature({
          payload: {
            parentFeatureId: 0,
            name: this.addEditFeatureForm.value.featureName,
            permissionAccessLevels: [],
          },
        })
      );
    }
  }
}
