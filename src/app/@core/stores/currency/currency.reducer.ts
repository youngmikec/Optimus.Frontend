import { createReducer, on, Action } from '@ngrx/store';
import * as CurrencyActions from './currency.actions';
import { IBankCurrency } from '../../interfaces/bank-currency.interface';

export interface State {
  isLoading: boolean;
  allCurrencies: any[] | null;
  allCurrencyEnums: any[] | null;
  allEchangeRates: any[] | null;
  exchangeRateById: any[] | null;
  activeExchangeRates: any[] | null;
  currencyTypes: IBankCurrency[];
}

const initialState: State = {
  isLoading: false,
  allCurrencies: null,
  allCurrencyEnums: null,
  allEchangeRates: null,
  exchangeRateById: null,
  activeExchangeRates: null,
  currencyTypes: [],
};

const currencyReducerInternal = createReducer(
  initialState,
  on(CurrencyActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(CurrencyActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(CurrencyActions.SaveAllCurrencyEnums, (state, { payload }) => ({
    ...state,
    allCurrencyEnums: payload,
  })),
  on(CurrencyActions.SaveAllCurrencies, (state, { payload }) => ({
    ...state,
    allCurrencies: payload,
  })),
  on(CurrencyActions.SaveAllExchangeRates, (state, { payload }) => ({
    ...state,
    allEchangeRates: payload,
  })),
  on(CurrencyActions.SaveExchangeRateById, (state, { payload }) => ({
    ...state,
    exchangeRateById: payload,
  })),

  on(CurrencyActions.GetActiveExchangeRates, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(CurrencyActions.SaveActiveExchangeRates, (state, { payload }) => ({
    ...state,
    activeExchangeRates: payload,
  })),
  on(CurrencyActions.GetCurrencyTypes, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(CurrencyActions.GetCurrencyTypesSuccess, (state, { payload }) => ({
    ...state,
    isLoading: false,
    currencyTypes: payload,
  }))
);

export function currencyReducer(state: State | undefined, action: Action) {
  return currencyReducerInternal(state, action);
}
