import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as TableViewActions from './table-view.actions';
import * as GeneralActions from '../general/general.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class TableViewsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  //   updateMarkAsPaid$ = createEffect(() => {
  //     return this.actions$.pipe(
  //       ofType(InvoicesActions.updateMarkAsPaid),
  //       withLatestFrom(this.store.select('auth')),
  //       switchMap(([data, authState]) => {
  //         const updatePayload = {
  //           userId: authState.user.UserId,
  //           invoicePaymentDetailId: data.invoicePaymentDetailId,
  //           paymentStatus: data.paymentStatus,
  //         };

  //         return this.invoicesService.updateMarkAsPaid(updatePayload).pipe(
  //           map((res: IMARK_AS_PAID_RES) => {
  //             this.store.dispatch(
  //               InvoicesActions.createInvoiceLoading({ payload: false })
  //             );

  //             if (res.succeeded) {
  //               this.dialog.closeAll();

  //               this.store.dispatch(
  //                 InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId({
  //                   payload: {
  //                     applicationQuoteId: data.applicationQuoteId ?? 0,
  //                   },
  //                 })
  //               );

  //               this.store.dispatch(
  //                 InvoicesActions.GetInvoiceByApplicationQuoteId({
  //                   payload: {
  //                     id: data.applicationQuoteId ?? 0,
  //                     skip: 0,
  //                     take: 100,
  //                   },
  //                 })
  //               );

  //               const notification: Notification = {
  //                 state: 'success',
  //                 message: res.message ?? res.entity,
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-success'
  //               );

  //               return InvoicesActions.markAsPaidSuccessful();
  //             } else {
  //               const notification: Notification = {
  //                 state: 'error',
  //                 message: res.message,
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-error'
  //               );

  //               return InvoicesActions.markAsPaidFailed({ error: res.message });
  //             }
  //           }),
  //           catchError((err: any) => {
  //             this.store.dispatch(
  //               InvoicesActions.createInvoiceLoading({ payload: false })
  //             );

  //             return of(
  //               InvoicesActions.markAsPaidFailed({
  //                 error: err.message,
  //               })
  //             );
  //           })
  //         );
  //       })
  //     );
  //   });

  // get all table view setup
  getAllTableViewSetups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TableViewActions.GetAllTableViewSetup),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ViewSetup/setups/${authState.user.UserId}/${skip}/${take}`
          )
          .pipe(
            map((res: any) => {
              if (res.succeeded && res.entity.data.length) {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );
                const { tableColumns } = res.entity.data;
                const parsedData =
                  typeof tableColumns === 'string'
                    ? {
                        ...res.entity.data,
                        tableColumns: JSON.parse(tableColumns),
                      }
                    : res.entity.data;

                this.store.dispatch(
                  TableViewActions.SaveGetAllTableViewSetup({
                    payload: parsedData,
                  })
                );
                return {
                  type: '[TableViews] Retrieved Table views successfully',
                };
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: res.message || 'Error Fetching Table Views',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[TableViews] Failed To Retrieve Table Views',
                };
              }
            }),
            catchError((err: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                message: `${err.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[TableViews][CatchError] Failed To Retrieve Table Views ${err.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  // get table view setup by table name
  getTableViewSetupByTableName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TableViewActions.GetTableViewSetupByTableName),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { tableViewName } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ViewSetup/setupsbytableViewName/${authState.user.UserId}/?tableViewName=${tableViewName}`
          )
          .pipe(
            map((res: any) => {
              if (res.succeeded) {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  TableViewActions.SaveGetTableViewSetupByTableName({
                    payload: res.entity.data,
                  })
                );

                return {
                  type: '[TableViews] Retrieved Table views successfully',
                };
              } else {
                this.store.dispatch(
                  TableViewActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: res.message || 'Error Fetching Table Views',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[TableViews] Failed To Retrieve Table Views',
                };
              }
            }),
            catchError((err: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                message: `${err.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[TableViews][CatchError] Failed To Retrieve Table Views ${err.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  createInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TableViewActions.CreateTableViewSetup),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/ViewSetup/save/`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((res: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.store.dispatch(
                TableViewActions.SaveCreateTableViewSetup({
                  payload: res.entity.data,
                })
              );

              if (res.succeeded) {
                this.store.dispatch(
                  TableViewActions.GetTableViewSetupByTableName({
                    payload: {
                      tableViewName: data.payload.tableViewName,
                    },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `Table View Setup created successfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[TableViews] Create Table View was Successful',
                };
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: res.message,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[TableViews] Create Table View Error',
                };
              }
            }),
            catchError((err: any) => {
              this.store.dispatch(
                TableViewActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                message: `${err.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[TableViews][CatchError] Failed To Retrieve Table Views ${err.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  //Update Table View Status
  updateTableViewStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TableViewActions.DeleteTableViewSetup),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { status, active, id, tableViewName } = data.payload;
        const deletePayload = {
          id,
          status,
          active,
          userId: authState.user.UserId,
        };
        return this.http
          .delete<any>(`${environment.OptivaImmigrationUrl}/ViewSetup/delete`, {
            body: {
              ...deletePayload,
            },
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  TableViewActions.GetTableViewSetupByTableName({
                    payload: { tableViewName },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Table View Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[TableView] Table View Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Table View',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[TableView] Failed To Delete Table View',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[TableView][CatchError] Failed To Delete Table View ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Table View
  deleteTableView$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TableViewActions.DeleteTableViewSetup),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { status, active, id, tableViewName } = data.payload;
        const deletePayload = {
          id,
          status,
          active,
          userId: authState.user.UserId,
        };
        return this.http
          .delete<any>(`${environment.OptivaImmigrationUrl}/ViewSetup/delete`, {
            body: {
              ...deletePayload,
            },
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  TableViewActions.GetTableViewSetupByTableName({
                    payload: { tableViewName },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Table View Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[TableView] Table View Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Table View',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[TableView] Failed To Delete Table View',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[TableView][CatchError] Failed To Delete Table View ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
