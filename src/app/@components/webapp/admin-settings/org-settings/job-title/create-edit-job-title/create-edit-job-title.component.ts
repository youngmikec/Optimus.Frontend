import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

@Component({
  selector: 'app-create-edit-job-title',
  templateUrl: './create-edit-job-title.component.html',
  styleUrls: ['./create-edit-job-title.component.scss'],
})
export class CreateEditJobTitleComponent implements OnInit {
  addEditJobTitleForm!: FormGroup;
  isLoading!: Observable<boolean>;
  description!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEditJobTitleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );
    this.buildForm();
    if (this.data?.instance === 'update') this.patchManageDepartmentForm();
  }

  buildForm() {
    this.addEditJobTitleForm = this.fb.group({
      jobTitle: ['', Validators.required],
    });
  }

  get addEditJobTitleFormControls() {
    return this.addEditJobTitleForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'jobTitle' &&
      this.addEditJobTitleForm.get('jobTitle')?.hasError('required')
    )
      return 'Please enter job title';

    return;
  }

  patchManageDepartmentForm() {
    const { name } = this.data.jobTitle;
    this.addEditJobTitleForm.patchValue({
      jobTitle: name,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));
    if (this.data?.instance === 'create') this.createJobTitle();
    else this.updateJobTitle();
  }

  createJobTitle() {
    this.store.dispatch(
      DepartmentsActions.CreateJobTitle({
        payload: {
          jobTitle: this.addEditJobTitleForm.value.jobTitle,
        },
      })
    );
  }

  updateJobTitle() {
    this.store.dispatch(
      DepartmentsActions.UpdateJobTitle({
        payload: {
          id: this.data.jobTitle.id,
          jobTitle: this.addEditJobTitleForm.value.jobTitle,
        },
      })
    );

    this.closeDialog();
  }
}
