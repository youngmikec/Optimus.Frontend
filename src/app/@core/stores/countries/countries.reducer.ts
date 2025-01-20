import { createReducer, on, Action } from '@ngrx/store';
import * as CountriesActions from './countries.actions';

export interface State {
  isLoading: boolean;
  allCountries: any[] | null;
  activeCountries: any[] | null;
  country: any | null;
  isoCountries: any[] | null;
  singleCountry: any | null;
  singleCountryDashboard: any | null;
  programTypes: any;
}

const initialState: State = {
  isLoading: false,
  allCountries: null,
  activeCountries: null,
  country: null,
  isoCountries: null,
  singleCountry: null,
  singleCountryDashboard: null,
  programTypes: null,
};

const countriesReducerInternal = createReducer(
  initialState,
  on(CountriesActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(CountriesActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(CountriesActions.GetActiveCountries, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(CountriesActions.SaveAllCountry, (state, { payload }) => ({
    ...state,
    isLoading: false,
    allCountries: payload,
  })),
  on(CountriesActions.SaveActiveCountries, (state, { payload }) => ({
    ...state,
    isLoading: false,
    activeCountries: payload,
  })),
  on(CountriesActions.SaveGetCountryById, (state, { payload }) => ({
    ...state,
    singleCountry: payload,
  })),
  on(CountriesActions.SaveGetCountryDashboardById, (state, { payload }) => ({
    ...state,
    singleCountryDashboard: payload,
  })),
  on(CountriesActions.SaveIsoCountries, (state, { payload }) => ({
    ...state,
    isoCountries: payload,
  })),
  on(CountriesActions.ClearCountryDashboardData, (state) => ({
    ...state,
    country: null,
    singleCountry: null,
    singleCountryDashboard: null,
  })),
  on(CountriesActions.SaveGetCountryProgramTypes, (state, { payload }) => ({
    ...state,
    programTypes: payload,
  }))
);

export function countriesReducer(state: State | undefined, action: Action) {
  return countriesReducerInternal(state, action);
}
