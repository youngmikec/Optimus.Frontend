import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDepartments from './countries.reducer';

const getCountriesState = (state: fromApp.AppState) => state.countries;

export const getCountriesIsLoading = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.isLoading
);

export const getAllCountry = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.allCountries
);

export const getActiveCountries = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.activeCountries
);

export const getCountryById = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.singleCountry
);

export const getProgramTypes = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.programTypes
);

export const getCountryDashboardById = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.singleCountryDashboard
);

export const getIsoCountries = createSelector(
  getCountriesState,
  (state: fromDepartments.State) => state.isoCountries
);
