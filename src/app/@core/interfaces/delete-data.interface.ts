export interface IDeleteData {
  dialogTitle: string;
  entityName: string;
  deleteRecord: any;
  migrationRouteId?: number;
  submitAction?: (data: any) => any;
}
