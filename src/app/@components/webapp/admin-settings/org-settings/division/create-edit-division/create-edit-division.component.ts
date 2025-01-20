import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

@Component({
  selector: 'app-create-edit-division',
  templateUrl: './create-edit-division.component.html',
  styleUrls: ['./create-edit-division.component.scss'],
})
export class CreateEditDivisionComponent implements OnInit, OnDestroy {
  isLoading!: Observable<any>;
  manageDivisionForm!: FormGroup;

  getAllDepartmentsSelectorSub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateEditDivisionComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );

    this.buildForm();

    this.patchManageDivisionsForm();
  }

  buildForm() {
    this.manageDivisionForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  get manageDivisionFormControls() {
    return this.manageDivisionForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.manageDivisionFormControls['name'].hasError('required')
    ) {
      return 'Please enter the division name';
    } else {
      return;
    }
  }

  patchManageDivisionsForm() {
    if (this.data?.instance === 'update') {
      this.manageDivisionForm.patchValue({
        name: this.data?.division?.name,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createDivision();
    } else if (this.data?.instance === 'update') {
      this.updateDivision();
    }
  }

  createDivision() {
    this.store.dispatch(
      DepartmentsActions.CreateDivision({
        payload: {
          name: this.manageDivisionForm.value.name,
          // departmentId: this.manageDivisionForm.value.departmentId,
        },
      })
    );
  }

  updateDivision() {
    this.store.dispatch(
      DepartmentsActions.UpdateDivision({
        payload: {
          name: this.manageDivisionForm.value.name,
          divisionId: this.data?.division?.id,
          // departmentId: this.manageDivisionForm.value.departmentId,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllDepartmentsSelectorSub) {
      this.getAllDepartmentsSelectorSub.unsubscribe();
    }
  }

  // createmanageDivisionForm() {
  //   this.manageDivisionForm = this.fb.group({
  //     department_name: [null, [Validators.required]],
  //   });
  // }

  // get manageDivisionFormControl() {
  //   return this.manageDivisionForm.controls;
  // }

  // getErrorMessage(instance: string) {
  //   if (
  //     instance === 'department_name' &&
  //     this.manageDivisionFormControl['department_name'].hasError('required')
  //   ) {
  //     return 'Please enter department name';
  //   } else {
  //     return;
  //   }
  // }

  // closeDialog() {
  //   this.dialogRef.close();
  // }

  // onSubmit() {
  //   this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

  //   if (this.manageInstance === 'create') {
  //     this.store.dispatch(
  //       DepartmentsActions.CreateDepartment({
  //         payload: {
  //           name: this.manageDivisionForm.value.department_name,
  //         },
  //       })
  //     );
  //   } else if (this.manageInstance === 'update') {
  //     this.store.dispatch(
  //       DepartmentsActions.UpdateDepartment({
  //         payload: {
  //           name: this.manageDivisionForm.value.department_name,
  //           departmentId: this.data?.departmentId,
  //         },
  //       })
  //     );
  //   }
  // }
}
