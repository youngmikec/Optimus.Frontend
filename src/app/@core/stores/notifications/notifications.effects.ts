import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as NotificationActions from './notifications.action';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';

@Injectable()
export class NotificationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationActions.GetAllNotifications),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        // const { skip, take, status, notificationType } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Notifications/all/${authState.user.UserId}`
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return NotificationActions.SaveGetAllNotifications({
                  payload: {
                    data: resp.entity,
                  },
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
                return NotificationActions.NotificationsFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(
                NotificationActions.NotificationsFailure({
                  error: error.message,
                })
              )
            )
          );
      })
    );
  });

  // Read all notifications
  readAllNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationActions.ReadAllNotifications),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { notificationIds } = data.payload;
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/Notifications/readAll/`,
            {
              notificationIds,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return NotificationActions.GetAllNotifications();
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NotificationActions.NotificationsFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(
                NotificationActions.NotificationsFailure({
                  error: error.message,
                })
              )
            )
          );
      })
    );
  });

  getMessageNotificationTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationActions.GetNotificationTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { status, id, messageNotificationType } = data.payload;
        return this.http
          .get<any>(
            `${
              environment.OptivaImmigrationUrl
            }/NotificationMessageTemplate/notificationtype/${
              authState.user.UserId
            }
            ${status ? `?status=${status}` : ''}
            ${status && id ? `&id=${id}` : !status && id ? `?id=${id}` : ''}
            ${
              status && messageNotificationType
                ? `&messageNotificationType=${messageNotificationType}`
                : !status && messageNotificationType
                ? `?messageNotificationType=${messageNotificationType}`
                : ''
            }
            `
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return NotificationActions.SaveGetNotificationTypes({
                  payload: {
                    data: resp.entity,
                  },
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
                return NotificationActions.NotificationsTypesFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(
                NotificationActions.NotificationsTypesFailure({
                  error: error.message,
                })
              )
            )
          );
      })
    );
  });

  //   createNote$ = createEffect(() => {
  //     return this.actions$.pipe(
  //       ofType(NoteActions.createNotes),
  //       withLatestFrom(this.store.select('auth')),
  //       switchMap(([data, authState]) => {
  //         return this.http
  //           .post<any>(`${environment.OptivaAfterSalesUrl}/note/create`, {
  //             description: data.description,
  //             userId: authState.user.UserId,
  //           })
  //           .pipe(
  //             map((resp) => {
  //               if (resp.succeeded) {
  //                 const notification: Notification = {
  //                   state: 'success',
  //                   message: resp.message || resp.messages[0],
  //                 };
  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-success'
  //                 );
  //                 return NoteActions.loadNotes();
  //               } else {
  //                 const notification: Notification = {
  //                   state: 'error',
  //                   message: resp.message || resp.messages[0],
  //                 };
  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-error'
  //                 );
  //                 return NoteActions.noteFailure({
  //                   error: resp.message || resp.messages[0],
  //                 });
  //               }
  //             }),
  //             catchError((error: any) =>
  //               of(NoteActions.noteFailure({ error: error.message }))
  //             )
  //           );
  //       })
  //     );
  //   });

  //   updateNote$ = createEffect(() => {
  //     return this.actions$.pipe(
  //       ofType(NoteActions.updateNotes),
  //       withLatestFrom(this.store.select('auth')),
  //       switchMap(([data, authState]) => {
  //         return this.http
  //           .post<any>(`${environment.OptivaAfterSalesUrl}/note/update`, {
  //             id: data.noteId,
  //             description: data.description,
  //             userId: authState.user.UserId,
  //           })
  //           .pipe(
  //             map((resp) => {
  //               if (resp.succeeded) {
  //                 const notification: Notification = {
  //                   state: 'success',
  //                   message: resp.message || resp.messages[0],
  //                 };
  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-success'
  //                 );
  //                 return NoteActions.loadNotes();
  //               } else {
  //                 const notification: Notification = {
  //                   state: 'error',
  //                   message: resp.message || resp.messages[0],
  //                 };
  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-error'
  //                 );
  //                 return NoteActions.noteFailure({
  //                   error: resp.message || resp.messages[0],
  //                 });
  //               }
  //             }),
  //             catchError((error: any) =>
  //               of(NoteActions.noteFailure({ error: error.message }))
  //             )
  //           );
  //       })
  //     );
  //   });

  deleteNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationActions.deleteNotification),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/NotificationMessageTemplate/delete`,
            {
              body: {
                id: data.id,
                userId: authState.user.UserId,
              },
            }
          )
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
                return NotificationActions.GetAllNotifications();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return NotificationActions.NotificationsFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(
                NotificationActions.NotificationsFailure({
                  error: error.message,
                })
              )
            )
          );
      })
    );
  });
}
