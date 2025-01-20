import { createAction, props } from '@ngrx/store';
import { IBankCurrency } from '../../interfaces/bank-currency.interface';

export const ResetStore = createAction('[Currency] Reset Store');

export const IsLoading = createAction(
  '[Currency] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllCurrencyEnums = createAction(
  '[Currency] Get All Currency Enums'
);

export const GetCurrencyTypes = createAction('[Currency] Get Currency Types');
export const GetCurrencyTypesSuccess = createAction(
  '[Currency] Get Currency Types Success',
  props<{
    payload: IBankCurrency[];
  }>()
);

export const SaveAllCurrencyEnums = createAction(
  '[Currency] Save All Currency Enums',
  props<{
    payload: any[];
  }>()
);

export const CreateCurrency = createAction(
  '[Currency] Create Currency ',
  props<{
    payload: {
      name: string;
      currencyCode: string;
      isDefault: boolean;
      skip?: number;
      take?: number;
    };
  }>()
);

export const GetAllCurrencies = createAction(
  '[Currency] Get All Currency',
  props<{
    payload: {
      skip?: number;
      take?: number;
    };
  }>()
);

export const SaveAllCurrencies = createAction(
  '[Currency] Save All Currencies',
  props<{
    payload: any[];
  }>()
);

export const UpdateCurrency = createAction(
  '[Currency] Update Currency',
  props<{
    payload: {
      id: number;
      currencyCode: string;
      name: string;
      isDefault: boolean;
      skip?: number;
      take?: number;
    };
  }>()
);

export const ChangeCurrencyConfigurationStatus = createAction(
  '[Currency] Change Currency Status',
  props<{
    payload: {
      id: number;
      status: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const GetAllExchangeRates = createAction(
  '[Currency] Get All Exchange Rates'
  // props<{
  //   payload: {
  //     skip: number;
  //     take: number;
  //   };
  // }>()
);

export const SaveAllExchangeRates = createAction(
  '[Currency] Save All Exchange Rates',
  props<{
    payload: any[];
  }>()
);

export const CreateCurrencyConversion = createAction(
  '[Currency] Create Exchange Rate',
  props<{
    payload: {
      baseCurrencyCode: string;
      variableCurrencyCode: string;
      description: string;
      rate: number;
      exchangeDate: string;
      lastRate: number;
      lastExchangeDate: string;
    };
  }>()
);

export const UpdateCurrencyConversion = createAction(
  '[Currency] Update Currency Conversion',
  props<{
    payload: {
      id: number;
      rate: number;
      exchangeDate: string;
      status?: number;
    };
  }>()
);

export const ActivateCurrency = createAction(
  '[Currency] Activate Currency',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivateCurrency = createAction(
  '[Currency] Deactivate Currency',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const ActivateCurrencyConversion = createAction(
  '[Currency] Activate Currency Conversion',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivateCurrencyConversion = createAction(
  '[Currency] Deactivate Currency Conversion',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetExchangeRateById = createAction(
  '[Currency] Get Exchange Rate By Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveExchangeRateById = createAction(
  '[Currency] Save Exchange Rate By Id',
  props<{
    payload: any[];
  }>()
);

export const GetActiveExchangeRates = createAction(
  '[Currency] Get Active Exchange Rates'
);

export const SaveActiveExchangeRates = createAction(
  '[Currency] Save Active Exchange Rates',
  props<{
    payload: any[];
  }>()
);

export const DeleteCurrency = createAction(
  '[Currency] Delete Currency',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeleteExchangeRate = createAction(
  '[Currency] Delete Exchange Rate',
  props<{
    payload: {
      id: number;
    };
  }>()
);
