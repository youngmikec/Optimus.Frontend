import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as PhaseActions from './phase.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { PhaseService } from './phase.service';

@Injectable()
export class PhaseEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private phaseService: PhaseService
  ) {}

  getPhases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PhaseActions.loadPhases),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.phaseService.getPhases(authState.user.UserId).pipe(
          map((resp: any) => {
            if (resp.succeeded)
              return PhaseActions.phaseSuccess({ phases: resp.entity });
            else {
              const notification: Notification = {
                state: 'error',
                message: resp.message || resp.messages[0],
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return PhaseActions.phaseFailure({
                error: resp.message ?? resp.messages[0],
              });
            }
          }),
          catchError((error: any) =>
            of(PhaseActions.phaseFailure({ error: error.message }))
          )
        );
      })
    );
  });

  getPhaseById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PhaseActions.getPhaseById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.phaseService
          .getPhaseById(authState.user.UserId, data.phaseId)
          .pipe(
            map((resp) => {
              if (resp.succeeded)
                return PhaseActions.singlePhase({ phase: resp.entity });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return PhaseActions.phaseFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(PhaseActions.phaseFailure({ error: error.message }))
            )
          );
      })
    );
  });

  updatePhase$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PhaseActions.updatePhase),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.phaseService.updatePhase(authState.user.UserId, data).pipe(
          map((resp) => {
            if (resp && resp.succeeded) {
              this.dialog.closeAll();
              const notification: Notification = {
                state: 'success',
                message: resp.message || 'Phase updated successfully',
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );
              return PhaseActions.loadPhases();
            } else {
              const notification: Notification = {
                state: 'error',
                message: resp.message || 'Phase update failed',
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return PhaseActions.phaseFailure({
                error: resp.message || resp.messages[0],
              });
            }
          }),
          catchError((error: any) => {
            return of(PhaseActions.phaseFailure({ error: error.message }));
          })
        );
      })
    );
  });
}
