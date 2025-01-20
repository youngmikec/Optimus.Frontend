import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';

@Component({
  selector: 'app-create-edit-units',
  templateUrl: './create-edit-units.component.html',
  styleUrls: ['./create-edit-units.component.scss'],
})
export class CreateEditUnitsComponent implements OnInit, OnDestroy {
  isLoading!: Observable<any>;
  manageUnitForm!: FormGroup;
  departments: any | null = null;
  divisions: any | null = null;
  getAllDivisionsSelectorSub!: Subscription;
  getAllDepartmentsByDivisionId!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateEditUnitsComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );

    this.buildForm();

    this.getDivisions();

    this.patchManageUnitsForm();
  }

  buildForm() {
    if (this.data?.instance === 'update') {
      this.manageUnitForm = this.fb.group({
        name: [''],
        divisionId: [''],
        departmentId: [''],
      });
    } else {
      this.manageUnitForm = this.fb.group({
        name: ['', [Validators.required]],
        divisionId: ['', [Validators.required]],
        departmentId: ['', [Validators.required]],
      });
    }
  }

  get manageUnitFormControls() {
    return this.manageUnitForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.manageUnitFormControls['name'].hasError('required')
    ) {
      return 'Please enter unit name';
    } else if (
      instance === 'divisionId' &&
      this.manageUnitFormControls['divisionId'].hasError('required')
    ) {
      return 'Please select divisionId name';
    } else {
      return;
    }
  }

  // getDepartments() {
  //   this.store.dispatch(
  //     DepartmentsActions.GetAllDepartments({
  //       payload: { skip: 0, take: 0 },
  //     })
  //   );

  //   this.getAllDepartmentsSelectorSub = this.store
  //     .pipe(select(departmentsSelectors.getAllDepartments))
  //     .subscribe((resData) => {
  //       if (resData !== null) {
  //         this.departments = resData;
  //       }
  //     });
  // }

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
          this.divisions = resData;
        }
      });
  }

  // getDivisionByDepartmentId(department: MatSelectChange) {
  //   this.store.dispatch(
  //     DepartmentsActions.GetAllDivisionsByDepartmentId({
  //       payload: { id: department.value },
  //     })
  //   );

  //   this.getAllDivisionByDepartmentId = this.store
  //     .pipe(select(departmentsSelectors.getDivisionsByDepartmentId))
  //     .subscribe((resData: any) => {
  //       if (resData !== null) {
  //         this.divisions = resData;
  //       }
  //     });
  // }

  getDepartmentByDivisionId(division: MatSelectChange) {
    this.store.dispatch(
      DepartmentsActions.GetAllDepartmentsByDivisionId({
        payload: { id: division.value, skip: 0, take: 0 },
      })
    );

    this.getAllDepartmentsByDivisionId = this.store
      .pipe(select(departmentsSelectors.getDepartmentsByDivisionId))
      .subscribe((resData: any) => {
        if (resData !== null) {
          this.departments = resData;
        }
      });
  }

  patchManageUnitsForm() {
    if (this.data?.instance === 'update') {
      this.manageUnitForm.patchValue({
        name: this.data?.unit?.name,
        divisionId: this.data?.unit?.divisionId,
      });

      if (this.manageUnitForm.value.divisionId) {
        this.getDepartmentByDivisionId({
          value: this.manageUnitForm.value.divisionId,
        } as MatSelectChange);

        this.manageUnitForm.patchValue({
          departmentId: this.data?.unit?.departmentId,
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createUnit();
    } else if (this.data?.instance === 'update') {
      this.updateUnit();
    }
  }

  createUnit() {
    this.store.dispatch(
      DepartmentsActions.CreateUnit({
        payload: {
          name: this.manageUnitForm.value.name,
          departmentId: this.manageUnitForm.value.departmentId,
        },
      })
    );
  }

  updateUnit() {
    this.store.dispatch(
      DepartmentsActions.UpdateUnit({
        payload: {
          name: this.manageUnitForm.value.name,
          unitId: this.data?.unit?.id,
          divisionId: this.manageUnitForm.value.divisionId,
          departmentId: this.manageUnitForm.value.departmentId,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllDivisionsSelectorSub) {
      this.getAllDivisionsSelectorSub.unsubscribe();
    }

    if (this.getAllDepartmentsByDivisionId) {
      this.getAllDepartmentsByDivisionId.unsubscribe();
    }
  }
}
