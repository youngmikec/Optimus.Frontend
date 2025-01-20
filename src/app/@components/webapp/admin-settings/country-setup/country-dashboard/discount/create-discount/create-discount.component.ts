import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Observable, Subscription, filter, take } from 'rxjs';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as MigrationRouteActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRouteSelectors from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelector from 'src/app/@core/stores/discount/discount.selectors';
import { IMigrationRoute } from 'src/app/@core/models/migration-route.model';
import { IDiscountType } from 'src/app/@core/models/discount-request.model';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss'],
})
export class CreateDiscountComponent implements OnInit, OnDestroy {
  createDiscountForm!: FormGroup;

  countryList: any[] = [];
  migrationRouteList: IMigrationRoute[] = [];
  discountTypeList: IDiscountType[] = [];

  editMigrationRouteData: any = {};
  isLoading!: Observable<boolean>;
  getAllContriesSub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateDiscountComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
    this.buildCreateMigrationForm();

    this.getDiscountTypes();

    this.isLoading = this.store.pipe(
      select(DiscountSelector.getDiscountIsLoading)
    );

    this.getMigrationRoutesByCountryId(this.data.countryId);
    if (this.data.type === 'edit') {
      this.editMigrationRouteData = this.data?.editData;

      this.createDiscountForm.patchValue({
        countryId: this.editMigrationRouteData.countryId,
        name: this.editMigrationRouteData.name,
        description: this.editMigrationRouteData.description,
        routeUrl: this.editMigrationRouteData.routeUrl,
      });
    } else {
      this.createDiscountForm.patchValue({
        countryId: this.data.countryId,
      });
    }
    this.createDiscountForm.controls['countryId'].disable();
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

  getDiscountTypes(): void {
    this.store.dispatch(DiscountActions.GetDiscountTypes());

    this.store
      .pipe(select(DiscountSelector.getDiscountTypes))
      .subscribe((resData: any) => {
        if (resData) {
          this.discountTypeList = resData;
        }
      });
  }

  getMigrationRoutesByCountryId(countryId: number) {
    this.store.dispatch(
      MigrationRouteActions.GetActiveMigrationRoutesByCountryId({
        payload: {
          id: countryId,
        },
      })
    );

    this.store
      .pipe(select(MigrationRouteSelectors.getActiveMigrationRoutesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          this.migrationRouteList = resData;
        }
      });
  }

  buildCreateMigrationForm() {
    this.createDiscountForm = this.fb.group(
      {
        countryId: [null, [Validators.required]],
        migrationRouteId: [null, [Validators.required]],
        discountType: [1, [Validators.required]],
        discountPercentage: [0],
        flatAmount: [0],
        startDate: ['', [Validators.required, this.stateDateValidator]],
        endDate: ['', [Validators.required]],
      },
      { validator: this.endDateGreaterThanStartDate }
    );
  }

  // Custom validator for start date to be today or a future date
  stateDateValidator(control: any) {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    // Set current date's time to 00:00:00 for comparison
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
      return { pastDate: true };
    }
    return null;
  }

  // Custom validator for end date to be greater than start date
  endDateGreaterThanStartDate(group: FormGroup) {
    const startDate = new Date(group.controls['startDate'].value);
    const endDate = new Date(group.controls['endDate'].value);

    if (endDate < startDate) {
      return { endDateInvalid: true };
    }
    return null;
  }

  onEndDateSelected($event: any) {
    if (this.createDiscountForm.value['startDate'] && $event.target.value) {
      const startDate = new Date(this.createDiscountForm.value['startDate']);
      const endDate = new Date(this.createDiscountForm.value['endDate']);

      if (endDate < startDate) {
        this.createDiscountForm.markAllAsTouched();
        this.createDiscountForm.updateValueAndValidity();
        this.createDiscountFormControls['endDate'].setErrors({
          endDateInvalid: true,
        });
      }
    }
  }

  get createDiscountFormControls() {
    return this.createDiscountForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createDiscountFormControls['countryId'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'migrationRouteId' &&
      this.createDiscountFormControls['migrationRouteId'].hasError('required')
    ) {
      return `Please enter Route migrationRouteId`;
    } else if (
      instance === 'discountType' &&
      this.createDiscountFormControls['discountType'].hasError('required')
    ) {
      return `Please enter Discount Type`;
    } else if (
      instance === 'startDate' &&
      this.createDiscountFormControls['startDate'].hasError('required')
    ) {
      return `Please enter start date`;
    } else if (
      instance === 'startDate' &&
      this.createDiscountFormControls['startDate'].hasError('pastDate')
    ) {
      return `Start date must be today or future date`;
    } else if (
      instance === 'endDate' &&
      this.createDiscountFormControls['endDate'].hasError('required')
    ) {
      return `Please enter end date`;
    } else if (
      instance === 'endDate' &&
      this.createDiscountFormControls['endDate'].hasError('endDateInvalid')
    ) {
      return `End date cannot be before the start date`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createDiscountForm.invalid) {
      return;
    } else {
      this.createDiscountForm.controls['countryId'].enable();
      this.store.dispatch(DiscountActions.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createDiscount();
      } else if (this.data.type === 'edit') {
        this.editMigrationRoute();
      }
    }
  }

  createDiscount() {
    this.store.dispatch(
      DiscountActions.CreateDiscount({
        payload: {
          countryId: this.createDiscountForm.value.countryId,
          migrationRouteId: parseInt(
            this.createDiscountForm.value.migrationRouteId
          ),
          applicationId: 0,
          discountType: this.createDiscountForm.value.discountType,
          discountPercentage: parseInt(
            this.createDiscountForm.value.discountPercentage
          ),
          flatAmount: parseInt(this.createDiscountForm.value.flatAmount),
          startDate: this.createDiscountForm.value.startDate,
          endDate: this.createDiscountForm.value.endDate,
        },
      })
    );
    this.store
      .select((state) => state.discounts)
      .pipe(
        filter((state) => state.success),
        take(1)
      )
      .subscribe(() => {
        this.closeDialog();
        this.store.dispatch(DiscountActions.ResetCreateEditDiscountState());
      });
  }

  editMigrationRoute() {
    if (this.editMigrationRouteData) {
      this.store.dispatch(
        DiscountActions.EditDiscount({
          payload: {
            id: this.editMigrationRouteData.id,
            countryId: this.createDiscountForm.value.countryId,
            migrationRouteId: parseInt(
              this.createDiscountForm.value.migrationRouteId
            ),
            applicationId: 0,
            discountType: this.createDiscountForm.value.discountType,
            discountPercentage: parseInt(
              this.createDiscountForm.value.discountPercentage
            ),
            flatAmount: parseInt(this.createDiscountForm.value.flatAmount),
            startDate: this.createDiscountForm.value.startDate,
            endDate: this.createDiscountForm.value.endDate,
          },
        })
      );
      this.store
        .select((state) => state.discounts)
        .pipe(
          filter((state) => state.success),
          take(1)
        )
        .subscribe(() => {
          this.closeDialog();
          this.store.dispatch(DiscountActions.ResetCreateEditDiscountState());
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.getAllContriesSub) {
      this.getAllContriesSub;
    }
  }
}
