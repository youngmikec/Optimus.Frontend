export interface IInvestmentTier {
  country: any;
  countryId: number;
  createdBy: string;
  createdDate: Date;
  description: string;
  deviceId: number;
  deviceType: number;
  deviceTypeDesc: string | null;
  id: number;
  isArchived: boolean;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  migrationRoute: any;
  migrationRouteId: number;
  name: string;
  sequenceNo: number;
  status: number;
  statusDesc: string | null;
  uniqueName: string | null;
  userActivityType: number;
  userActivityTypeDesc: string | null;
  userId: string;
}
