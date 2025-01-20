import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[MigrationRoutes] Reset Store');

export const IsLoading = createAction(
  '[MigrationRoutes] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllMigrationRoutes = createAction(
  '[MigrationRoutes] Get All MigrationRoutes'
);

export const GetAllMigrationRoutesByCountryId = createAction(
  '[MigrationRoutes] Get All MigrationRoutes By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetActiveMigrationRoutesByCountryId = createAction(
  '[MigrationRoutes] Get Active MigrationRoutes By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllMigrationRoutes = createAction(
  '[MigrationRoutes] Save All Migration Routes',
  props<{
    payload: any;
  }>()
);

export const GetAllInvestmentTypeEnums = createAction(
  '[MigrationRoutes] Get All Investment tier types'
);

export const SaveAllInvestmentTypeEnums = createAction(
  '[MigrationRoutes] Save All Investment tier types',
  props<{
    payload: any;
  }>()
);

export const SaveAllMigrationRoutesByCountryId = createAction(
  '[MigrationRoutes] Save All Migration Routes By Country Id',
  props<{
    payload: any;
  }>()
);

export const SaveActiveMigrationRoutesByCountryId = createAction(
  '[MigrationRoutes] Save Active Migration Routes By Country Id',
  props<{
    payload: any;
  }>()
);

export const GetMigrationRoutesById = createAction(
  '[MigrationRoutes] Get Migration Routes By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetMigrationRoutesById = createAction(
  '[MigrationRoutes] Save Get Migration Routes By ID',
  props<{
    payload: any;
  }>()
);

export const CreateMigrationRoutes = createAction(
  '[MigrationRoutes] Create Migration Routes',
  props<{
    payload: {
      countryId: number;
      name: string;
      description: string;
      isDefault: string;
      routeUrl: string;
      routeFees: any[];
    };
  }>()
);

export const EditMigrationRoutes = createAction(
  '[MigrationRoutes] Edit Migration Routes',
  props<{
    payload: {
      id: number;
      countryId: number;
      name: string;
      description: string;
      isDefault: string;
      routeFees: any[];
      routeUrl: string;
    };
  }>()
);

export const CreateInvestmentTier = createAction(
  '[MigrationRoutes] Create Migration Investment Tier',
  props<{
    payload: {
      countryId: number;
      name: string;
      migrationRouteId: number;
      serialNumber: number;
    };
  }>()
);

export const EditInvestmentTier = createAction(
  '[MigrationRoutes] Edit Migration Investment Tier',
  props<{
    payload: {
      id: number;
      name: string;
      status?: number;
      serialNo: number;
      migrationRouteId?: number;
    };
  }>()
);

export const CreateMultipleInvestmentTier = createAction(
  '[MigrationRoute] Create Multiple Migration Investment Tier',
  props<{
    payload: {
      countryId: number;
      migrationRouteId: number;
      tiers: { name: string; serialNo: number }[];
    };
  }>()
);

export const EditMultipleInvestmentTier = createAction(
  '[MigrationRoute] Edit Multiple Migration Investment Tier',
  props<{
    payload: {
      investmentTierRequests: {
        id: number;
        name: string;
        status: number;
        sequenceNo: number;
      }[];
    };
  }>()
);

export const GetAllInvestmentTiersByMigrationRouteId = createAction(
  '[MigrationRoutes] Get All Investment tiers By MigrationRoute Id',
  props<{
    payload: {
      migrationRouteId?: number;
    };
  }>()
);

export const SaveAllInvestmentTiersByMigrationRouteId = createAction(
  '[MigrationRoutes] Save All Investment tiers by migrationrouteid',
  props<{
    payload: any;
  }>()
);

export const GetAllInvestmentTierNames = createAction(
  '[MigrationRoutes] Get All Investment tiers names',
  props<{
    payload: {
      migrationRouteId?: number;
    };
  }>()
);

export const SaveAllInvestmentTierNames = createAction(
  '[MigrationRoutes] Save All Investment tiers names',
  props<{
    payload: any;
  }>()
);

export const DeleteInvestmentTier = createAction(
  '[MigrationRoutes] Delete Investment tier',
  props<{
    payload: {
      id: number;
      migrationRouteId?: number;
    };
  }>()
);

export const ActivateMigrationRoutes = createAction(
  '[MigrationRoutes] Activate Migration Routes',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const DeactivateMigrationRoutes = createAction(
  '[MigrationRoutes] Deactivate Migration Routes',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);

export const DeleteMigrationRoutes = createAction(
  '[MigrationRoutes] Delete Migration Routes',
  props<{
    payload: {
      id: number;
      countryId: number;
    };
  }>()
);
