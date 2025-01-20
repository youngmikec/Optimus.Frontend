import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import * as DocumentAuditActions from './document-audit.action';
import { DocumentAuditService } from './document.audit.service';
import * as GeneralLoaderActions from '../general/general.actions';

@Injectable()
export class DocumentAuditEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private documentAuditService: DocumentAuditService
  ) {}

  daoApproveDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentAuditActions.daoApproveDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentAuditService
          .daoApproveDocument(
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

  daoRejectDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentAuditActions.daoRejectDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentAuditService
          .daoRejectDocument(
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

  getPartners$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentAuditActions.getPartners),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentAuditService
          .getPartners(authState.user.UserId, data.skip, data.take)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return DocumentAuditActions.getPartnersSuccess({
                  partners: resp.entity?.pageItems,
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
              }

              return resp;
            }),
            catchError((error: any) => of(error))
          );
      })
    );
  });

  submitToHOD$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentAuditActions.submitToHOD),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.documentAuditService
          .submitToHOD(authState.user.UserId, data.applicationId)
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

  sendToPartners$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentAuditActions.sendToPartner),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload = {
          userId: authState.user.UserId,
          applicationId: data.applicationId,
          partnerDocuments: data.partnerDocuments,
        };

        return this.documentAuditService.sendToPartner(payload).pipe(
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
            } else {
              const notification: Notification = {
                state: 'error',
                message: resp?.message || resp?.messages[0],
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
