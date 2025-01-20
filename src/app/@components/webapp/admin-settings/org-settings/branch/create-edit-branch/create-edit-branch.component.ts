import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as departmentsSelectors from 'src/app/@core/stores/department/departments.selectors';
import * as CountryCodeAction from 'src/app/@core/stores/general/general.actions';
import * as CountryCodeSelector from 'src/app/@core/stores/general/general.selectors';

@Component({
  selector: 'app-create-edit-branch',
  templateUrl: './create-edit-branch.component.html',
  styleUrls: ['./create-edit-branch.component.scss'],
})
export class CreateEditBranchComponent implements OnInit, OnDestroy {
  createEditBranchForm!: FormGroup;
  isLoading!: Observable<boolean>;
  countryList: any;
  getAllContriesSub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateEditBranchComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(departmentsSelectors.getDepartmentsIsLoading)
    );

    this.getAllCountry();

    this.buildForm();

    this.patchEditBranchForm();
  }

  buildForm() {
    this.createEditBranchForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      area: ['', Validators.required],
      streetNumber: ['', Validators.required],
      building: [''],
      zipCode: [''],
    });
  }

  get createEditBranchFormControls() {
    return this.createEditBranchForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.createEditBranchFormControls['name'].hasError('required')
    ) {
      return `Please enter branch name`;
    } else if (
      instance === 'country' &&
      this.createEditBranchFormControls['country'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'state' &&
      this.createEditBranchFormControls['state'].hasError('required')
    ) {
      return 'Please enter your state';
    } else if (
      instance === 'area' &&
      this.createEditBranchFormControls['area'].hasError('required')
    ) {
      return `Please enter area `;
    } else if (
      instance === 'streetNumber' &&
      this.createEditBranchFormControls['streetNumber'].hasError('required')
    ) {
      return `Please enter streetNumber`;
    } else if (
      instance === 'building' &&
      this.createEditBranchFormControls['building'].hasError('required')
    ) {
      return `Please enter building`;
    } else if (
      instance === 'zipCode' &&
      this.createEditBranchFormControls['zipCode'].hasError('required')
    ) {
      return `Please enter zip code`;
    } else {
      return;
    }
  }

  getAllCountry() {
    this.store.dispatch(CountryCodeAction.GetCountryCodes());

    this.getAllContriesSub = this.store
      .pipe(select(CountryCodeSelector.getAllCountryCodes))
      .subscribe((res: any) => {
        if (res) {
          this.countryList = [...res];
          this.countryList.sort((a: any, b: any) =>
            a['name'].localeCompare(b['name'])
          );
        }
      });
  }

  patchEditBranchForm() {
    if (this.data?.instance === 'update') {
      this.createEditBranchForm.patchValue({
        name: this.data?.branch?.name,
        //country: this.data?.branch?.country,
        country: this.data.branch.address_Country,
        state: this.data.branch.address_State,
        area: this.data.branch.address_Area,
        building: this.data.branch.address_Building,
        streetNumber: this.data.branch.address_Street,
        zipCode: this.data.branch.address_ZipCode,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createBranch();
    } else if (this.data?.instance === 'update') {
      this.updateBranch();
    }
  }

  createBranch() {
    this.store.dispatch(
      DepartmentsActions.CreateBranch({
        payload: {
          name: this.createEditBranchForm.value.name,
          branchAddress_Country: this.createEditBranchForm.value.country,
          branchAddress_State: this.createEditBranchForm.value.state,
          branchAddress_Area: this.createEditBranchForm.value.area,
          branchAddress_Building: this.createEditBranchForm.value.building,
          branchAddress_Street: this.createEditBranchForm.value.streetNumber,
          branchAddress_ZipCode: this.createEditBranchForm.value.zipCode,
        },
      })
    );
  }

  updateBranch() {
    this.store.dispatch(
      DepartmentsActions.UpdateBranch({
        payload: {
          id: this.data.branch.id,
          name: this.createEditBranchForm.value.name,
          branchAddress_Country: this.createEditBranchForm.value.country,
          branchAddress_State: this.createEditBranchForm.value.state,
          branchAddress_Area: this.createEditBranchForm.value.area,
          branchAddress_Building: this.createEditBranchForm.value.building,
          branchAddress_Street: this.createEditBranchForm.value.streetNumber,
          branchAddress_ZipCode: this.createEditBranchForm.value.zipCode,
        },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.getAllContriesSub) {
      this.getAllContriesSub.unsubscribe();
    }
  }
}
