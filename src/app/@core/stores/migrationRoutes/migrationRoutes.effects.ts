import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as fromApp from '../app.reducer';
import * as MigrationRoutesAction from './migrationRoutes.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { environment } from 'src/environments/environment';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MigrationRouteService } from './migration-routes.service';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class MigrationRoutesEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private migrationRouteService: MigrationRouteService
  ) {}

  getAllMigrationRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetAllMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/getmigrationroutes/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveAllMigrationRoutes({
                  payload: resData.entity,
                });
              } else {
                return MigrationRoutesAction.SaveAllMigrationRoutes({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Get All MigrationRoutes ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllMigrationRouteByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetAllMigrationRoutesByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/getmigrationroutesbycountry/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveAllMigrationRoutesByCountryId({
                  payload: resData.entity,
                });
              } else {
                return MigrationRoutesAction.SaveAllMigrationRoutesByCountryId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Get All Migration Routes By Country Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveMigrationRouteByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetActiveMigrationRoutesByCountryId),
      switchMap((data) => {
        const countryId = data.payload.id;
        return this.migrationRouteService
          .getActiveMigrationRouteByCountryId(countryId)
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveActiveMigrationRoutesByCountryId(
                  {
                    payload: resData.entity.data,
                  }
                );
              } else {
                return MigrationRoutesAction.SaveActiveMigrationRoutesByCountryId(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Get Active Migration Routes By Country Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetMigrationRoutesById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetMigrationRoutesById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/getmigrationroutebyid/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveGetMigrationRoutesById({
                  payload: resData.entity,
                });
              } else {
                return MigrationRoutesAction.SaveGetMigrationRoutesById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Get All Migration Routes ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllInvestmentTiersByMigrationRouteId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetAllInvestmentTiersByMigrationRouteId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/InvestmentTier/getinvestmenttiersbymigrationroute/${authState.user.UserId}/${data?.payload?.migrationRouteId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveAllInvestmentTiersByMigrationRouteId(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return MigrationRoutesAction.SaveAllInvestmentTiersByMigrationRouteId(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoute][CatchError] Failed To Get All Investment tiers ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllInvestmentTierNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MigrationRoutesAction.GetAllInvestmentTierNames),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/InvestmentTier/getinvestmenttiernames/${authState.user.UserId}/${data?.payload?.migrationRouteId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return MigrationRoutesAction.SaveAllInvestmentTierNames({
                  payload: resData.entity,
                });
              } else {
                return MigrationRoutesAction.SaveAllInvestmentTierNames({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoute][CatchError] Failed To Get All Investment tier names ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  deleteInvestmentTier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.DeleteInvestmentTier),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const deletePayload = {
          userId: authState.user.UserId,
          id: data.payload.id,
          actorEmail: authState.user.email,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/InvestmentTier/delete`,
            {
              body: deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  MigrationRoutesAction.GetAllInvestmentTiersByMigrationRouteId(
                    {
                      payload: {
                        migrationRouteId: data.payload.migrationRouteId,
                      },
                    }
                  )
                );

                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Investment tier Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[MigrationRoute] Delete Investment tier Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed to Delete Investment tier',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[MigrationRoute] Failed To Delete Inves',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[MigrationRoute][CatchError] Failed To Delete Investment Tier ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  CreateMigrationRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.CreateMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  MigrationRoutesAction.GetAllMigrationRoutesByCountryId({
                    payload: { id: data.payload.countryId },
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
                  type: '[MigrationRoutes] Create Migration Routes Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
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
                  type: '[MigrationRoutes] Failed To Create Migration Routes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Create Migration Routes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editMigrationRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.EditMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/update`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  MigrationRoutesAction.GetAllMigrationRoutesByCountryId({
                    payload: { id: resData.entity.countryId },
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
                  type: '[MigrationRoutes] Update Migration Routes Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
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
                  type: '[MigrationRoutes] Failed To Update Migration Routes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Update Migration Routes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  CreateInvestmentTier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.CreateInvestmentTier),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvestmentTier/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  MigrationRoutesAction.GetAllInvestmentTiersByMigrationRouteId(
                    {
                      payload: {
                        migrationRouteId: data.payload.migrationRouteId,
                      },
                    }
                  )
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
                  type: '[MigrationRoutes] Create Investment Tier Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
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
                  type: '[MigrationRoutes] Failed To Create Investment Tier',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Create Investment Tier ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editInvestmentTier$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.EditInvestmentTier),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/InvestmentTier/update`,
            {
              id: data.payload.id,
              status: data.payload.status,
              name: data.payload.name,
              serialNo: data.payload.serialNo,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  MigrationRoutesAction.GetAllInvestmentTiersByMigrationRouteId(
                    {
                      payload: {
                        migrationRouteId: data.payload.migrationRouteId,
                      },
                    }
                  )
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
                  type: '[MigrationRoutes] Update Investment Tier Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
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
                  type: '[MigrationRoutes] Failed To Update Investment Tier',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Update Investment Tier ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateMigrationRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.ActivateMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/activatemigrationroute`,
            {
              id: data.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  MigrationRoutesAction.GetAllMigrationRoutesByCountryId({
                    payload: { id: data.payload.countryId },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || 'Migration Routes Activated Succesfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[MigrationRoutes] Migration Routes Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed To Activate Migration Routes',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[MigrationRoutes] Failed To Activate Migration Routes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Activate Migration Routes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateMigrationRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.DeactivateMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/deactivatemigrationroute`,
            {
              id: data.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  MigrationRoutesAction.GetAllMigrationRoutesByCountryId({
                    payload: { id: data.payload.countryId },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message ||
                    'Migration Route Deactivated Succesfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[MigrationRoute] Migration Route Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  MigrationRoutesAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed To Deactivate Migration Route',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[MigrationRoute] Failed To Deactivate Migration Route',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                MigrationRoutesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[MigrationRoute][CatchError] Failed To Deactivate Migration Route ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete PaymentPlan effect
  deletePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MigrationRoutesAction.DeleteMigrationRoutes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, countryId } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/MigrationRoutes/deletemigrationroute`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  MigrationRoutesAction.GetAllMigrationRoutesByCountryId({
                    payload: { id: countryId },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Migration Route Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[MigrationRoutes] Migration Routes Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed to Delete Migration Routes',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[MigrationRoutes] Failed To Delete Migration Routes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[MigrationRoutes][CatchError] Failed To Delete Migration Routes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
