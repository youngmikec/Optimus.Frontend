import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { HttpClient } from '@angular/common/http';
import * as DashboardActions from './dashboard.actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from 'src/app/@core/enums/index.enum';
// import { Notification } from '../../interfaces/notification.interface';
// import { NotificationService } from '../../services/notification.service';
// import { Router } from '@angular/router';
@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient // private dialog: MatDialog, // private notificationService: NotificationService, // private router: Router
  ) {}

  getAllDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.GetAllSummary),
      withLatestFrom(this.store.select('auth')),
      switchMap(([dashboardData, authState]) => {
        return this.http
          .post(`${environment.OptivaImmigrationUrl}/Dashboard/summary`, {
            ...dashboardData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DashboardActions.SaveAllSummary({
                  payload: resData.entity,
                });
              } else {
                // this.store.dispatch(
                //   DashboardActions.SetNotification({
                //     payload: {
                //       isSuccess: false,
                //       message: resData.message || resData.messages[0],
                //     },
                //   })
                // );
                return { type: '[Dashboard] Failed To Get All Dashboard' };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Dashboards][CatchError] Failed To Get All Dashboards ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getApplicantsByGenderForDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.GetApplicantsByGenderForDashboard),
      withLatestFrom(this.store.select('auth')),
      switchMap(([dashboardData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaImmigrationUrl}/Dashboard/getapplicantsbygenderfordashboard`,
            {
              ...dashboardData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DashboardActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DashboardActions.SaveApplicantsByGenderForDashboard({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[Dashboard] Failed To Get Applicants By Gender For Dashboard',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DashboardActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Dashboards][CatchError] Failed To Get Applicants By Gender For Dashboard ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );
}
