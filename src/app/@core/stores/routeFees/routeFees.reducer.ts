import { createReducer, on, Action } from '@ngrx/store';
import * as RouteFeeAction from './routeFees.actions';

export interface State {
  isLoading: boolean;
  successAction: boolean;
  allRouteFee: any[] | null;
  allRouteFeeByMigrationId: any[] | null;
}

const initialState: State = {
  isLoading: false,
  successAction: false,
  allRouteFee: null,
  allRouteFeeByMigrationId: null,
};

const routeFeeReducerInternal = createReducer(
  initialState,
  on(RouteFeeAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(RouteFeeAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(RouteFeeAction.SuccessAction, (state, { payload }) => ({
    ...state,
    successAction: payload,
  })),
  on(RouteFeeAction.SaveAllRouteFees, (state, { payload }) => ({
    ...state,
    allRouteFee: payload,
  })),
  on(RouteFeeAction.SaveAllRouteFeesByMigrationId, (state, { payload }) => ({
    ...state,
    allRouteFeeByMigrationId: payload,
  })),
  on(RouteFeeAction.UpdateRouteFeesSerialNumber, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    RouteFeeAction.UpdateRouteFeesSerialNumberSuccess,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      allRouteFee: payload,
    })
  ),
  on(RouteFeeAction.UpdateRouteFeesSerialNumberFail, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export function routeFeeReducer(state: State | undefined, action: Action) {
  return routeFeeReducerInternal(state, action);
}
