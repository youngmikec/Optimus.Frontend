import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
})
export class CreateEditComponent implements OnInit, OnDestroy {
  addEditDepartmentForm!: FormGroup;
  isLoading!: Observable<boolean>;
  description!: string;
  getAllDivisionsSelectorSub!: Subscription;
  divisions: any[] | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );

    this.buildForm();

    this.patchManageDepartmentForm();

    this.getDivisions();

    //console.log(this.data, 'data');
  }

  buildForm() {
    this.addEditDepartmentForm = this.fb.group({
      name: ['', Validators.required],
      divisionId: [null],
    });
  }

  get addEditDepartmentFormControls() {
    return this.addEditDepartmentForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.addEditDepartmentFormControls['name'].hasError('required')
    ) {
      return 'Please enter department name';
    } else {
      return;
    }
  }

  getDivisions() {
    this.store.dispatch(
      DepartmentsActions.GetActiveDivisions({
        payload: { skip: 0, take: 0 },
      })
    );

    this.getAllDivisionsSelectorSub = this.store
      .pipe(select(departmentsSelectors.getActiveDivisions))
      .subscribe((resData: any) => {
        if (resData !== null) {
          this.divisions = resData.entity;
        }
      });
  }

  patchManageDepartmentForm() {
    if (this.data?.instance === 'update') {
      this.addEditDepartmentForm.patchValue({
        name: this.data.department.name,
        divisionId: this.data?.department?.divisionId,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createDepartment();
    } else if (this.data?.instance === 'update') {
      this.updateDepartment();
    }
  }

  createDepartment() {
    this.store.dispatch(
      DepartmentsActions.CreateDepartment({
        payload: {
          name: this.addEditDepartmentForm.value.name,
          divisionId: this.addEditDepartmentForm.value.divisionId,
        },
      })
    );
  }

  updateDepartment() {
    this.store.dispatch(
      DepartmentsActions.UpdateDepartment({
        payload: {
          departmentId: this.data.department.id,
          divisionId: this.addEditDepartmentForm.value.divisionId,
          name: this.addEditDepartmentForm.value.name,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllDivisionsSelectorSub) {
      this.getAllDivisionsSelectorSub.unsubscribe();
    }
  }
}
