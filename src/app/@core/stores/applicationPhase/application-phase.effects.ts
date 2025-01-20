import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  finalize,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as ApplicationPhaseActions from './application-phase.actions';
import * as GeneralLoaderActions from '../general/general.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { ApplicationPhaseService } from './application-phase.service';

@Injectable()
export class ApplicationPhaseEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private applicationPhaseService: ApplicationPhaseService
  ) {}

  getApplicationPhases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.loadApplicationPhases),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .getApplicationPhaseByApplicationId(
            authState.user.UserId,
            data.applicationId
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return ApplicationPhaseActions.applicationPhaseSuccess({
                  applicationPhases: resp.entity,
                });
              else {
                return ApplicationPhaseActions.applicationPhaseError({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) => {
              // const notification: Notification = {
              //   state: 'error',
              //   message: error.message,
              // };
              // this.notificationService.openSnackBar(
              //   notification,
              //   'opt-notification-error'
              // );
              return of(error);
            }),
            finalize(() =>
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              )
            )
          );
      })
    );
  });

  updateApplicationPhase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.updateApplicationPhase),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload = {
          userId: authState.user.UserId,
          id: data.applicationPhaseId,
          subPhase: data.subPhase,
          description: data.description,
          serialNo: data.serialNo,
        };

        return this.applicationPhaseService
          .updateApplicationPhase(payload)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return resp;
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });

  startApplicationPhases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.startApplicationPhase),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .startApplicationPhase(authState.user.UserId, data.id)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return of(resp.message || resp.messages[0]);
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });

  completeApplicationPhases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.completeApplicationPhase),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .completeAppplicationPhase(authState.user.UserId, data.id)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return resp;
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });

  createCallApplicantTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.callApplicantTask),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .createCallApplicantTask(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message:
                    resp?.message ||
                    resp?.messages?.[0] ||
                    'Task created successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return resp;
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error?.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });

  assignSMOfficer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.assignSMOfficer),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .assignSMOfficer(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message:
                    resp?.message ||
                    resp?.messages?.[0] ||
                    'SM assigned successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return resp;
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error?.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });

  assignOtherOfficer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationPhaseActions.assignOtherOfficer),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.applicationPhaseService
          .assignOtherOfficer(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp?.message || resp?.messages?.[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return ApplicationPhaseActions.loadApplicationPhases({
                  applicationId: data.applicationId,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return resp;
              }
            }),
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error?.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of(error);
            })
          );
      })
    );
  });
}
