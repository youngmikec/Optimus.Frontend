import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, share, switchMap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import * as fromApp from '../app.reducer';
import * as PartnerActions from './partners.actions';
import {
  IGET_ALL_PARTNERS_RESPONSE,
  IMULTIPLE_UPDATE_PARTNER_STATUS_RES,
} from '../../models/partners.model';
import { DefaultPagination } from '../../enums/default-pagination.enum';
import { Notification } from '../../interfaces/notification.interface';

@Injectable()
export class PartnerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getAllPartners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PartnerActions.GetAllPartners),
      withLatestFrom(this.store.select('auth')),
      switchMap(([partnerData, authState]) => {
        return this.http
          .get<IGET_ALL_PARTNERS_RESPONSE>(
            `${environment.OptivaAuthUrl}/Partner/getallpartners/${authState.user.UserId}/${partnerData.payload.skip}/${partnerData.payload.take}`
          )
          .pipe(
            map((res: IGET_ALL_PARTNERS_RESPONSE) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              if (res.succeeded && res.entity?.pageItems) {
                return PartnerActions.SaveAllPartners({
                  payload: res,
                });
              } else {
                return {
                  type: '[Partner Management Table] Failed To Get All Partners',
                };
              }
            }),
            catchError((error) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Partners][CatchError] Failed To Get All Users ${error.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createPartner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartnerActions.CreatePartner),
      withLatestFrom(this.store.select('auth')),
      switchMap(([partnerData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Partner/createpartneruser`, {
            ...partnerData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Users List
                this.store.dispatch(
                  PartnerActions.GetAllPartners({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                this.router.navigate([
                  '/app/admin-settings/partner-management',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate([
                  '/app/admin-settings/partner-management',
                ]);

                return {
                  type: '[Partner] Create Partner Was Successful',
                };
              } else {
                this.store.dispatch(
                  PartnerActions.IsLoading({ payload: false })
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
                  type: '[Partner] Failed To Create Partner',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Partner][CatchError] Failed To Create Partner ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editPartner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartnerActions.EditPartner),
      withLatestFrom(this.store.select('auth')),
      switchMap(([partnerData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Partner/updatepartneruser`, {
            ...partnerData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Partners List
                this.store.dispatch(
                  PartnerActions.GetAllPartners({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                this.router.navigate([
                  '/app/admin-settings/partner-management',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  PartnerActions.GetAllPartners({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Edit Partner] Updated Partner Record Successfully',
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
                  type: '[Edit Partner] Failed To Update Partner',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Services] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Partner][CatchError] Failed To Update Partner ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getPartnerByIdForEdit$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PartnerActions.GetPartnerByIdForEdit),
        withLatestFrom(this.store.select('auth')),
        switchMap(([partnerData, authState]) => {
          return this.http
            .get(
              `${environment.OptivaAuthUrl}/Partner/getpartnerusersbyid/${partnerData.payload.loggedInUserId}/${partnerData.payload.partnerUserId}`
            )
            .pipe(
              map((resData: any) => {
                this.store.dispatch(
                  PartnerActions.IsLoading({ payload: false })
                );

                if (resData.succeeded === true) {
                  //
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
                    type: '[Edit Partner] Failed To Get Partner By Id For Effect',
                  };
                }

                return resData;
              }),
              catchError((errorRes) => {
                this.store.dispatch(
                  PartnerActions.IsLoading({ payload: false })
                );

                this.store.dispatch({
                  type: `[Edit Partner][CatchError] Failed To Get Partner By Id For Effect ${errorRes.message}`,
                });

                return of();
              })
            );
        }),
        share()
      );
    },
    { dispatch: false }
  );

  changePartnerStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PartnerActions.ChangePartnerStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([partnerData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaAuthUrl}/Partner/changepartneruserstatus`,
            {
              ...partnerData.payload,
            }
          )
          .pipe(
            map((res: any) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              if (res.succeeded) {
                this.store.dispatch(
                  PartnerActions.GetAllPartners({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: res.message || res.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Partners] Change Partner Status Was Succesful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: res.message || res.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Users] Failed To Change Partner Status',
                };
              }
            }),
            catchError((error: any) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Users] ${error.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Partners][CatchError] Failed To Change Partner ${error.message}`,
              });
              return of();
            })
          );
      })
    )
  );

  changeMultiplePartnerStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartnerActions.ChangeMultiplePartnerStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([partnerData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaAuthUrl}/Partner/changemultiplePartnersstatus`,
            {
              partnerUserIds: partnerData.payload.partnerUserIds,
              userId: authState.user.UserId,
              status: partnerData.payload.action,
            }
          )
          .pipe(
            map((res: IMULTIPLE_UPDATE_PARTNER_STATUS_RES) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              if (res.succeeded) {
                // this.store.dispatch(
                //   PartnerActions.GetAllPartners({
                //     payload: {
                //       skip: 0,
                //       take: 0,
                //     },
                //   })
                // );

                this.router.navigate([
                  '/app/admin-settings/partner-management',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: res.message
                    ? res.message
                    : res.messages !== null
                    ? res.messages[0]
                    : 'Successfully updated partners',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  PartnerActions.GetAllPartners({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Multiple Status Update] Updated Partner Record Successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: res.message
                    ? res.message
                    : res.messages !== null
                    ? res.messages[0]
                    : 'An error occurred',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Multiple Status Update] Failed To Update Partners',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(PartnerActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Services] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Partner][CatchError] Failed To Update Partner ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });
}
