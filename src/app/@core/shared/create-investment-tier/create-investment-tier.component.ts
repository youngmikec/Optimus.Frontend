import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';

@Component({
  selector: 'app-create-investment-tier',
  templateUrl: './create-investment-tier.component.html',
  styleUrls: ['./create-investment-tier.component.scss'],
})
export class CreateInvestmentTierComponent implements OnInit {
  createForm!: FormGroup;
  selectedCountry!: any;
  selectedMigrationRoute!: any;

  formMode: string = 'create';
  isLoading!: Observable<boolean>;
  editInvestmentTierData!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<CreateInvestmentTierComponent>
  ) {
    this.formMode = this.data.mode;
    this.createForm = this.fb.group({
      name: ['', this.formMode === 'create' && Validators.required],
      serialNumber: [1],
    });
  }

  ngOnInit(): void {
    this.formMode = this.data.mode;
    this.selectedCountry = this.data.country;
    this.selectedMigrationRoute = this.data.migrationRoute;
    this.editInvestmentTierData = this.data.editInvestmentTier;

    this.isLoading = this.store.pipe(
      select(MigrationRouteSelector.getMigrationRouteIsLoading)
    );

    if (this.formMode !== 'create' && this.editInvestmentTierData) {
      this.buildForm(this.editInvestmentTierData);
    }
  }

  get formControls() {
    return this.createForm.controls;
  }

  buildForm(record: any): void {
    this.createForm.patchValue({
      name: record.name,
      serialNumber: record.sequenceNo,
    });
  }

  getErrorMessage(instance: string): string {
    let errorMsg: string = '';
    if (instance === 'name' && this.formControls['name'].hasError('required')) {
      errorMsg = `This field is required`;
    }
    if (
      instance === 'serialNumber' &&
      this.formControls['serialNumber'].hasError('required')
    ) {
      errorMsg = `This field is required`;
    }

    return errorMsg;
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      return;
    } else {
      this.createForm.controls['name'].enable();
      this.store.dispatch(MigrationRoutesActions.IsLoading({ payload: true }));

      if (this.formMode === 'create') {
        this.createInvestmentTier();
      } else {
        this.editInvestmentTier();
      }
    }
  }

  createInvestmentTier(): void {
    this.store.dispatch(
      MigrationRoutesActions.CreateInvestmentTier({
        payload: {
          countryId: this.selectedCountry?.id,
          name: this.createForm.value.name,
          serialNumber: this.createForm.value.serialNumber,
          migrationRouteId: this.selectedMigrationRoute?.id,
        },
      })
    );
  }

  editInvestmentTier(): void {
    if (this.editInvestmentTierData) {
      this.store.dispatch(
        MigrationRoutesActions.EditInvestmentTier({
          payload: {
            id: this.editInvestmentTierData?.id,
            // countryId: this.selectedCountry?.id,
            name: this.createForm.value.name,
            serialNo: this.createForm.value.serialNumber,
            status: this.editInvestmentTierData?.status,
            migrationRouteId: this.selectedMigrationRoute?.id,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
