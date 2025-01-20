import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as FeaturesActions from './features.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import * as AuthAction from 'src/app/@core/stores/auth/auth.actions';

@Injectable()
export class FeaturesEffects {
  refreshToken: string;
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {
    const OptivaData = JSON.parse(localStorage.getItem('Optiva')!);
    this.refreshToken = OptivaData?.refreshToken;
  }

  createFeature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.CreateFeature),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Features/create`, {
            ...featureData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Feature List
                this.store.dispatch(
                  FeaturesActions.GetAllFeatures({
                    payload: {
                      skip: 0,
                      take: 0,
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
                  type: '[Feature] Create Feature Was Successful',
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
                  type: '[Feature] Failed To Create Feature',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Create Feature ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editFeature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.EditFeature),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Features/update`, {
            ...featureData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Feature List
                this.store.dispatch(
                  FeaturesActions.GetAllFeatures({
                    payload: {
                      skip: 0,
                      take: 1000,
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
                  type: '[Feature] Edit Feature Was Succesful',
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
                  type: '[Feature] Failed To Edit Feature',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Edit Feature ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllFeatures$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.GetAllFeatures),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Features/getall/${authState.user.UserId}/${featureData.payload.skip}/${featureData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FeaturesActions.SaveAllFeatures({
                  payload: resData.entity,
                });
              } else {
                return FeaturesActions.SaveAllFeatures({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Get All Features ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getPermissionsByAccessLevel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.GetPermissionByAccessLevel),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Features/getfeaturesandpermissionsbyaccesslevel/${featureData.payload.accessLevel}/${featureData.payload.skip}/${featureData.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FeaturesActions.SavePermissionByAccessLevel({
                  payload: resData.entity,
                });
              } else {
                return FeaturesActions.SavePermissionByAccessLevel({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Get All Permission By Access Level ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  toggleFeatureStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.ToggleFeatureStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Features/updatestatus`, {
            ...featureData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                // refresh token here
                this.store.dispatch(
                  AuthAction.RefreshToken({
                    payload: {
                      refreshToken: this.refreshToken,
                    },
                  })
                );
                // Refetch All Feature List
                this.store.dispatch(
                  FeaturesActions.GetAllFeatures({
                    payload: {
                      skip: 0,
                      take: 1000,
                    },
                  })
                );

                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Feature] Toggle Feature Status Successful',
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
                  type: '[Feature] Toggle Feature Status failed',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed Toggle Features Status ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllAccessLevels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FeaturesActions.GetAllAccessLevels),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Features/getpermissionsbyaccesslevel/${featureData.payload.accesslevel}/${featureData.payload.skip}/${featureData.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FeaturesActions.SaveAllAccessLevels({
                  payload: resData.entity,
                });
              } else {
                return FeaturesActions.SaveAllAccessLevels({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FeaturesActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Get All Access Levels ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
