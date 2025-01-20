import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';

import { Store, select } from '@ngrx/store';
import { MatSelect } from '@angular/material/select';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalActions from 'src/app/@core/stores/general/general.actions';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import * as DepartmentsActions from 'src/app/@core/stores/department/departments.actions';
import * as DepartmentsSelector from 'src/app/@core/stores/department/departments.selectors';
import { CountryCodeData } from '../../../country-setup/country-setup.component';
import { IBankCurrency } from 'src/app/@core/interfaces/bank-currency.interface';

@Component({
  selector: 'app-create-edit-bank-account',
  templateUrl: './create-edit-bank-account.component.html',
  styleUrls: ['./create-edit-bank-account.component.scss'],
})
export class CreateEditBankAccountComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  manageBankAccountForm!: FormGroup;
  isLoading!: Observable<boolean>;
  countryList: any;
  getAllCountriesSub!: Subscription;
  currencyTypeOptions: IBankCurrency[] = [];
  programCountries: any = [];

  public countryCtrl: FormControl = new FormControl(null);
  public countryFilterCtrl: FormControl = new FormControl('');
  public filteredCountry: ReplaySubject<CountryCodeData[]> = new ReplaySubject<
    CountryCodeData[]
  >(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreateEditBankAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(DepartmentsSelector.getDepartmentsIsLoading)
    );

    this.manageAllCountries();

    this.buildForm();

    this.getAllCountry();

    this.patchBankAccountForm();

    this.getCurrencyTypes();

    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountry();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  buildForm() {
    this.manageBankAccountForm = this.fb.group({
      bankName: [null, [Validators.required]],
      bankNumber: [null],
      beneficiaryName: [null],
      accountNumber: [null, [Validators.required]],
      swiftCode: [null, [Validators.required]],
      transitNumber: [null],
      bankCountry: [null, [Validators.required]],
      countryId: [null, [Validators.required]],
      bankState: [null],
      bankArea: [null],
      bankStreetNumber: [null],
      bankBuilding: [null],
      bankZipCode: [null],
      beneficiaryCountry: [null, [Validators.required]],
      beneficiaryState: [null],
      beneficiaryArea: [null],
      beneficiaryStreetNumber: [null],
      beneficiaryBuilding: [null],
      beneficiaryZipCode: [null],
      accountCurrencyType: [null, [Validators.required]],
    });
  }

  getCurrencyTypes() {
    this.store.dispatch(CurrencyActions.GetCurrencyTypes());
    this.store
      .pipe(select(CurrencySelector.getCurrencyTypes))
      .subscribe((res: IBankCurrency[]) => {
        if (res) {
          this.currencyTypeOptions = res;
        }
      });
  }

  get manageBankAccountFormControls() {
    return this.manageBankAccountForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'bankName' &&
      this.manageBankAccountFormControls['bankName'].hasError('required')
    ) {
      return `Please enter bank name`;
    } else if (
      instance === 'bankNumber' &&
      this.manageBankAccountFormControls['bankNumber'].hasError('required')
    ) {
      return `Please enter bank number`;
    } else if (
      instance === 'beneficiary' &&
      this.manageBankAccountFormControls['beneficiary'].hasError('required')
    ) {
      return 'Please enter your beneficiary';
    } else if (
      instance === 'accountNumber' &&
      this.manageBankAccountFormControls['accountNumber'].hasError('required')
    ) {
      return `Please enter account number`;
    } else if (
      instance === 'swiftCode' &&
      this.manageBankAccountFormControls['swiftCode'].hasError('required')
    ) {
      return `Please enter swiftCode`;
    } else if (
      instance === 'transitNumber' &&
      this.manageBankAccountFormControls['transitNumber'].hasError('required')
    ) {
      return `Please enter transitNumber`;
    } else if (
      instance === 'bankCountry' &&
      this.manageBankAccountFormControls['bankCountry'].hasError('required')
    ) {
      return `Please select bankCountry`;
    } else if (
      instance === 'countryId' &&
      this.manageBankAccountFormControls['countryId'].hasError('required')
    ) {
      return `Please enter country`;
    } else if (
      instance === 'bankCity' &&
      this.manageBankAccountFormControls['bankCity'].hasError('required')
    ) {
      return `Please enter bank city`;
    } else if (
      instance === 'bankArea' &&
      this.manageBankAccountFormControls['bankArea'].hasError('required')
    ) {
      return `Please enter bank area`;
    } else if (
      instance === 'bankStreetNumber' &&
      this.manageBankAccountFormControls['bankStreetNumber'].hasError(
        'required'
      )
    ) {
      return `Please enter bank street number`;
    } else if (
      instance === 'bankBuilding' &&
      this.manageBankAccountFormControls['bankBuilding'].hasError('required')
    ) {
      return `Please enter bank building`;
    } else if (
      instance === 'bankZipCode' &&
      this.manageBankAccountFormControls['bankZipCode'].hasError('required')
    ) {
      return `Please enter bank zip code`;
    } else if (
      instance === 'beneficiaryCountry' &&
      this.manageBankAccountFormControls['beneficiaryCountry'].hasError(
        'required'
      )
    ) {
      return `Please select beneficiary Country`;
    } else if (
      instance === 'beneficiaryCity' &&
      this.manageBankAccountFormControls['beneficiaryCity'].hasError('required')
    ) {
      return `Please enter beneficiary city`;
    } else if (
      instance === 'beneficiaryArea' &&
      this.manageBankAccountFormControls['beneficiaryArea'].hasError('required')
    ) {
      return `Please enter beneficiary area`;
    } else if (
      instance === 'beneficiaryStreetNumber' &&
      this.manageBankAccountFormControls['beneficiaryStreetNumber'].hasError(
        'required'
      )
    ) {
      return `Please enter beneficiary street number`;
    } else if (
      instance === 'beneficiaryBuilding' &&
      this.manageBankAccountFormControls['beneficiaryBuilding'].hasError(
        'required'
      )
    ) {
      return `Please enter beneficiary building`;
    } else if (
      instance === 'beneficiaryZipCode' &&
      this.manageBankAccountFormControls['beneficiaryZipCode'].hasError(
        'required'
      )
    ) {
      return `Please enter beneficiary zip code`;
    } else if (
      instance === 'accountCurrencyType' &&
      this.manageBankAccountFormControls['accountCurrencyType'].hasError(
        'required'
      )
    ) {
      return `Please select account currency type`;
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAllCountry() {
    this.store.dispatch(generalActions.GetCountryCodes());
    this.getAllCountriesSub = this.store
      .pipe(select(generalSelectors.getAllCountryCodes))
      .subscribe((resData: any) => {
        if (resData) {
          this.countryList = resData;
          this.filteredCountry.next(this.countryList.slice());
        }
      });
  }

  getAllContries() {
    this.store.dispatch(CountriesActions.GetActiveCountries());
  }

  manageAllCountries() {
    this.getAllContries();

    this.store
      .pipe(select(CountriesSelector.getActiveCountries))
      .subscribe((resData: any) => {
        if (resData) {
          this.programCountries = resData;
        }
      });
  }

  patchBankAccountForm() {
    if (this.data?.instance === 'update') {
      this.manageBankAccountForm.patchValue({
        bankName: this.data?.bankAccount?.bankName,
        bankNumber: this.data?.bankAccount?.bankCode,
        beneficiaryName: this.data?.bankAccount?.accountName,
        accountNumber: this.data?.bankAccount?.accountNumber,
        swiftCode: this.data?.bankAccount?.swiftCode,
        transitNumber: this.data?.bankAccount?.transitNumber,
        bankCountry: this.data?.bankAccount?.bankAddress_Country,
        bankState: this.data?.bankAccount?.bankAddress_State,
        bankArea: this.data?.bankAccount?.bankAddress_Area,
        bankStreetNumber: this.data?.bankAccount?.bankAddress_StreetNumber,
        bankBuilding: this.data?.bankAccount?.bankAddress_Building,
        bankZipCode: this.data?.bankAccount?.bankAddress_ZipCode,
        beneficiaryCountry: this.data?.bankAccount?.beneficiaryAddress_Country,
        beneficiaryState: this.data?.bankAccount?.beneficiaryAddress_State,
        beneficiaryArea: this.data?.bankAccount?.beneficiaryAddress_Area,
        countryId: this.data?.bankAccount?.countryId || null,
        beneficiaryStreetNumber:
          this.data?.bankAccount?.beneficiaryAddress_StreetNumber,
        beneficiaryBuilding:
          this.data?.bankAccount?.beneficiaryAddress_Building,
        beneficiaryZipCode: this.data?.bankAccount?.beneficiaryAddress_ZipCode,
        accountCurrencyType: this.data?.bankAccount?.accountCurrencyType,
      });
    }
  }

  onSubmit() {
    this.store.dispatch(DepartmentsActions.IsLoading({ payload: true }));

    if (this.data?.instance === 'create') {
      this.createBankAccount();
    } else if (this.data?.instance === 'update') {
      this.updateBankAccount();
    }
  }

  createBankAccount() {
    this.store.dispatch(
      DepartmentsActions.CreateBankAccount({
        payload: {
          bankName: this.manageBankAccountForm.value.bankName,
          bankCode: this.manageBankAccountForm.value.bankNumber,
          accountName: this.manageBankAccountForm.value.beneficiaryName,
          accountNumber: this.manageBankAccountForm.value.accountNumber,
          swiftCode: this.manageBankAccountForm.value.swiftCode,
          transitNumber: this.manageBankAccountForm.value.transitNumber,
          countryId: this.manageBankAccountForm.value.countryId,
          accountCurrencyType:
            this.manageBankAccountForm.value.accountCurrencyType,
          bankAddress: {
            country: this.manageBankAccountForm.value.bankCountry,
            state: this.manageBankAccountForm.value.bankState,
            area: this.manageBankAccountForm.value.bankArea,
            streetNumber: this.manageBankAccountForm.value.bankStreetNumber,
            building: this.manageBankAccountForm.value.bankBuilding,
            zipCode: this.manageBankAccountForm.value.bankZipCode,
            name: this.manageBankAccountForm.value.bankName,
            description: this.manageBankAccountForm.value.bankName,
          },
          beneficiaryAddress: {
            country: this.manageBankAccountForm.value.beneficiaryCountry,
            state: this.manageBankAccountForm.value.beneficiaryState,
            area: this.manageBankAccountForm.value.beneficiaryArea,
            streetNumber:
              this.manageBankAccountForm.value.beneficiaryStreetNumber,
            building: this.manageBankAccountForm.value.beneficiaryBuilding,
            zipCode: this.manageBankAccountForm.value.beneficiaryZipCode,
            name: this.manageBankAccountForm.value.beneficiaryName,
            description: this.manageBankAccountForm.value.beneficiaryName,
          },
        },
      })
    );
  }

  updateBankAccount() {
    this.store.dispatch(
      DepartmentsActions.UpdateBankAccount({
        payload: {
          bankAccountId: this.data?.bankAccount?.id,
          countryId: this.manageBankAccountForm.value.countryId,
          bankName: this.manageBankAccountForm.value.bankName,
          bankCode: this.manageBankAccountForm.value.bankNumber,
          accountName: this.manageBankAccountForm.value.beneficiaryName,
          accountNumber: this.manageBankAccountForm.value.accountNumber,
          swiftCode: this.manageBankAccountForm.value.swiftCode,
          transitNumber: this.manageBankAccountForm.value.transitNumber,
          accountCurrencyType:
            this.manageBankAccountForm.value.accountCurrencyType,
          bankAddress: {
            country: this.manageBankAccountForm.value.bankCountry,
            state: this.manageBankAccountForm.value.bankState,
            area: this.manageBankAccountForm.value.bankArea,
            streetNumber: this.manageBankAccountForm.value.bankStreetNumber,
            building: this.manageBankAccountForm.value.bankBuilding,
            zipCode: this.manageBankAccountForm.value.bankZipCode,
          },
          beneficiaryAddress: {
            country: this.manageBankAccountForm.value.beneficiaryCountry,
            state: this.manageBankAccountForm.value.beneficiaryState,
            area: this.manageBankAccountForm.value.beneficiaryArea,
            streetNumber:
              this.manageBankAccountForm.value.beneficiaryStreetNumber,
            building: this.manageBankAccountForm.value.beneficiaryBuilding,
            zipCode: this.manageBankAccountForm.value.beneficiaryZipCode,
          },
        },
      })
    );
  }

  protected setInitialValue() {
    this.filteredCountry
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (
          a: CountryCodeData,
          b: CountryCodeData
        ) => a && b && a === b;
      });
  }

  protected filterCountry() {
    if (!this.countryList) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountry.next(this.countryList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountry.next(
      this.countryList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.getAllCountriesSub) {
      this.getAllCountriesSub.unsubscribe();
    }
  }
}
