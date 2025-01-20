import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as ApplicantsDashboardActions from './applicantDashboard.actions';

@Injectable()
export class ApplicantsDashboardEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient
  ) {}

  getApplicantsDashboardQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetApplicantsDashboardQuery),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getapplicantsdashboardquery/${data.payload.year}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveApplicantsDashboardQuery({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[ApplicantsDashboard] Failed To Get Applicants Dashboard',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicantsDashboard][CatchError] Failed To Get Applicants Dashboard ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getMainApplicantsDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetMainApplicantsDashboard),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getmaindashboardquery/${data.payload.year}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveMainApplicantsDashboard({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[ApplicantsDashboard] Failed To Get Main Applicants Dashboard',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicantsDashboard][CatchError] Failed To Get Main Applicants Dashboard ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getTopApplicants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetTopApplicants),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any[]>(
            `${environment.OptivaImmigrationUrl}/Applicants/gettopapplicantsbyquotes/${data.payload.skip}/${data.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveTopApplicants({
                  payload: resData.entity,
                });
              } else {
                return ApplicantsDashboardActions.SaveTopApplicants({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get All Application Quotes ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getApplicantsCountByCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetApplicantsCountByCountry),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getapplicantcountsbycountry/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveApplicantsCountByCountry({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[ApplicantsDashboard] Failed To Get Applicants Count By Country',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicantsDashboard][CatchError] Failed To Get Applicants Count By Country ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getTopCountryByApplicant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetTopCountryByApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any[]>(
            `${environment.OptivaImmigrationUrl}/Applicants/gettopcountriesbyapplicant/${data.payload.skip}/${data.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveTopCountryByApplicant({
                  payload: resData.entity,
                });
              } else {
                return ApplicantsDashboardActions.SaveTopCountryByApplicant({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get Country By Applicant ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getSingleApplicantsDashboardQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsDashboardActions.GetSingleApplicantsDashboardQuery),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getapplicantdashboardquery/${data.payload.applicantId}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsDashboardActions.SaveSingleApplicantsDashboardQuery(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return {
                  type: '[ApplicantsDashboard] Failed To Get Single Applicants Dashboard',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsDashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicantsDashboard][CatchError] Failed To Get Single Applicants Dashboard ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );
}
