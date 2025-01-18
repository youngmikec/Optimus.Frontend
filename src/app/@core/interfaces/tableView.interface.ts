export interface ITableView {
  id: number;
  tableViewName: string;
  name: string;
  description: string;
  active: boolean;
  tableColumns: ITableColumn[]; //[""] 7
  createdDate: Date;
}

export interface ITableColumn {
  name: string;
  propertyName: string;
  serialNumber: number;
  isSelected: boolean;
}

export interface ITableViewSetupPayload {
  id?: number;
  tableViewName: string;
  name: string;
  description: string;
  active: boolean;
  serialNumber: number;
  tableColumns: ITableColumn[]; //[""] 7
  status?: number;
}
