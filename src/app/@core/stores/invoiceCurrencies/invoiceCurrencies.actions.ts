import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[InvoiceCurrencies] Reset Store');

export const IsLoading = createAction(
  '[InvoiceCurrencies] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Get All Invoice Currencies'
);

export const GetAllInvoiceCurrenciesByCountryId = createAction(
  '[InvoiceCurrencies] Get All Invoice Currencies By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Save All Invoice Currencies',
  props<{
    payload: any;
  }>()
);

export const SaveAllInvoiceCurrenciesByCountryId = createAction(
  '[InvoiceCurrencies] Save All Invoice Currencies By Country Id',
  props<{
    payload: any;
  }>()
);

export const CreateInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Create Invoice Currencies',
  props<{
    payload: {
      countryId: number;
      currencyId: number;
      currencyCode: string;
      isQuoteCurrency: boolean;
      isDefault: boolean;
      description: string;
    };
  }>()
);

export const EditInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Edit Invoice Currencies',
  props<{
    payload: {
      id: number;
      countryId: number;
      currencyId: number;
      currencyCode: string;
      isQuoteCurrency: boolean;
      isDefault: boolean;
      description: string;
    };
  }>()
);

export const ActivateInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Activate Invoice Currencies',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const DeactivateInvoiceCurrencies = createAction(
  '[InvoiceCurrencies] Deactivate Invoice Currencies',
  props<{
    payload: {
      countryId: number;
      id: number;
    };
  }>()
);
