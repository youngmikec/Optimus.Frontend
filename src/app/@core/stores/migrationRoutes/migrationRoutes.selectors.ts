import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromMigrationRoutes from './migrationRoutes.reducer';

const getMigrationRouteState = (state: fromApp.AppState) =>
  state.migrationRoutes;

export const getMigrationRouteIsLoading = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.isLoading
);

export const getAllMigrationRoutes = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.allMigrationRoutes
);

export const getAllInvestmentTiers = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.allInvestmentTiers
);

export const getAllInvestmentTierNames = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.allInvestmentTierNames
);

export const getAllMigrationRoutesByCountryId = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.allMigrationRoutesByCountryId
);

export const getActiveMigrationRoutesByCountryId = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.activeMigrationRoutesByCountryId
);

export const getMigrationRoutesById = createSelector(
  getMigrationRouteState,
  (state: fromMigrationRoutes.State) => state.singleMigrationRoute
);
