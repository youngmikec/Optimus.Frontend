import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromRouteFees from './routeFees.reducer';

const getRouteFeeState = (state: fromApp.AppState) => state.routeFee;

export const getRouteFeeIsLoading = createSelector(
  getRouteFeeState,
  (state: fromRouteFees.State) => state.isLoading
);

export const getSuccessAction = createSelector(
  getRouteFeeState,
  (state: fromRouteFees.State) => state.successAction
);

export const getAllRouteFee = createSelector(
  getRouteFeeState,
  (state: fromRouteFees.State) => state.allRouteFee
);

export const getRouteFeeByMigrationId = createSelector(
  getRouteFeeState,
  (state: fromRouteFees.State) => state.allRouteFeeByMigrationId
);
