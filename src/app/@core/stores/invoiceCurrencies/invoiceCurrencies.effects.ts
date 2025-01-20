import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as InvoiceCurrenciesAction from './invoiceCurrencies.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class InvoiceCurrenciesEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllInvoiceCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.GetAllInvoiceCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/getinvoicecurrencies/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return InvoiceCurrenciesAction.SaveAllInvoiceCurrencies({
                  payload: resData.entity,
                });
              } else {
                return InvoiceCurrenciesAction.SaveAllInvoiceCurrencies({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Get All Invoice Currencies ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllInvoiceCurrenciesByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/getinvoicecurrenciesbycountry/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return InvoiceCurrenciesAction.SaveAllInvoiceCurrenciesByCountryId(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return InvoiceCurrenciesAction.SaveAllInvoiceCurrenciesByCountryId(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Get All Invoice Currencies By Migration Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateInvoiceCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.CreateInvoiceCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
                    payload: {
                      id: resData.entity.countryId || data.payload.countryId,
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
                  type: '[InvoiceCurrencies] Create Invoice Currencies Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  InvoiceCurrenciesAction.IsLoading({ payload: false })
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
                  type: '[InvoiceCurrencies] Failed To Create Invoice Currencies',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Create Invoice Currencies ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editInvoiceCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.EditInvoiceCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/update`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
                    payload: {
                      id: resData.entity.countryId || data.payload.countryId,
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
                  type: '[InvoiceCurrencies] Update Invoice Currencies Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  InvoiceCurrenciesAction.IsLoading({ payload: false })
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
                  type: '[InvoiceCurrencies] Failed To Update Invoice Currencies',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Update Invoice Currencies ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateInvoiceCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.ActivateInvoiceCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/activateinvoicecurrency`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
                    payload: {
                      id: resData.entity.countryId || data.payload.countryId,
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
                  type: '[InvoiceCurrencies] Invoice Currencies Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  InvoiceCurrenciesAction.IsLoading({ payload: false })
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
                  type: '[InvoiceCurrencies] Failed To Activate Invoice Currencies',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Activate Invoice Currencies ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateInvoiceCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceCurrenciesAction.DeactivateInvoiceCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceCurrencies/deactivateinvoicecurrency`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  InvoiceCurrenciesAction.GetAllInvoiceCurrenciesByCountryId({
                    payload: {
                      id: resData.entity.countryId || data.payload.countryId,
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
                  type: '[InvoiceCurrencies] Invoice Currencies Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  InvoiceCurrenciesAction.IsLoading({ payload: false })
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
                  type: '[InvoiceCurrencies] Failed To Deactivate Invoice Currencies',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceCurrenciesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[InvoiceCurrencies][CatchError] Failed To Deactivate Invoice Currencies ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
