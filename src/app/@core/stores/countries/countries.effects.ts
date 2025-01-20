import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as CountriesAction from './countries.actions';
import * as GeneralActions from '../general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class CountriesEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesAction.GetAllCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Countries/getcountries/${authState.user.UserId}/${skip}/${take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CountriesAction.SaveAllCountry({
                  payload: resData.entity.pageItems,
                });
              } else {
                return CountriesAction.SaveAllCountry({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get All Countries ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesAction.GetActiveCountries),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Countries/getactivecountries/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CountriesAction.SaveActiveCountries({
                  payload: resData.entity,
                });
              } else {
                return CountriesAction.SaveActiveCountries({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get All Countries ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetCountryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesAction.GetCountryById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Countries/getcountrybyid/${authState.user.UserId}/${countryData.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CountriesAction.SaveGetCountryById({
                  payload: resData.entity,
                });
              } else {
                return CountriesAction.SaveGetCountryById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get All Countries ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetCountryDashboardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesAction.GetCountryDashboardById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Countries/getcountryinformationcount/${countryData.payload.id}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CountriesAction.SaveGetCountryDashboardById({
                  payload: resData.entity,
                });
              } else {
                return CountriesAction.SaveGetCountryDashboardById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get All Countries ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getIsoCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesAction.GetIsoCountries),
      withLatestFrom(this.store.select('auth')),
      switchMap(([, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ISOCountries/getactiveisocountrycode3s/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return CountriesAction.SaveIsoCountries({
                  payload: resData.entity,
                });
              } else {
                return CountriesAction.SaveIsoCountries({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get Iso Countries ${errorRes.message}`,
              });
              return of();
            })
          );
      })
    )
  );

  getCountryProgramTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.GetCountryProgramTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([authState]) => {
        return this.http
          .get(`${environment.OptivaImmigrationUrl}/Utility/getprogramtypes`)
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  CountriesAction.SaveGetCountryProgramTypes({
                    payload: resData.entity,
                  })
                );

                return {
                  type: '[Contries] Country Program Types Successful',
                };
              } else {
                this.store.dispatch(
                  CountriesAction.IsLoading({ payload: false })
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
                  type: '[Countries] Failed To Create Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Get Program Types ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  CreateCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.CreateCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        const { skip, take } = countryData.payload;
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Countries/create`, {
            name: countryData.payload.name,
            currencyCode: countryData.payload.currencyCode,
            countryCode: countryData.payload.countryCode,
            flagUrl: countryData.payload.flagUrl,
            description: countryData.payload.description,
            programType: countryData.payload.programType,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(CountriesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  CountriesAction.GetAllCountry({
                    payload: { skip, take },
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
                  type: '[Countries] Create Country Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  CountriesAction.IsLoading({ payload: false })
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
                  type: '[Countries] Failed To Create Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Create Country ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.EditCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        const { skip, take } = countryData.payload;
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Countries/update`, {
            id: countryData.payload.id,
            name: countryData.payload.name,
            currencyCode: countryData.payload.currencyCode,
            countryCode: countryData.payload.countryCode,
            flagUrl: countryData.payload.flagUrl,
            description: countryData.payload.description,
            programType: countryData.payload.programType,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(CountriesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  CountriesAction.GetAllCountry({
                    payload: { skip, take },
                  })
                );
                if (resData.entity?.id) {
                  this.store.dispatch(
                    CountriesAction.GetCountryById({
                      payload: {
                        id: resData.entity?.id,
                      },
                    })
                  );
                }

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Countries] Update Country Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  CountriesAction.IsLoading({ payload: false })
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
                  type: '[Countries] Failed To Update Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Update Country ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.ActivateCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        const { skip, take, id } = countryData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Countries/activatecountry`,
            {
              id: id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(CountriesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  CountriesAction.GetAllCountry({
                    payload: { skip, take },
                  })
                );

                if (resData.entity?.id) {
                  this.store.dispatch(
                    CountriesAction.GetCountryById({
                      payload: {
                        id: resData.entity?.id,
                      },
                    })
                  );
                }

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Countries] Country Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  CountriesAction.IsLoading({ payload: false })
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
                  type: '[Countries] Failed To Activate Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Activate Country ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.DeactivateCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        const { skip, take, id } = countryData.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Countries/deactivatecountry`,
            {
              id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(CountriesAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  CountriesAction.GetAllCountry({
                    payload: { skip, take },
                  })
                );

                if (resData.entity?.id) {
                  this.store.dispatch(
                    CountriesAction.GetCountryById({
                      payload: {
                        id: resData.entity?.id,
                      },
                    })
                  );
                }

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Countries] Country Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  CountriesAction.IsLoading({ payload: false })
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
                  type: '[Countries] Failed To Deactivate Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                CountriesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Countries][CatchError] Failed To Deactivate Country ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Country effect
  deleteCountry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CountriesAction.DeleteCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take, id } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Countries/deletecountry`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  CountriesAction.GetAllCountry({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Department Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Department] Department Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Department',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Department] Failed To Delete Department',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Delete Department ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
