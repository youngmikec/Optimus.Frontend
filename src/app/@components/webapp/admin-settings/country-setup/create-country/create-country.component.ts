import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountryCodeData } from '../country-setup.component';
import { CountryData } from '../country-setup.component';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as CountryCodeSelector from 'src/app/@core/stores/general/general.selectors';
import * as CountryCodeAction from 'src/app/@core/stores/general/general.actions';
import * as CurrencyActions from 'src/app/@core/stores/currency/currency.actions';
import * as CurrencySelector from 'src/app/@core/stores/currency/currency.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.scss'],
})
export class CreateCountryComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  createCountryForm!: FormGroup;
  // public searchControl: FormControl = new FormControl();
  public countryCtrl: FormControl = new FormControl(null);
  public countryFilterCtrl: FormControl = new FormControl('');
  public filteredCountry: ReplaySubject<CountryCodeData[]> = new ReplaySubject<
    CountryCodeData[]
  >(1);
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  countries: CountryCodeData[] = [];
  currencyList: any[] = [];
  isoCountriesList: any[] = [];
  programTypeList: { name: string; value: string }[] = [];
  editCountryData: CountryData = {
    id: 0,
    name: '',
    currency: {},
    createdDate: '',
    createdBy: '',
    lastModifiedDate: '',
    lastModifiedBy: '',
    status: '',
  };
  isLoading!: Observable<boolean>;
  getAllCountryCodeSub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateCountryComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.getCountryCode();
    this.getAllCurrencies();
    this.getIsoCountries();
    this.buildCreateCountryForm();
    this.getProgramTypes();

    this.isLoading = this.store.pipe(
      select(CountriesSelector.getCountriesIsLoading)
    );

    if (this.data.type === 'edit') {
      this.editCountryData = this.data?.editData;

      this.createCountryForm.patchValue({
        country_name: this.editCountryData.name,
        currency_name: this.editCountryData.currency.currencyCode,
      });
    }

    // listen for search field value changes
    this.countryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountry();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  getProgramTypes(): void {
    this.store.dispatch(CountriesActions.GetCountryProgramTypes());

    this.store
      .pipe(select(CountriesSelector.getProgramTypes))
      .subscribe((res: any) => {
        if (res) {
          this.programTypeList = res.map((item: any) => ({
            name: `${item.description} (${item.name})`,
            value: item.value,
          }));
        }
      });
  }

  getCountryCode() {
    this.store.dispatch(CountryCodeAction.GetCountryCodes());

    this.getAllCountryCodeSub = this.store
      .pipe(select(CountryCodeSelector.getAllCountryCodes))
      .subscribe((res: any) => {
        if (res) {
          this.countries = res;
          this.filteredCountry.next(this.countries.slice());
        }
      });
  }

  getAllCurrencies() {
    this.store.dispatch(
      CurrencyActions.GetAllCurrencies({
        payload: { skip: 0, take: 9999 },
      })
    );

    this.store
      .pipe(select(CurrencySelector.getAllCurrencies))
      .subscribe((resData: any) => {
        if (resData) {
          this.currencyList = resData;
        }
      });
  }

  getIsoCountries() {
    this.store.dispatch(CountriesActions.GetIsoCountries());

    this.store
      .pipe(select(CountriesSelector.getIsoCountries))
      .subscribe((resData: any) => {
        if (resData) {
          this.isoCountriesList = resData;
        }
      });
  }

  buildCreateCountryForm() {
    this.createCountryForm = this.fb.group({
      country_name: [null, [Validators.required]],
      currency_name: [null, [Validators.required]],
      programType: [null],
    });
  }

  get createCountryFormControls() {
    return this.createCountryForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'country_name' &&
      this.createCountryFormControls['country_name'].hasError('required')
    ) {
      return `Please select country`;
    } else if (
      instance === 'currency_name' &&
      this.createCountryFormControls['currency_name'].hasError('required')
    ) {
      return `Please select currency`;
    } else if (
      instance === 'programType' &&
      this.createCountryFormControls['programType'].hasError('required')
    ) {
      return `Please select program type`;
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.createCountryForm.invalid) {
      return;
    } else {
      this.store.dispatch(CountriesActions.IsLoading({ payload: true }));

      if (this.data.type === 'create') {
        this.createCountry();
      } else if (this.data.type === 'edit') {
        this.editCountry();
      }
    }
  }

  createCountry() {
    let selectedCountry = [];
    let selectedIsoCountry = [];
    selectedCountry = this.countries.filter(
      (x) => x.name == this.createCountryForm.value.country_name
    );
    selectedIsoCountry = this.isoCountriesList.filter(
      (x) => x.name == this.createCountryForm.value.country_name
    );
    this.store.dispatch(
      CountriesActions.CreateCountry({
        payload: {
          name: this.createCountryForm.value.country_name,
          currencyCode: this.createCountryForm.value.currency_name,
          countryCode: selectedIsoCountry[0].isoCode3,
          flagUrl: selectedCountry[0].flag,
          description: this.createCountryForm.value.country_name,
          programType: parseInt(this.createCountryForm.value['programType']),
          skip: this.data.skip,
          take: this.data.take,
        },
      })
    );
  }

  editCountry() {
    if (this.editCountryData) {
      let selectedCountry = [];
      let selectedIsoCountry = [];
      selectedCountry = this.countries.filter(
        (x) => x.name == this.createCountryForm.value.country_name
      );
      selectedIsoCountry = this.isoCountriesList.filter(
        (x) => x.name == this.createCountryForm.value.country_name
      );
      this.store.dispatch(
        CountriesActions.EditCountry({
          payload: {
            id: this.editCountryData.id,
            name: this.createCountryForm.value.country_name,
            currencyCode: this.createCountryForm.value.currency_name,
            countryCode: selectedIsoCountry[0].isoCode3,
            flagUrl: selectedCountry[0].flag,
            description: this.createCountryForm.value.country_name,
            programType: parseInt(this.createCountryForm.value['programType']),
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
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountry.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCountry.next(
      this.countries.filter((x) => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
