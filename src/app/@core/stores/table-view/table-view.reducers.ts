import { createReducer, on, Action } from '@ngrx/store';
import { ITableView } from '../../interfaces/tableView.interface';
import * as TableViewActions from './table-view.actions';
import { AppTableViewData } from '../../mock-data/table-view-data';

export interface State {
  isLoading: boolean;
  activeTableView: ITableView | null;
  tableViews: ITableView[];
  tableViewsByTablename: ITableView[];
}

const initialState: State = {
  isLoading: false,
  activeTableView: AppTableViewData.clientService.tableViews[0],
  tableViews: [],
  tableViewsByTablename: [],
};

const tableViewInternalReducer = createReducer(
  initialState,
  on(TableViewActions.SetActiveTableViews, (state, { payload }) => ({
    ...state,
    activeTableView: payload.view,
  })),
  on(TableViewActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(TableViewActions.ClearTableView, (state) => ({
    ...state,
    activeTableView: null,
  })),
  on(
    TableViewActions.SaveGetTableViewSetupByTableName,
    (state, { payload }) => ({
      ...state,
      tableViewsByTablename: payload,
    })
  ),
  on(TableViewActions.SaveCreateTableViewSetup, (state, { payload }) => ({
    ...state,
    activeTableView: payload,
  }))
);

export function TableViewReducer(state: State | undefined, action: Action) {
  return tableViewInternalReducer(state, action);
}
