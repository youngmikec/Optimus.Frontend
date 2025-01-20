import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as GeneralActions from './general.actions';
// import { Notification } from '../../interfaces/notification.interface';
// import { NotificationService } from '../../services/notification.service';

@Injectable()
export class GeneralEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient // private notificationService: NotificationService
  ) {}

  getAllAccessLevels$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetAllAccessLevels),
      withLatestFrom(this.store.select('auth')),
      switchMap(([generalData, authState]) => {
        return (
          this.http
            // .get<any>(`${environment.OptivaAuthUrl}/Utility/getroleaccesslevels`)
            .get<any>(`${environment.OptivaAuthUrl}/Utility/getaccesslevels`)
            .pipe(
              map((resData) => {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                if (resData.succeeded === true) {
                  return GeneralActions.SaveAllAccessLevels({
                    payload: resData.entity,
                  });
                } else {
                  return GeneralActions.SaveAllAccessLevels({
                    payload: [],
                  });
                }
              }),
              catchError((errorRes: any) => {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                this.store.dispatch({
                  type: `[Feature][CatchError] Failed To Get All Access Levels ${errorRes}`,
                });

                return of(errorRes);
              })
            )
        );
      })
    );
  });

  getCountryCodes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetCountryCodes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([featureData, authState]) => {
        return this.http
          .get<any>(
            `https://countriesnow.space/api/v0.1/countries/info?returns=flag,dialCode`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false) {
                return GeneralActions.SaveCountryCodes({
                  payload: resData.data,
                });
              } else {
                return GeneralActions.SaveCountryCodes({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Feature][CatchError] Failed To Get All Country codes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getFamilyGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetFamilyGroups),
      withLatestFrom(this.store.select('auth')),
      switchMap(() => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Utility/getfamilygroups`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false || resData.error === null) {
                return GeneralActions.SaveFamilyGroups({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveFamilyGroups({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[FamilyGroups][CatchError] Failed To Get All Family Groups ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getFamilyTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetFamilyTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(() => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Utility/getfamilymembertypes`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false || resData.error === null) {
                return GeneralActions.SaveFamilyTypes({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveFamilyTypes({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[FamilyTypes][CatchError] Failed To Get All Family Types ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getQuestionResponseType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetQuestionResponseType),
      withLatestFrom(this.store.select('auth')),
      switchMap(() => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Utility/getquestionresponsetypes`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false || resData.error === null) {
                return GeneralActions.SaveQuestionResponseType({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveQuestionResponseType({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[QuestionResponseType][CatchError] Failed To Get All Question Response Type ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getFeeType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetFeeType),
      withLatestFrom(this.store.select('auth')),
      switchMap(() => {
        return this.http
          .get<any>(`${environment.OptivaImmigrationUrl}/Utility/getfeetypes`)
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false || resData.error === null) {
                return GeneralActions.SaveFeeType({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveFeeType({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[FeeType][CatchError] Failed To Get All Fee Type ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getFeeBasis$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetFeeBases),
      withLatestFrom(this.store.select('auth')),
      switchMap(() => {
        return this.http
          .get<any>(`${environment.OptivaImmigrationUrl}/Utility/getfeebases`)
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.error === false || resData.error === null) {
                return GeneralActions.SaveFeeBases({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveFeeBases({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[FeeBasis][CatchError] Failed To Get All Fee Basis ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDeviceType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GeneralActions.GetAllDeviceType),
      withLatestFrom(this.store.select('auth')),
      switchMap(([generalData, authState]) => {
        return this.http
          .get<any>(`${environment.OptivaAuthUrl}/Utility/getdevicetype`)
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return GeneralActions.SaveAllDeviceType({
                  payload: resData.entity,
                });
              } else {
                return GeneralActions.SaveAllDeviceType({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[General][CatchError] Failed To Get Device Type ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
