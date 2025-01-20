import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromTableView from './table-view.reducers';

export const getTableViewState = (state: fromApp.AppState) => state.tableView;

export const getActiveTableView = createSelector(
  getTableViewState,
  (state: fromTableView.State) => state.activeTableView
);

export const getIsLoading = createSelector(
  getTableViewState,
  (state: fromTableView.State) => state.isLoading
);

export const getAllTableViewSetups = createSelector(
  getTableViewState,
  (state: fromTableView.State) => state.tableViews
);

export const getTableViewSetupsByTableName = createSelector(
  getTableViewState,
  (state: fromTableView.State) => state.tableViewsByTablename
);
