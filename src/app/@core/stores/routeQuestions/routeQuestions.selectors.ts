import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromRouteQuestion from './routeQuestions.reducer';

const getRouteQuestionState = (state: fromApp.AppState) => state.routeQuestion;

export const getRouteQuestionIsLoading = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.isLoading
);

export const getSuccessAction = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.successAction
);

export const getAllRouteQuestion = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.allRouteQuestion
);

export const getAllRouteQuestionByMigrationId = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.allRouteQuestionByMigrationId
);

export const getActiveRouteQuestionByMigrationId = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.activeRouteQuestionByMigrationId
);

export const getRouteQuestionById = createSelector(
  getRouteQuestionState,
  (state: fromRouteQuestion.State) => state.singleRouteQuestion
);
