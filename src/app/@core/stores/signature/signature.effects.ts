import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as SignatureAction from './signature.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class SignatureEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  GetSignatureByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignatureAction.GetSignatureByUserId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Signature/getsignaturebyuserid/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                return SignatureAction.SaveSignatureByUserId({
                  payload: resData.entity,
                });
              } else {
                return SignatureAction.SaveSignatureByUserId({
                  payload: null,
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Signature][CatchError] Failed To Get Signature By UserId ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateSignature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignatureAction.CreateSignature),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Signature/createsignature`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return SignatureAction.CreateSignatureSuccess({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return SignatureAction.CreateSignatureError({
                  error: resData.message,
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                SignatureAction.CreateSignatureError({ error: errorRes })
              );

              return of(errorRes);
            })
          );
      })
    );
  });

  UpdateSignature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignatureAction.UpdateSignature),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Signature/updatesignature`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return SignatureAction.UpdateSignatureSuccess({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return SignatureAction.UpdateSignatureError({
                  error: resData.message,
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                SignatureAction.UpdateSignatureError({ error: errorRes })
              );

              return of(errorRes);
            })
          );
      })
    );
  });
}
