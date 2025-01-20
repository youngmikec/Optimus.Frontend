import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as MigrationRouteActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as PaymentPlanAction from 'src/app/@core/stores/paymentPlan/paymentPlan.actions';
import * as PaymentPlanSelector from 'src/app/@core/stores/paymentPlan/paymentPlan.selectors';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { IMigrationRoute } from 'src/app/@core/models/migration-route.model';

@Component({
  selector: 'app-create-payment-plan',
  templateUrl: './create-payment-plan.component.html',
  styleUrls: ['./create-payment-plan.component.scss'],
})
export class CreatePaymentPlanComponent implements OnInit {
  createPaymentPlanForm!: FormGroup;

  isLoading!: Observable<boolean>;
  getAllContriesSub!: Subscription;
  countryList: any[] = [];
  migrationRouteList: IMigrationRoute[] = [];
  editPaymentPlanData: any = {};
  feeCategoryList: any[] = [
    { name: 'Local fee', value: 1 },
    { name: 'Country fee', value: 2 },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreatePaymentPlanComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
    this.buildCreateInvoiceForm();

    this.createPaymentPlanForm.patchValue({
      countryId: this.data.countryId,
    });
    this.getMigrationRoutesByCountryId(this.data.countryId);

    this.isLoading = this.store.pipe(
      select(PaymentPlanSelector.getPaymentPlansIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editPaymentPlanData = this.data?.editData;

      this.createPaymentPlanForm.patchValue({
        countryId: this.editPaymentPlanData.countryId,
        migrationRouteId: this.editPaymentPlanData.migrationRouteId,
        percentage: this.editPaymentPlanData.percentage,
        serialNumber: this.editPaymentPlanData.serialNumber,
        name: this.editPaymentPlanData.name,
        description: this.editPaymentPlanData.description,
        numberOfInstallment: this.editPaymentPlanData.numberOfInstalment,
        duration: this.editPaymentPlanData.duration,
        downPayment: this.editPaymentPlanData.downPayment,
        interestRate: this.editPaymentPlanData.interestRate,
        feeCategory: this.editPaymentPlanData.feeCategory,
      });
    }
    this.createPaymentPlanForm.controls['countryId'].disable();
  }

  buildCreateInvoiceForm() {
    this.createPaymentPlanForm = this.fb.group({
      countryId: [null, [Validators.required]],
      migrationRouteId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      numberOfInstallment: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      downPayment: [null, [Validators.required]],
      interestRate: [null],
      percentage: [null, [Validators.required]],
      serialNumber: [1],
      feeCategory: [1, [Validators.required]],
    });
  }

  get createPaymentPlansFormControls() {
    return this.createPaymentPlanForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createPaymentPlansFormControls['countryId'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'migrationRouteId' &&
      this.createPaymentPlansFormControls['migrationRouteId'].hasError(
        'required'
      )
    ) {
      return `Please select Migration Route`;
    } else if (
      instance === 'percentage' &&
      this.createPaymentPlansFormControls['percentage'].hasError('required')
    ) {
      return `Please Add A Percentage`;
    } else if (
      instance === 'serialNumber' &&
      this.createPaymentPlansFormControls['serialNumber'].hasError('required')
    ) {
      return `Please Add A serialNumber`;
    } else if (
      instance === 'name' &&
      this.createPaymentPlansFormControls['name'].hasError('required')
    ) {
      return `Please enter payment plan name`;
    } else if (
      instance === 'numberOfInstallment' &&
      this.createPaymentPlansFormControls['numberOfInstallment'].hasError(
        'required'
      )
    ) {
      return `Please enter number of installment`;
    } else if (
      instance === 'duration' &&
      this.createPaymentPlansFormControls['duration'].hasError('required')
    ) {
      return `Please enter duration`;
    } else if (
      instance === 'downPayment' &&
      this.createPaymentPlansFormControls['downPayment'].hasError('required')
    ) {
      return `Please enter down payment`;
    } else if (
      instance === 'interestRate' &&
      this.createPaymentPlansFormControls['interestRate'].hasError('required')
    ) {
      return `Please enter interest rate`;
    } else {
      return;
    }
  }

  getAllCountry() {
    this.store.dispatch(
      CountriesActions.GetAllCountry({
        payload: {
          skip: 0,
          take: 9999,
        },
      })
    );
    this.getAllContriesSub = this.store
      .pipe(select(CountriesSelector.getAllCountry))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
        }
      });
  }

  getMigrationRoutesByCountryId(countryId: number) {
    this.store.dispatch(
      MigrationRouteActions.GetAllMigrationRoutesByCountryId({
        payload: {
          id: countryId,
        },
      })
    );
    this.store
      .pipe(select(MigrationRouteSelector.getAllMigrationRoutesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.migrationRouteList = resData;
        }
      });
  }

  onSubmit() {
    if (this.createPaymentPlanForm.invalid) {
      return;
    } else {
      this.createPaymentPlanForm.controls['countryId'].enable();
      this.store.dispatch(PaymentPlanAction.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createPaymentPlans();
      } else if (this.data.type === 'edit') {
        this.editPaymentPlans();
      }
    }
  }

  createPaymentPlans() {
    this.store.dispatch(
      PaymentPlanAction.CreatePaymentPlan({
        payload: {
          countryId: this.createPaymentPlanForm.value.countryId,
          migrationRouteId: this.createPaymentPlanForm.value.migrationRouteId,
          percentage: this.createPaymentPlanForm.value.percentage,
          serialNumber: this.createPaymentPlanForm.value.serialNumber,
          name: this.createPaymentPlanForm.value.name,
          description: this.createPaymentPlanForm.value.name,
          numberOfInstallment:
            this.createPaymentPlanForm.value.numberOfInstallment,
          duration: this.createPaymentPlanForm.value.duration,
          downPayment: this.createPaymentPlanForm.value.downPayment,
          interestRate: this.createPaymentPlanForm.value.interestRate
            ? this.createPaymentPlanForm.value.interestRate
            : 0,
          feeCategory: this.createPaymentPlanForm.value.feeCategory,
          skip: this.data.skip,
          take: this.data.take,
        },
      })
    );
  }

  editPaymentPlans() {
    if (this.editPaymentPlanData) {
      this.store.dispatch(
        PaymentPlanAction.EditPaymentPlan({
          payload: {
            id: this.editPaymentPlanData.id,
            countryId: this.createPaymentPlanForm.value.countryId,
            migrationRouteId: this.createPaymentPlanForm.value.migrationRouteId,
            percentage: this.createPaymentPlanForm.value.percentage,
            serialNumber: this.createPaymentPlanForm.value.serialNumber,
            name: this.createPaymentPlanForm.value.name,
            description: this.createPaymentPlanForm.value.name,
            numberOfInstallment:
              this.createPaymentPlanForm.value.numberOfInstallment,
            duration: this.createPaymentPlanForm.value.duration,
            downPayment: this.createPaymentPlanForm.value.downPayment,
            interestRate: this.createPaymentPlanForm.value.interestRate
              ? this.createPaymentPlanForm.value.interestRate
              : 0,
            feeCategory: this.createPaymentPlanForm.value.feeCategory,
            skip: this.data.skip,
            take: this.data.take,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
