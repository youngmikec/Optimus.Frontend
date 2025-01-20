import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromCurrency from './currency.reducer';

const getCurrencyState = (state: fromApp.AppState) => state.currency;

export const getCurrencyIsLoading = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.isLoading
);

export const getAllCurrencies = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.allCurrencies
);

export const getAllCurrencyEnums = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.allCurrencyEnums
);

export const getAllExchangeRates = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.allEchangeRates
);

export const getExchangeRateById = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.exchangeRateById
);

export const getActiveExchangeRates = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.activeExchangeRates
);

export const getCurrencyTypes = createSelector(
  getCurrencyState,
  (state: fromCurrency.State) => state.currencyTypes
);
