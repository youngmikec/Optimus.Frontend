import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import * as GeneralLoaderActions from '../general/general.actions';
import * as DocumentSupportActions from './document-support.action';
import * as DocumentCollectionActions from '../document-collection/document-collection.actions';
import { DocumentSupportService } from './document.support.service';

@Injectable()
export class DocumentSupportEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private documentSupportService: DocumentSupportService
  ) {}

  hcmApproveDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentSupportActions.hcmApproveDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentSupportService
          .hcmApproveDocument(
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
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  DocumentCollectionActions.getDocumentFolderFiles({
                    folderId: data.folderId,
                  })
                );
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp?.message || resp?.messages?.[0],
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

  hcmRejectDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentSupportActions.hcmRejectDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentSupportService
          .hcmRejectDocument(
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
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  DocumentCollectionActions.getDocumentFolderFiles({
                    folderId: data.folderId,
                  })
                );
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp?.message || resp?.messages?.[0],
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
}
