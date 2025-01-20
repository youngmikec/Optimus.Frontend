import { createAction, props } from '@ngrx/store';
import {
  ITableView,
  ITableViewSetupPayload,
} from '../../interfaces/tableView.interface';

export const IsLoading = createAction(
  '[TableViews] IsLoading',
  props<{
    payload: boolean;
  }>()
);

export const SetActiveTableViews = createAction(
  '[TableViews] Set Active Table View',
  props<{
    payload: {
      view: ITableView;
    };
  }>()
);

export const CreateTableViewSetup = createAction(
  '[TableViews] Create Table View Setup',
  props<{
    payload: ITableViewSetupPayload;
  }>()
);

export const GetAllTableViewSetup = createAction(
  '[TableViews] Get All Table View Setup',
  props<{
    payload: {
      skip?: number;
      take?: number;
    };
  }>()
);

export const SaveGetAllTableViewSetup = createAction(
  '[TableViews] Save Get All Table View Setup',
  props<{
    payload: any;
  }>()
);

export const GetTableViewSetupByTableName = createAction(
  '[TableViews] Get Table View Setup By TableName',
  props<{
    payload: {
      tableViewName: string;
    };
  }>()
);

export const SaveGetTableViewSetupByTableName = createAction(
  '[TableViews] Save Get Table View Setup By TableName',
  props<{
    payload: any;
  }>()
);

export const SaveCreateTableViewSetup = createAction(
  '[TableViews] Save Table View Setup',
  props<{
    payload: any;
  }>()
);

export const UpdateActiveTableViews = createAction(
  '[TableViews] Set Active Table View',
  props<{
    payload: {
      id: number;
      view: ITableView;
    };
  }>()
);

export const UpdateTableViewSetupStatus = createAction(
  '[TableViews] Update Table View Setup Status',
  props<{
    payload: {
      id: number;
      status?: number;
      active?: boolean;
      tableViewName: string;
    };
  }>()
);

export const DeleteTableViewSetup = createAction(
  '[TableViews] Delete Table View Setup',
  props<{
    payload: {
      id: number;
      status?: number;
      active?: boolean;
      tableViewName: string;
    };
  }>()
);

export const ClearTableView = createAction('[TableViews] Clear Table view');
