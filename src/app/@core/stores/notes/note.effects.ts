import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as NoteActions from './notes.actions';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';

@Injectable()
export class NotesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getNotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NoteActions.loadNotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/note/getactivenotes/${authState.user.UserId}`
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return NoteActions.noteSuccess({ notes: resp.entity });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NoteActions.noteFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(NoteActions.noteFailure({ error: error.message }))
            )
          );
      })
    );
  });

  createNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NoteActions.createNotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/note/create`, {
            description: data.description,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resp) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                return NoteActions.loadNotes();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NoteActions.noteFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(NoteActions.noteFailure({ error: error.message }))
            )
          );
      })
    );
  });

  updateNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NoteActions.updateNotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/note/update`, {
            id: data.noteId,
            description: data.description,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resp) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                return NoteActions.loadNotes();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NoteActions.noteFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(NoteActions.noteFailure({ error: error.message }))
            )
          );
      })
    );
  });

  deleteNote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NoteActions.deleteNotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/note/deactivatenote`, {
            id: data.id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resp) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                return NoteActions.loadNotes();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NoteActions.noteFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(NoteActions.noteFailure({ error: error.message }))
            )
          );
      })
    );
  });
}
