export interface IPaymentPlan {
  countryId: number;
  duration: number;
  downPayment: number;
  numberOfInstalment: number;
  interestRate: number;
  country: ICountry;
  feeCategory: number;
  migrationRouteId?: number;
  percentage: number;
  serialNumber: number;
  feeCategoryDesc: string;
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

export interface ICountry {
  countryCode: string;
  currencyId: number;
  flagUrl: string;
  currency: string | null;
  productCategories: any[];
  invoiceCurrencies: any[];
  familyMembers: any[];
  migrationRoutes: any[];
  routeFees: any | null;
  programType: number;
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}
