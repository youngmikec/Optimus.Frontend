type TableColumnType =
  | 'checkbox'
  | 'text'
  | 'number'
  | 'email'
  | 'object'
  | 'boolean'
  | 'status'
  | 'date'
  | 'date-time'
  | 'document'
  | 'actions';

export type ActionTypes = 'edit' | 'toggle';
export type ActionEventTypes = 'edit' | 'activate' | 'deactivate';

export interface ITableColumn {
  name: string;
  key: string;
  type: TableColumnType;
  objectProp?: string; // If value to be accesed is an object, provide object key
}

export interface IActionButton {
  action: ActionTypes;
  permisson: string;
}

export interface IPagination {
  totalRecords: number;
}
