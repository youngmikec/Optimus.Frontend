import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
// import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as currencySelectors from 'src/app/@core/stores/currency/currency.selectors';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
//import { MatSelectChange } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-create-currency-conversion',
  templateUrl: './create-currency-conversion.component.html',
  styleUrls: ['./create-currency-conversion.component.scss'],
})
export class CreateCurrencyConversionComponent implements OnInit, OnDestroy {
  isLoading!: Observable<boolean>;
  manageCurrencyConvertForm!: FormGroup;

  private getAllCurrencyEnumsSub!: Subscription;

  allCurrencyCodes!: any;
  manageInstance!: 'create' | 'update';
  currentDateTime!: any;
  selectedConversionCurr!: string;
  selectedBaseCurr!: string;

  selectedBaseCurrency: string = '';
  isDisabled = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCurrencyConversionComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    public datePipe: DatePipe
  ) {
    this.manageInstance = this.data?.instance;
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(currencySelectors.getCurrencyIsLoading)
    );
    this.buildmanageCurrencyConvertForm();

    this.getCreatedCurrency();

    this.currentDateTime = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd h:mm:ss'
    );

    this.patchEditCurrency();
  }

  buildmanageCurrencyConvertForm() {
    this.manageCurrencyConvertForm = this.fb.group({
      baseCurrencyCode: [null, [Validators.required]],
      variableCurrencyCode: [null, [Validators.required]],
      lastRate: [null, [Validators.required]],
      rate: [null, [Validators.required]],
      baseRate: [{ value: 1, disabled: true }],
      baseCurrCode: [{ value: null, disabled: true }],
      selectedBaseCurr: [{ value: null, disabled: true }],
      selectedConversionCurr: [{ value: null, disabled: true }],
    });
  }

  get manageCurrencyConvertFormControls() {
    return this.manageCurrencyConvertForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'baseCurrencyCode' &&
      this.manageCurrencyConvertFormControls['baseCurrencyCode'].hasError(
        'required'
      )
    ) {
      return `Please enter currency's name`;
    } else if (
      instance === 'variableCurrencyCode' &&
      this.manageCurrencyConvertFormControls['variableCurrencyCode'].hasError(
        'required'
      )
    ) {
      return `Please enter rate`;
    } else if (
      instance === 'baseRate' &&
      this.manageCurrencyConvertFormControls['baseRate'].hasError('required')
    ) {
      return `Please enter rate`;
    } else if (
      instance === 'lastRate' &&
      this.manageCurrencyConvertFormControls['lastRate'].hasError('required')
    ) {
      return `Please enter rate`;
    } else if (
      instance === 'rate' &&
      this.manageCurrencyConvertFormControls['rate'].hasError('required')
    ) {
      return `Please enter rate`;
    } else {
      return;
    }
  }

  // in case they decide they want all currencty to be in dropdown
  // getCurrencyCode() {
  //   this.store.dispatch(CurrencyActions.GetAllCurrencyEnums());

  //   this.getAllCurrencyEnumsSub = this.store
  //     .pipe(select(currencySelectors.getAllCurrencyEnums))
  //     .subscribe((res: any) => {
  //       this.allCurrencyCodes = res;
  //     });
  // }

  getCreatedCurrency() {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: 0, take: 9999 },
      })
    );

    this.getAllCurrencyEnumsSub = this.store
      .pipe(select(currencySelectors.getAllCurrencies))
      .subscribe((res: any) => {
        this.allCurrencyCodes = res;
      });
  }

  selectChangeHandler(currencyCode: MatSelectChange) {
    this.selectedBaseCurr = currencyCode.value;
  }

  selectChangeHandler2(currencyCode: MatSelectChange) {
    this.selectedConversionCurr = currencyCode.value;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  patchEditCurrency() {
    if (this.manageInstance === 'update') {
      this.manageCurrencyConvertForm.patchValue({
        baseCurrencyCode: this.data?.exchangeRate?.baseCurrencyCode,
        variableCurrencyCode: this.data?.exchangeRate?.variableCurrencyCode,
        selectedBaseCurr: this.data?.exchangeRate?.baseCurrencyCode,
        selectedConversionCurr: this.data?.exchangeRate?.variableCurrencyCode,
        lastRate: this.data?.exchangeRate?.lastRate,
        rate: this.data?.exchangeRate?.rate,
        exchangeDate: this.data?.exchangeDate,
      });
      this.manageCurrencyConvertForm.controls['lastRate'].disable();
    } else if (this.manageInstance === 'create') {
      this.manageCurrencyConvertForm.patchValue({
        rate: 0,
      });
      if (this.data?.patchValue) {
        this.manageCurrencyConvertForm.patchValue({
          baseCurrencyCode: this.data?.patchValue.baseCurrencyId,
          variableCurrencyCode: this.data?.patchValue.variableCurrencyId,
        });
      }
    }
  }

  onSubmit() {
    this.store.dispatch(CurrencyActions.IsLoading({ payload: true }));

    if (this.manageInstance === 'create') {
      this.store.dispatch(
        CurrencyActions.CreateCurrencyConversion({
          payload: {
            baseCurrencyCode:
              this.manageCurrencyConvertForm.value.baseCurrencyCode,
            variableCurrencyCode:
              this.manageCurrencyConvertForm.value.variableCurrencyCode,
            description: '',
            rate: this.manageCurrencyConvertForm.value.lastRate, // should be null
            exchangeDate: this.currentDateTime,
            lastRate: this.manageCurrencyConvertForm.value.lastRate,
            lastExchangeDate: this.currentDateTime,
          },
        })
      );
    } else if (this.manageInstance === 'update') {
      this.store.dispatch(
        CurrencyActions.UpdateCurrencyConversion({
          payload: {
            id: this.data?.exchangeRate?.id,
            rate: this.manageCurrencyConvertForm.value.rate,
            exchangeDate: this.currentDateTime,
            status: this.data?.exchangeRate?.status,
            // exchangeDate: this.manageCurrencyConvertForm.value.exchangeDate,
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.getAllCurrencyEnumsSub) {
      this.getAllCurrencyEnumsSub.unsubscribe();
    }
  }
}
