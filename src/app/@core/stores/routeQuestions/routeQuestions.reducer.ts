import { createReducer, on, Action } from '@ngrx/store';
import * as RouteQuestionAction from './routeQuestions.actions';

export interface State {
  isLoading: boolean;
  successAction: boolean;
  allRouteQuestion: any[] | null;
  allRouteQuestionByMigrationId: any[] | null;
  activeRouteQuestionByMigrationId: any[] | null;
  singleRouteQuestion: any | null;
}

const initialState: State = {
  isLoading: false,
  successAction: false,
  allRouteQuestion: null,
  allRouteQuestionByMigrationId: null,
  activeRouteQuestionByMigrationId: null,
  singleRouteQuestion: null,
};

const routeQuestionReducerInternal = createReducer(
  initialState,
  on(RouteQuestionAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(RouteQuestionAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(RouteQuestionAction.SuccessAction, (state, { payload }) => ({
    ...state,
    successAction: payload,
  })),
  on(RouteQuestionAction.SaveAllRouteQuestions, (state, { payload }) => ({
    ...state,
    allRouteQuestion: payload,
  })),
  on(
    RouteQuestionAction.SaveAllRouteQuestionsByMigrationId,
    (state, { payload }) => ({
      ...state,
      allRouteQuestionByMigrationId: payload,
    })
  ),
  on(
    RouteQuestionAction.SaveActiveRouteQuestionsByMigrationId,
    (state, { payload }) => ({
      ...state,
      activeRouteQuestionByMigrationId: payload,
    })
  ),
  on(RouteQuestionAction.ClearActiveRouteQuestionsByMigrationId, (state) => ({
    ...state,
    activeRouteQuestionByMigrationId: null,
  })),
  on(RouteQuestionAction.SaveGetRouteQuestionById, (state, { payload }) => ({
    ...state,
    singleRouteQuestion: payload,
  }))
);

export function routeQuestionReducer(state: State | undefined, action: Action) {
  return routeQuestionReducerInternal(state, action);
}
