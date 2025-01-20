import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import * as DocumentProcessingActions from './document-processing.action';
import { DocumentProcessingService } from './document.processing.service';
import * as DocumentCollectionActions from '../document-collection/document-collection.actions';
import * as GeneralLoaderActions from '../general/general.actions';

@Injectable()
export class DocumentProcessingEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private documentProcessingService: DocumentProcessingService
  ) {}

  getDocumentAnalytics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentProcessingActions.getDocumentAnalytics),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentProcessingService
          .getDocumentAnalytics(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded) {
                return DocumentProcessingActions.getDocumentAnalyticsSuccess({
                  analytics: resp.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
              }
              return resp;
            }),
            catchError((error: any) => of(error))
          );
      })
    );
  });

  cmaApproveDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentProcessingActions.cmaApproveDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentProcessingService
          .cmaApproveDocument(
            authState.user.UserId,
            data.documentId,
            data.applicationPhaseId
          )
          .pipe(
            map((resp: any) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return DocumentCollectionActions.getDocumentFolderFiles({
                  folderId: data.folderId,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
              }
              return resp;
            }),
            catchError((error: any) => of(error))
          );
      })
    );
  });

  cmaRejectDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentProcessingActions.cmaRejectDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentProcessingService
          .cmaRejectDocument(
            authState.user.UserId,
            data.documentId,
            data.applicationPhaseId
          )
          .pipe(
            map((resp: any) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return DocumentCollectionActions.getDocumentFolderFiles({
                  folderId: data.folderId,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
              }

              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );
              return resp;
            }),
            catchError((error: any) => of(error))
          );
      })
    );
  });
}
