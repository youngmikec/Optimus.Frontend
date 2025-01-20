import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as RouteFeesAction from './routeFees.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class RouteFeeEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllRouteFees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteFeesAction.GetAllRouteFees),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/getroutefees/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteFeesAction.SaveAllRouteFees({
                  payload: resData.entity,
                });
              } else {
                return RouteFeesAction.SaveAllRouteFees({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Get All Route Fees ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetAllRouteFeeByMigrationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteFeesAction.GetAllRouteFeesByMigrationId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/getroutefeesbymigrationroute/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteFeesAction.SaveAllRouteFeesByMigrationId({
                  payload: resData.entity,
                });
              } else {
                return RouteFeesAction.SaveAllRouteFeesByMigrationId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Get All Route Fees ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.CreateRouteFees),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        let newRouteFeeItemArr = [];
        newRouteFeeItemArr = data.payload.routeFeeItems.map((x) => {
          return {
            ...x,
            userId: authState.user.UserId,
          };
        });
        const newData = { ...data.payload };
        newData.routeFeeItems = newRouteFeeItemArr;

        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/RouteFees/create`, {
            ...newData,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(RouteFeesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data.payload.migrationRouteId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                return {
                  type: '[RouteFees] Create Route Fees Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteFeesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFees] Failed To Create Route Fees',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Create Route Fees ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.EditRouteFees),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/RouteFees/update`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(RouteFeesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // this.dialog.closeAll();
                // this.store.dispatch(RouteFeesAction.GetAllRouteFees());
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data.payload.migrationRouteId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[RouteFees] Update Route Fees Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteFeesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFees] Failed To Update Route Fees',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Update Route Fees ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editMultipleRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.EditMultipleRouteFee),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/updateroutefees`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RouteFeesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // this.dialog.closeAll();
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: { id: data?.payload?.migrationRouteId },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[RouteQuestion] Update Route Question Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteFeesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteQuestion] Failed To Update Route Question',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Update Route Question ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deleteRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.DeleteRouteFee),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const deletePayload = {
          userId: authState.user.UserId,
          id: data.payload.id,
          actorEmail: authState.user.email,
        };
        return this.http
          .delete<any>(`${environment.OptivaImmigrationUrl}/RouteFees/delete`, {
            body: deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data.payload.migrationRouteId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Route Fee Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[RouteFee] Delete Route Fee Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Route Fee',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFee] Failed To Delete Route Fee',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[RouteFee][CatchError] Failed To Delete Investment Tier ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.ActivateRouteFees),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/activateroutefee`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RouteFeesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data?.payload?.migrationId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[RouteFees] Route Fees Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  RouteFeesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFees] Failed To Activate Route Fees',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Activate Route Fees ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateRouteFee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.DeactivateRouteFees),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/deactivateroutefee`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RouteFeesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data?.payload?.migrationId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[RouteFees] Route Fees Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  RouteFeesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFees] Failed To Deactivate Route Fees',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteFeesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Deactivate Route Fees ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateRouteFeeSerialNumber$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteFeesAction.UpdateRouteFeesSerialNumber),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteFees/updateroutefeeserialnumer`,
            {
              routeFees: data.payload.routeFees,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteFeesAction.GetAllRouteFeesByMigrationId({
                    payload: {
                      id: data?.payload?.migrationRouteId,
                    },
                  })
                );
                // this.store.dispatch(
                //   RouteFeesAction.UpdateRouteFeesSerialNumberSuccess({
                //     payload: {
                //       entity: resData.entity,
                //     },
                //   })
                // );

                return {
                  type: '[RouteFees] Route Fees Sequence Updated Succesfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteFees] Failed To Update Route Fees Sequence',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[RouteFees][CatchError] Failed To Update Route Fees Sequence ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
