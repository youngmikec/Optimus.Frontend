import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as InvoiceItemConfigurationActions from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.actions';
import * as invoiceItemSelectors from 'src/app/@core/stores/invoiceItemConfiguration/invoiceItemConfiguration.selectors';

import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';

import * as MigrationRoutesActions from 'src/app/@core/stores/migrationRoutes/migrationRoutes.actions';
import * as MigrationRoutesSelector from 'src/app/@core/stores/migrationRoutes/migrationRoutes.selectors';

import { CountryData } from '../../country-setup/country-setup.component';
import { MigrationData } from '../../country-setup/country-dashboard/migration-routes/migration-routes.component';

@Component({
  selector: 'app-create-new-invoice-item',
  templateUrl: './create-new-invoice-item.component.html',
  styleUrls: ['./create-new-invoice-item.component.scss'],
})
export class CreateNewInvoiceItemComponent implements OnInit {
  addEditInvoiceItemForm!: FormGroup;
  isLoading!: Observable<boolean>;
  isGetCountryLoading!: Observable<boolean>;
  isGetMigrationRouteLoading!: Observable<boolean>;
  description!: string;

  getAllContriesSub!: Subscription;

  countryList: CountryData[] = [];
  migrationRouteList: MigrationData[] = [];
  showMigrationError = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateNewInvoiceItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.isLoading = this.store.pipe(
      select(invoiceItemSelectors.getInvoiceItemsIsLoading)
    );
    this.isGetCountryLoading = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );
    this.isGetMigrationRouteLoading = this.store.pipe(
      select(invoiceItemSelectors.getInvoiceItemsIsLoading)
    );
    this.buildForm();

    this.getAllContries();

    if (this.data?.instance === 'update') {
      this.patchManageInvoiceItemForm();
    }
  }

  getAllContries() {
    this.store.dispatch(CountriesActions.GetActiveCountries());
    this.getAllContriesSub = this.store
      .pipe(select(CountriesSelector.getActiveCountries))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
        }
      });
  }

  onCountryChange() {
    const countryId = Number(this.addEditInvoiceItemForm.value.countryId);

    if (!countryId || countryId === 0) return;
    this.getMigrationRouteByCountryId(countryId);
  }

  getMigrationRouteByCountryId(countryId: number) {
    this.store.dispatch(
      MigrationRoutesActions.GetActiveMigrationRoutesByCountryId({
        payload: { id: countryId },
      })
    );

    this.getAllContriesSub = this.store
      .pipe(select(MigrationRoutesSelector.getActiveMigrationRoutesByCountryId))
      .subscribe((resData: any) => {
        if (resData) {
          resData.length > 0
            ? (this.showMigrationError = false)
            : (this.showMigrationError = true);
          this.migrationRouteList = resData;
        }
      });
  }

  buildForm() {
    this.addEditInvoiceItemForm = this.fb.group({
      name: [null],
      countryId: [null, Validators.required],
      allMigrationRoute: [true],
      migrationRouteId: [null],
      percentageCountryFee: [null, Validators.required],
      percentageLocalFee: [null, Validators.required],
      localFeeAmount: [null, Validators.required],
      isLocalFee: [true],
      isPaymentPlan: [true],
    });
  }

  get addEditInvoiceItemFormControls() {
    return this.addEditInvoiceItemForm?.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.addEditInvoiceItemForm.get('name')?.hasError('required')
    ) {
      return 'Please enter item Amount';
    } else if (
      instance === 'countryId' &&
      this.addEditInvoiceItemForm.get('countryId')?.hasError('required')
    ) {
      return 'Please select country';
    } else if (
      instance === 'localFeeAmount' &&
      this.addEditInvoiceItemForm.get('localFeeAmount')?.hasError('required')
    ) {
      return 'Please enter local fee amount';
    } else if (
      instance === 'percentageLocalFee' &&
      this.addEditInvoiceItemForm
        .get('percentageLocalFee')
        ?.hasError('required')
    ) {
      return 'Please enter local fee percentage';
    } else if (
      instance === 'percentageCountryFee' &&
      this.addEditInvoiceItemForm
        .get('percentageCountryFee')
        ?.hasError('required')
    ) {
      return 'Please enter country fee percentage';
    }

    return;
  }

  patchManageInvoiceItemForm() {
    this.addEditInvoiceItemForm.patchValue({
      name: this.data.invoiceItem.name,
      countryId: this.data.invoiceItem.countryId,
      allMigrationRoute: this.data.invoiceItem.allMigrationRoute,
      migrationRouteId: this.data.invoiceItem.migrationRouteId,
      percentageCountryFee: this.data.invoiceItem.percentageCountryFee,
      percentageLocalFee: this.data.invoiceItem.percentageLocalFee,
      localFeeAmount: this.data.invoiceItem.localFeeAmount,
      isLocalFee: this.data.invoiceItem.isLocalFee,
      isPaymentPlan: this.data.invoiceItem.isPaymentPlan,
    });
    this.onCountryChange();
    this.addEditInvoiceItemForm.controls['countryId'].disable();
  }

  onSubmit() {
    this.addEditInvoiceItemForm.controls['countryId'].enable();

    if (this.data?.instance === 'update') {
      this.updateInvoiceItem();
      return;
    } else {
      const pastCreatedInvoiceItemsByCountry = this.data.invoiceItemList.filter(
        (item: any) =>
          item.countryId === this.addEditInvoiceItemForm.value.countryId
      );

      if (pastCreatedInvoiceItemsByCountry.length > 0) {
        for (const item of pastCreatedInvoiceItemsByCountry) {
          if (
            this.addEditInvoiceItemForm.value.migrationRouteId &&
            item.migrationRouteId ===
              this.addEditInvoiceItemForm.value.migrationRouteId
          ) {
            this.updateInvoiceItem(item.id);
            break;
          } else if (item.allMigrationRoute) {
            this.updateInvoiceItem(item.id);
            break;
          } else {
            this.createInvoiceItem();
            break;
          }
        }
      } else {
        this.createInvoiceItem();
      }
    }
  }

  createInvoiceItem() {
    this.store.dispatch(
      InvoiceItemConfigurationActions.CreateInvoiceItem({
        payload: {
          name: String(this.addEditInvoiceItemForm.value.localFeeAmount),
          isLocalFee: this.addEditInvoiceItemForm.value.isLocalFee,
          isPaymentPlan: this.addEditInvoiceItemForm.value.isPaymentPlan,
          localFeeAmount: this.addEditInvoiceItemForm.value.localFeeAmount,
          countryId: this.addEditInvoiceItemForm.value.countryId,
          allMigrationRoute:
            this.addEditInvoiceItemForm.value.allMigrationRoute,
          migrationRouteId: this.addEditInvoiceItemForm.value.migrationRouteId,
          percentageCountryFee:
            this.addEditInvoiceItemForm.value.percentageCountryFee,
          percentageLocalFee:
            this.addEditInvoiceItemForm.value.percentageLocalFee,
        },
      })
    );
  }

  updateInvoiceItem(invoiceItemId?: number) {
    this.store.dispatch(
      InvoiceItemConfigurationActions.UpdateInvoiceItem({
        payload: {
          id: invoiceItemId ?? this.data.invoiceItem.id,
          name: String(this.addEditInvoiceItemForm.value.localFeeAmount),
          isLocalFee: this.addEditInvoiceItemForm.value.isLocalFee,
          isPaymentPlan: this.addEditInvoiceItemForm.value.isPaymentPlan,
          countryId: this.addEditInvoiceItemForm.value.countryId,
          allMigrationRoute:
            this.addEditInvoiceItemForm.value.allMigrationRoute,
          migrationRouteId: this.addEditInvoiceItemForm.value.migrationRouteId,
          percentageCountryFee:
            this.addEditInvoiceItemForm.value.percentageCountryFee,
          percentageLocalFee:
            this.addEditInvoiceItemForm.value.percentageLocalFee,
          localFeeAmount: this.addEditInvoiceItemForm.value.localFeeAmount,

          skip: this.data.skip,
          take: this.data.take,
        },
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
