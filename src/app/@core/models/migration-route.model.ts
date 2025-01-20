export interface IMigrationRoute {
  recordKey: string;
  countryId: number;
  countryName: string;
  country: string | null;
  routeUrl: string;
  routeFees: any | null;
  routeQuestions: any | null;
  investmentTiers: any[];
  id: number;
  userId: string;
  name: string;
  uniqueName: string | null;
  description: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  isArchived: boolean;
  status: number;
  statusDesc: string;
  deviceId: string | null;
  deviceType: number;
  deviceTypeDesc: string | null;
  userActivityType: number;
  userActivityTypeDesc: string;
}
