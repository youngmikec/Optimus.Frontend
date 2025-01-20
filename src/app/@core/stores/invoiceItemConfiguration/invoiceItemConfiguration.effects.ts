import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as InvoiceItemConfigurationActions from './invoiceItemConfiguration.actions';
import * as GeneralActions from '../general/general.actions';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { MatDialog } from '@angular/material/dialog';
import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class InvoiceItemsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  getInvoiceItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.GetInvoiceItems),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/getinvoiceitems/${authState.user.UserId}/${data.payload.skip}/99999`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return InvoiceItemConfigurationActions.SaveAllInvoiceItems({
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

                this.store.dispatch(
                  InvoiceItemConfigurationActions.IsLoading({ payload: false })
                );
                return {
                  type: '[Invoice Item Configuration] Failed To Get Invoice Items',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Get Invoice Items ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getInvoiceItemsByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.GetInvoiceItemsByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { take, skip, countryId } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/getactiveinvoiceitemsbycountryid/${authState.user.UserId}/${take}/${skip}/${countryId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return InvoiceItemConfigurationActions.SaveInvoiceItemsByCountryId(
                  {
                    payload: resData.entity.data,
                  }
                );
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  InvoiceItemConfigurationActions.IsLoading({ payload: false })
                );
                return {
                  type: '[Invoice Item Configuration] Failed To Get Invoice Items',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Get Invoice Items ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createInvoiceItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.CreateInvoiceItem),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );
              if (resData.succeeded) {
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.entity,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return InvoiceItemConfigurationActions.GetInvoiceItems({
                  payload: {
                    skip: DefaultPagination.skip,
                    take: DefaultPagination.take,
                  },
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

                return {
                  type: '[Invoice Item Configuration] Failed To Create Invoice Item',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Create Invoice Item ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetInvoiceItemsById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.GetInvoiceItemsById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([Data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/getinvoiceitembyid/${authState.user.UserId}/${Data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return InvoiceItemConfigurationActions.SaveGetInvoiceItemsById({
                  payload: resData.entity,
                });
              } else {
                return InvoiceItemConfigurationActions.SaveGetInvoiceItemsById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Items][CatchError] Failed To Get All Invoice Items ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  updateInvoiceItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.UpdateInvoiceItem),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(`${environment.OptivaImmigrationUrl}/InvoiceItems/update`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              if (resData.succeeded) {
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.entity,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return InvoiceItemConfigurationActions.GetInvoiceItems({
                  payload: {
                    skip: data.payload.skip ?? DefaultPagination.skip,
                    take: data.payload.take ?? DefaultPagination.take,
                  },
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.entity,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return InvoiceItemConfigurationActions.UpdateInvoiceItemFailure(
                  {
                    error: resData.entity,
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              return of(
                InvoiceItemConfigurationActions.UpdateInvoiceItemFailure({
                  error: errorRes.message,
                })
              );
            })
          );
      })
    )
  );

  activateInvoiceItemStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.ActivateInvoiceItemStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/activateinvoiceitem`,
            {
              id: data.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return InvoiceItemConfigurationActions.GetInvoiceItems({
                  payload: {
                    skip: data.payload.skip,
                    take: data.payload.take,
                  },
                });
              } else {
                this.store.dispatch(
                  InvoiceItemConfigurationActions.IsLoading({ payload: false })
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
                  type: '[Invoice Item Configuration] Failed To Update Invoice Item Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Change Invoice Item Status ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateInvoiceItemStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.DeactivateInvoiceItemStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/deactivateinvoiceitem`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return InvoiceItemConfigurationActions.GetInvoiceItems({
                  payload: { skip: data.payload.skip, take: data.payload.take },
                });
              } else {
                this.store.dispatch(
                  InvoiceItemConfigurationActions.IsLoading({ payload: false })
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
                  type: '[Invoice Item Configuration] Failed To Update Invoice Item Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Change Invoice Item Status ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // delete invoice item configuration.
  deleteInvoiceItemStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoiceItemConfigurationActions.DeleteInvioiceItemConfig),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceItems/deleteinvoiceitem`,
            {
              id: data.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                InvoiceItemConfigurationActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return InvoiceItemConfigurationActions.GetInvoiceItems({
                  payload: { skip: data.payload.skip, take: data.payload.take },
                });
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.dialog.closeAll();

                return {
                  type: '[Invoice Item Configuration] Failed To Delete Invoice Item Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Invoice Item Configuration][CatchError] Failed To Delete Invoice Item ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
