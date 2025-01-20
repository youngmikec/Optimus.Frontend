import { createReducer, on, Action } from '@ngrx/store';
import * as MigrationRoutesAction from './migrationRoutes.actions';
import { IInvestmentTier } from '../../interfaces/investmentTier.interface';

export interface State {
  isLoading: boolean;
  allMigrationRoutes: any[] | null;
  allMigrationRoutesByCountryId: any[] | null;
  activeMigrationRoutesByCountryId: any[] | null;
  singleMigrationRoute: any | null;
  allInvestmentTiers: IInvestmentTier[] | null;
  allInvestmentTierNames: string[];
}

const initialState: State = {
  isLoading: false,
  allMigrationRoutes: null,
  allMigrationRoutesByCountryId: null,
  activeMigrationRoutesByCountryId: null,
  singleMigrationRoute: null,
  allInvestmentTiers: [],
  allInvestmentTierNames: [],
};

const migrationRouteReducerInternal = createReducer(
  initialState,
  on(MigrationRoutesAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(MigrationRoutesAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(MigrationRoutesAction.SaveAllMigrationRoutes, (state, { payload }) => ({
    ...state,
    allMigrationRoutes: payload,
  })),
  on(
    MigrationRoutesAction.SaveAllInvestmentTiersByMigrationRouteId,
    (state, { payload }) => ({
      ...state,
      allInvestmentTiers: payload,
    })
  ),
  on(
    MigrationRoutesAction.SaveAllInvestmentTierNames,
    (state, { payload }) => ({
      ...state,
      allInvestmentTierNames: payload,
    })
  ),
  on(
    MigrationRoutesAction.SaveAllMigrationRoutesByCountryId,
    (state, { payload }) => ({
      ...state,
      allMigrationRoutesByCountryId: payload,
    })
  ),
  on(
    MigrationRoutesAction.SaveActiveMigrationRoutesByCountryId,
    (state, { payload }) => ({
      ...state,
      activeMigrationRoutesByCountryId: payload,
    })
  ),
  on(
    MigrationRoutesAction.SaveGetMigrationRoutesById,
    (state, { payload }) => ({
      ...state,
      singleMigrationRoute: payload,
    })
  )
);

export function migrationRouteReducer(
  state: State | undefined,
  action: Action
) {
  return migrationRouteReducerInternal(state, action);
}
