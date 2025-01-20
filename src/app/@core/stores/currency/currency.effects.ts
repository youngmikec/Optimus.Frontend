import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';

// import { DefaultPagination } from '../../enums/default-pagination.enum';

import * as fromApp from '../app.reducer';
import * as CurrencyActions from '../currency/currency.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class CurrencyEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient, // private dialog: MatDialog, // private notificationService: NotificationService
    // private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  private handleCatchError = (errorRes: any, type: string) => {
    this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

    const notification: Notification = {
      state: 'error',
      title: 'System Notification',
      message: `[Auth] ${errorRes.name}`,
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-error'
    );

    this.store.dispatch({
      type: type,
    });

    return of();
  };

  getAllCurrencyEnums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.GetAllCurrencyEnums),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        return this.http
          .get(`${environment.OptivaImmigrationUrl}/Utility/getcurrencycodes`)
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CurrencyActions.SaveAllCurrencyEnums({
                  payload: resData.entity,
                });
              } else {
                return CurrencyActions.SaveAllCurrencyEnums({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Get All Currency Enums ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.CreateCurrency),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        const { skip, take } = currencyData.payload;
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Currencies/create`, {
            name: currencyData.payload.name,
            currencyCode: currencyData.payload.currencyCode,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(CurrencyActions.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // Refetch All currency List
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
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

                this.dialog.closeAll();

                return {
                  type: '[Roles] Create Currency Was Succesful',
                };
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
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
                  type: '[Roles] Failed To Create Currency',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Create Role Permission ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getCurrencyTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.GetCurrencyTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Currencies/bankcurrencies/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Currency Types Loaded Successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return CurrencyActions.GetCurrencyTypesSuccess({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: 'Currency Types Failed To Load',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Currency] Failed To Get Currency types',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getAllCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.GetAllCurrencies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        const { skip, take } = currencyData.payload;
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/Currencies/getcurrencies/${authState.user.UserId}/${skip}/${take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CurrencyActions.SaveAllCurrencies({
                  payload: resData.entity.data,
                });
              } else {
                return CurrencyActions.SaveAllCurrencies({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Get All Currency ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  updateCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.UpdateCurrency),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        const { skip, take } = currencyData.payload;
        const payload = {
          id: currencyData.payload.id,
          currencyCode: currencyData.payload.currencyCode,
          name: currencyData.payload.name,
          isDefault: currencyData.payload.isDefault,
        };
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Currencies/update`, {
            ...payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Currency Updated Successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();
                // payload: {
                //   skip: DefaultPagination.skip,
                //   take: DefaultPagination.take,
                // },

                return {
                  type: '[Currency] Update Currency Was Succesful',
                };
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
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
                  type: '[Currency] Failed To Update Currency',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Currency] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Update Currency ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  changeCurrencyConfigurationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.ChangeCurrencyConfigurationStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        const { skip, take } = currencyData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Currencies/changeCurrencyStatus`,
            {
              id: currencyData.payload.id,
              status: currencyData.payload.status,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: 'Currency Status Changed Successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Currency] Change Currency Status Was Succesful',
                };
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                return {
                  type: '[Currency] Failed To Change Currency Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Currency] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Change Currency Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getAllExchangeRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.GetAllExchangeRates),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/getexchangerates/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CurrencyActions.SaveAllExchangeRates({
                  payload: resData.entity,
                });
              } else {
                return CurrencyActions.SaveAllExchangeRates({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Get All ExchangeRates ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createCurrencyConversion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.CreateCurrencyConversion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyConvertData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/create`,
            {
              ...currencyConvertData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded) {
                this.dialog.closeAll();
                // Refetch All currency List
                this.store.dispatch(CurrencyActions.GetAllExchangeRates());
                // this.router.navigate(['/app/admin-settings/currency-config']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.entity,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Roles] Create Exchange Rate Was Succesful',
                };
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
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
                  type: '[Roles] Failed To Create Exchange Rate',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Create Role Permission ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateCurrencyConversion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.UpdateCurrencyConversion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/update`,
            {
              ...currencyData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: 'Exchange Rate Updated Successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(CurrencyActions.GetAllExchangeRates());
                // payload: {
                //   skip: DefaultPagination.skip,
                //   take: DefaultPagination.take,
                // },

                return {
                  type: '[Currency] Update Exchange Rate Was Succesful',
                };
              } else {
                this.store.dispatch(
                  CurrencyActions.IsLoading({ payload: false })
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
                  type: '[Currency] Failed To Update Exchange Rate',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Currency] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Update Currency ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  activateCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.ActivateCurrency),
      withLatestFrom(this.store.select('auth')),
      switchMap(([CurrencyData, authState]) => {
        const { skip, take } = CurrencyData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Currencies/activatecurrency`,
            {
              userId: authState.user.UserId,
              id: CurrencyData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded) {
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
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
                  type: '[Currency] Currency Was Successfully Activated',
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

                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                return {
                  type: '[Currency] Failed To Activate Currency',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.GetAllCurrencies({
                  payload: { skip: skip || 0, take: take || 10 },
                })
              );

              return this.handleCatchError(
                errorRes,
                '[Currency][CatchError] Failed to Activate Currency'
              );
            })
          );
      })
    )
  );

  deactivateCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.DeactivateCurrency),
      withLatestFrom(this.store.select('auth')),
      switchMap(([CurrencyData, authState]) => {
        const { skip, take } = CurrencyData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Currencies/deactivatecurrency`,
            {
              userId: authState.user.UserId,
              id: CurrencyData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded) {
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
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
                  type: '[Currency] Currency Was Successfully Deactivated',
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

                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                return {
                  type: '[Currency] Failed To Deactivate Currency',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.GetAllCurrencies({
                  payload: { skip: skip || 0, take: take || 10 },
                })
              );

              return this.handleCatchError(
                errorRes,
                '[Currency][CatchError] Failed to Deactivate Currency'
              );
            })
          );
      })
    )
  );

  activateCurrencyConversion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.ActivateCurrencyConversion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([CurrencyData, authState]) => {
        const { skip, take } = CurrencyData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/activateexchangerate`,
            {
              userId: authState.user.UserId,
              id: CurrencyData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
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

                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                return {
                  type: '[Currency] Echange Rate Was Succesfully Activated',
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
                  type: '[Currency] Failed To Activate Exchange Rate',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Currency] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Activate Exchange Rate ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  deactivateCurrencyConversion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.DeactivateCurrencyConversion),
      withLatestFrom(this.store.select('auth')),
      switchMap(([CurrencyData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/deactivateexchangerate`,
            {
              userId: authState.user.UserId,
              id: CurrencyData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
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

                this.store.dispatch(CurrencyActions.GetAllExchangeRates());

                return {
                  type: '[Currency] Exchange Rate Was Succesfully Deactivated',
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
                  type: '[Currency] Failed To Deactivate Exchange Rate',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Currency] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Deactivate Exchange Rate ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getExchangeRateById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.GetExchangeRateById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([currencyData, authState]) => {
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/getexchangeratebyid/${authState.user.UserId}/${currencyData.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CurrencyActions.SaveExchangeRateById({
                  payload: resData.entity,
                });
              } else {
                return CurrencyActions.SaveExchangeRateById({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Get Exchange Rate By Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveExchangeRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.GetActiveExchangeRates),
      withLatestFrom(this.store.select('auth')),
      switchMap(([, authState]) => {
        return this.http
          .get(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/getactiveexchangerates/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                return CurrencyActions.SaveActiveExchangeRates({
                  payload: resData.entity,
                });
              } else {
                return CurrencyActions.SaveActiveExchangeRates({
                  payload: [],
                });
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                CurrencyActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Get All ExchangeRates ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  //delete Currency effect
  deleteCurrency$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.DeleteCurrency),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Currencies/deletecurrency`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  CurrencyActions.GetAllCurrencies({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Currency Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Currency] Currency Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Currency',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Currency] Failed To Delete Currency',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Delete Currency ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Exchange Rate effect
  deleteExchangeRate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.DeleteExchangeRate),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ExchangeRates/deleteexchangerate`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(CurrencyActions.GetAllExchangeRates());
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Exchange Rate Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Currency] Exchange Rate Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Exchange Rate',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Currency] Failed To Delete Exchange Rate',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Currency][CatchError] Failed To Delete Exchange Rate ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
