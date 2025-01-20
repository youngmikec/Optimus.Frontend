import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as InvoiceCurrenciesAction from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.actions';
import * as InvoiceCurrenciesSelector from 'src/app/@core/stores/invoiceCurrencies/invoiceCurrencies.selectors';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
})
export class CreateInvoiceComponent implements OnInit {
  createInvoiceForm!: FormGroup;

  isLoading!: Observable<boolean>;
  getAllContriesSub!: Subscription;
  countryList: any[] = [];
  currencyList: any[] = [];
  editPaymentPlanData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateInvoiceComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
    this.getAllCurrencies();
    this.buildCreateInvoiceForm();

    this.createInvoiceForm.patchValue({
      countryId: this.data.countryId,
    });

    this.isLoading = this.store.pipe(
      select(InvoiceCurrenciesSelector.getInvoiceCurrenciesIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editPaymentPlanData = this.data?.editData;

      this.createInvoiceForm.patchValue({
        countryId: this.editPaymentPlanData.countryId,
        currencyId: this.editPaymentPlanData.currencyId,
        currencyCode: this.editPaymentPlanData.currencyCode,
        isQuoteCurrency: this.editPaymentPlanData.isQuoteCurrency,
        isDefault: this.editPaymentPlanData.isDefault,
        description: this.editPaymentPlanData.description,
      });
    }
    this.createInvoiceForm.controls['countryId'].disable();
  }

  buildCreateInvoiceForm() {
    this.createInvoiceForm = this.fb.group({
      countryId: [null, [Validators.required]],
      currencyId: [null, [Validators.required]],
      currencyCode: [null],
      isQuoteCurrency: [true, [Validators.required]],
      isDefault: [true, [Validators.required]],
      description: [null],
    });
  }

  get createCountryFormControls() {
    return this.createInvoiceForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'countryId' &&
      this.createCountryFormControls['countryId'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'currencyId' &&
      this.createCountryFormControls['currencyId'].hasError('required')
    ) {
      return `Please select currency`;
    } else if (
      instance === 'isQuoteCurrency' &&
      this.createCountryFormControls['isQuoteCurrency'].hasError('required')
    ) {
      return ``;
    } else if (
      instance === 'isDefault' &&
      this.createCountryFormControls['isDefault'].hasError('required')
    ) {
      return ``;
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

  getAllCurrencies() {
    this.store
      .pipe(select(CurrencySelector.getAllCurrencies))
      .subscribe((resData: any) => {
        if (resData) {
          this.currencyList = resData;
        }
      });
  }

  onSubmit() {
    if (this.createInvoiceForm.invalid) {
      return;
    } else {
      this.createInvoiceForm.controls['countryId'].enable();
      this.store.dispatch(InvoiceCurrenciesAction.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createPaymentPlans();
      } else if (this.data.type === 'edit') {
        this.editPaymentPlans();
      }
    }
  }

  createPaymentPlans() {
    this.store.dispatch(
      InvoiceCurrenciesAction.CreateInvoiceCurrencies({
        payload: {
          countryId: this.createInvoiceForm.value.countryId,
          currencyId: this.createInvoiceForm.value.currencyId,
          currencyCode: this.createInvoiceForm.value.currencyCode,
          isQuoteCurrency: this.createInvoiceForm.value.isQuoteCurrency,
          isDefault: this.createInvoiceForm.value.isDefault,
          description: this.createInvoiceForm.value.description,
        },
      })
    );
  }

  editPaymentPlans() {
    if (this.editPaymentPlanData) {
      this.store.dispatch(
        InvoiceCurrenciesAction.EditInvoiceCurrencies({
          payload: {
            id: this.editPaymentPlanData.id,
            countryId: this.createInvoiceForm.value.countryId,
            currencyId: this.createInvoiceForm.value.currencyId,
            currencyCode: this.createInvoiceForm.value.currencyCode,
            isQuoteCurrency: this.createInvoiceForm.value.isQuoteCurrency,
            isDefault: this.createInvoiceForm.value.isDefault,
            description: this.createInvoiceForm.value.description,
          },
        })
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
