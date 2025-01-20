import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as CommentsActions from './comments.actions';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';

@Injectable()
export class CommentsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentsActions.loadComments),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationComments/commentswithapplicationid/${authState.user.UserId}/${data.applicationId}`
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return CommentsActions.commentsSuccess({
                  comments: resp.entity,
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

                return CommentsActions.commentsFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(CommentsActions.commentsFailure({ error: error.message }))
            )
          );
      })
    );
  });

  createComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentsActions.createComment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { fromemail, applicationId, text, commentReferences } = data;

        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationComments/createcomment`,
            {
              text,
              fromemail,
              applicationId,
              userId: authState.user.UserId,
              commentReferences,
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

                return CommentsActions.loadComments({ applicationId });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return CommentsActions.commentsFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(CommentsActions.commentsFailure({ error: error.message }))
            )
          );
      })
    );
  });

  getReplies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentsActions.loadReplies),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/CommentReplies/replieswithcommentid/${authState.user.UserId}/${data.commentId}`
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return CommentsActions.repliesSuccess({
                  replies: resp.entity,
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

                return CommentsActions.commentsFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(CommentsActions.commentsFailure({ error: error.message }))
            )
          );
      })
    );
  });

  replyComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CommentsActions.replyComment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { fromemail, text, replyMailRecipients, commentId } = data;

        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/CommentReplies/createreply`,
            {
              text,
              fromemail,
              commentId,
              userId: authState.user.UserId,
              replyMailRecipients,
            }
          )
          .pipe(
            map((resp) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return CommentsActions.loadReplies({ commentId });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return CommentsActions.commentsFailure({
                  error: resp.message || resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(CommentsActions.commentsFailure({ error: error.message }))
            )
          );
      })
    );
  });
}
