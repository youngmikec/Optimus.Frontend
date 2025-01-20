import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
//import { CurrencyEffects } from 'src/app/@core/stores/currency/currency.effects';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
// import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as currencySelectors from 'src/app/@core/stores/currency/currency.selectors';

@Component({
  selector: 'app-create-currency',
  templateUrl: './create-currency.component.html',
  styleUrls: ['./create-currency.component.scss'],
})
export class CreateCurrencyComponent implements OnInit, OnDestroy {
  isLoading!: Observable<boolean>;
  manageInstance!: 'create' | 'update';
  manageCurrencyForm!: FormGroup;
  getAllCurrencyEnumsSub!: Subscription;
  // currencyEnums: String[] = [];
  allCurrencyCodes!: any;
  currency!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCurrencyComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState> // private currencyEffect: CurrencyEffects
  ) {
    this.manageInstance = this.data?.instance;
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(currencySelectors.getCurrencyIsLoading)
    );

    this.buildmanageCurrencyForm();

    this.getCurrencyCode();

    if (this.manageInstance === 'update') {
      this.manageCurrencyForm.patchValue({
        name: this.data?.currencyName,
        currencyCode: this.data?.currencyCode,
        isDefault: this.data?.isDefault,
        id: this.data?.currencyId,
      });
    }
  }

  buildmanageCurrencyForm() {
    this.manageCurrencyForm = this.fb.group({
      name: [null, [Validators.required]],
      currencyCode: [null, [Validators.required]],
      isDefault: [false],
    });
  }

  get manageCurrencyFormControls() {
    return this.manageCurrencyForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.manageCurrencyFormControls['name'].hasError('required')
    ) {
      return `Please enter currency's name`;
    } else if (
      instance === 'currencyCode' &&
      this.manageCurrencyFormControls['currencyCode'].hasError('required')
    ) {
      return `Please select currency's code`;
    } else {
      return;
    }
  }

  getCurrencyCode() {
    this.store.dispatch(CurrencyActions.GetAllCurrencyEnums());

    this.getAllCurrencyEnumsSub = this.store
      .pipe(select(currencySelectors.getAllCurrencyEnums))
      .subscribe((res: any) => {
        this.allCurrencyCodes = res;
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.store.dispatch(CurrencyActions.IsLoading({ payload: true }));

    if (this.manageInstance === 'create') {
      this.store.dispatch(
        CurrencyActions.CreateCurrency({
          payload: {
            name: this.manageCurrencyForm.value.name,
            currencyCode: this.manageCurrencyForm.value.currencyCode,
            isDefault: this.manageCurrencyForm.value.isDefault,
          },
        })
      );
    } else if (this.manageInstance === 'update') {
      this.store.dispatch(
        CurrencyActions.UpdateCurrency({
          payload: {
            id: this.data?.currencyId,
            currencyCode: this.manageCurrencyForm.value.currencyCode,
            name: this.manageCurrencyForm.value.name,
            isDefault: this.manageCurrencyForm.value.isDefault,
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
