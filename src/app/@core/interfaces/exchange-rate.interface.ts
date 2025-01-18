export interface IExchangeRate {
  baseCurrency: number | null;
  baseCurrencyCode: string;
  baseCurrencyId: number;
  createdBy: string;
  createdDate: string;
  exchangeDate: string;
  id: number;
  lastExchangeDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastRate: number;
  name: string;
  rate: number;
  recordKey: string;
  status: number;
  statusDesc: string;
  userId: string;
  variableCurrency: number | null;
  variableCurrencyCode: string;
  variableCurrencyId: number;
}
