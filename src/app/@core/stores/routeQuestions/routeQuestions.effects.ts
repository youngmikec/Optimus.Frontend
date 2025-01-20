import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as RouteQuestionAction from './routeQuestions.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class RouteQuestionEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllRouteQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteQuestionAction.GetAllRouteQuestions),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/getroutequestions/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteQuestionAction.SaveAllRouteQuestions({
                  payload: resData.entity,
                });
              } else {
                return RouteQuestionAction.SaveAllRouteQuestions({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Get All Route Question ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllRouteQuestionByMigrationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteQuestionAction.GetAllRouteQuestionsByMigrationId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/getroutequestionsbymigrationroute/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteQuestionAction.SaveAllRouteQuestionsByMigrationId({
                  payload: resData.entity,
                });
              } else {
                return RouteQuestionAction.SaveAllRouteQuestionsByMigrationId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Get All Route Question By Migration Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveRouteQuestionByMigrationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteQuestionAction.GetActiveRouteQuestionsByMigrationId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/getactiveroutequestions/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );
              this.store.dispatch(
                RouteQuestionAction.SuccessAction({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteQuestionAction.SaveActiveRouteQuestionsByMigrationId(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return RouteQuestionAction.SaveActiveRouteQuestionsByMigrationId(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Get Active Route Question By Migration Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetRouteQuestionById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RouteQuestionAction.SaveGetRouteQuestionById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/getroutequestionbyid/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return RouteQuestionAction.SaveAllRouteQuestions({
                  payload: resData.entity,
                });
              } else {
                return RouteQuestionAction.SaveGetRouteQuestionById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Get All Route Question ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.CreateRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        let newQuestionOption = [];

        newQuestionOption = data.payload.questionOptions.map((x) => {
          return {
            ...x,
            userId: authState.user.UserId,
          };
        });
        const newData = { ...data.payload };
        newData.questionOptions = newQuestionOption;

        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/create`,
            {
              ...newData,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                // this.dialog.closeAll();
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
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
                history.back();
                return {
                  type: '[RouteQuestion] Create Route Question Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteQuestionAction.IsLoading({ payload: false })
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
                  type: '[RouteQuestion] Failed To Create Route Question',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Create Route Question ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.EditRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/update`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                // this.dialog.closeAll();
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
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
                history.back();

                return {
                  type: '[RouteQuestion] Update Route Question Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteQuestionAction.IsLoading({ payload: false })
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
                RouteQuestionAction.IsLoading({ payload: false })
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

  editMultipleRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.EditMultipleRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/updateroutequestions`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                // this.dialog.closeAll();
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
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
                history.back();

                return {
                  type: '[RouteQuestion] Update Route Question Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  RouteQuestionAction.IsLoading({ payload: false })
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
                RouteQuestionAction.IsLoading({ payload: false })
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

  // delete route question
  deleteRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.DeleteRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const deletePayload = {
          userId: authState.user.UserId,
          id: data.payload.id,
          actorEmail: authState.user.email,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/delete`,
            {
              body: deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
                    payload: {
                      id: data.payload.migrationRouteId,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Route Question Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[RouteQuestion] Delete Route Question Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Route Question',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[RouteQuestion] Failed To Delete Route Question',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Delete Route Question ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.ActivateRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/activateroutequestion`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
                    payload: { id: data?.payload?.migrationId },
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
                  type: '[RouteQuestion] Route Question Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  RouteQuestionAction.IsLoading({ payload: false })
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
                  type: '[RouteQuestion] Failed To Activate Route Question',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Activate Route Question ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateRouteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RouteQuestionAction.DeactivateRouteQuestion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/RouteQuestions/deactivateroutequestion`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  RouteQuestionAction.GetAllRouteQuestionsByMigrationId({
                    payload: { id: data.payload.migrationId },
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
                  type: '[RouteQuestion] Route Question Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  RouteQuestionAction.IsLoading({ payload: false })
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
                  type: '[RouteQuestion] Failed To Deactivate Route Question',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                RouteQuestionAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[RouteQuestion][CatchError] Failed To Deactivate Route Question ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
