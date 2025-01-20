import { createReducer, on, Action } from '@ngrx/store';
import * as FeaturesActions from './features.actions';

export interface State {
  isLoading: boolean;
  allFeatures: any | null;
  allAccessLevels: any;
  allPermissionsByAccessLevel: any;
}

const initialState: State = {
  isLoading: false,
  allFeatures: null,
  allAccessLevels: null,
  allPermissionsByAccessLevel: null,
};

const featuresReducerInternal = createReducer(
  initialState,
  on(FeaturesActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(FeaturesActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(FeaturesActions.SaveAllFeatures, (state, { payload }) => ({
    ...state,
    allFeatures: payload,
  })),
  on(FeaturesActions.SaveAllAccessLevels, (state, { payload }) => ({
    ...state,
    allAccessLevels: payload,
  })),
  on(FeaturesActions.SavePermissionByAccessLevel, (state, { payload }) => ({
    ...state,
    allPermissionsByAccessLevel: payload,
  }))
);

export function featuresReducer(state: State | undefined, action: Action) {
  return featuresReducerInternal(state, action);
}
