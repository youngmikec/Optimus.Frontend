export interface IDiscountRequestStats {
  allDiscountRequest: number;
  approvedDiscountRequest: number;
  declinedDiscountRequest: number;
  pendingDiscountRequest: number;
}

export interface IDiscountType {
  value: number;
  name: string;
  description: string;
}

export interface IDiscountDetails {
  countryId: number;
  countryName: string;
  migrationRouteId: number;
  migrationRouteName: string;
  discountStatus: number;
  discountStatusDesc: string;
  discountType: number;
  discountTypeDesc: string;
  discountPercentage: number;
  flatAmount: number;
  flatAmountCurrencyCode: string;
  startDate: string;
  endDate: string;
  recordKey: string;
  id: number;
  name: string | null;
  description: string | null;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

export interface IDiscountRequest {
  discountId: number;
  discount: IDiscountDetails;
  discountRequestStatus: number;
  discountRequestStatusDesc: string;
  approvedDiscountAmount: number;
  approvedDiscountPercentage: number;
  recordKey: string;
  id: number;
  name: string | null;
  description: string | null;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}
