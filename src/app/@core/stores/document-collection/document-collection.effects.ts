import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  concatMap,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as DocumentCollectionActions from './document-collection.actions';
import * as GeneralLoaderActions from '../general/general.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { DocumentCollectionService } from './document-collection.service';
import { isArray } from 'highcharts';

@Injectable()
export class DocumentCollectionEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private docCollectionService: DocumentCollectionService
  ) {}

  getApplicationResponse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getApplicationResponse),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .getApplicationResponse(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded)
                return DocumentCollectionActions.getApplicationResponseSuccess({
                  applicationResponse: resp.entity,
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
                return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  getDocumentQuestionWithFamilyType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentQuestionWithFamilyType),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const params = {
          userId: authState.user.UserId,
          countryId: data.countryId,
          migrationRouteId: data.migrationRouteId,
        };
        return this.docCollectionService
          .getDocumentQuestionWithFamilyType(params)
          .pipe(
            map((resp: any) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded)
                return DocumentCollectionActions.getDocumentQuestionWithFamilyTypeSuccess(
                  { documentQuestionsWithFamily: resp.entity }
                );
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  getDocumentParameters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentParameters),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .getDocumentParameters(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp: any) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded)
                return DocumentCollectionActions.getDocumentParametersSuccess({
                  documentParameters: resp.entity,
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
                return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  getDocumentFolderFiles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentFolderFiles),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const params = {
          userId: authState.user.UserId,
          folderId: data.folderId,
        };
        return this.docCollectionService.getDocumentFolderFiles(params).pipe(
          map((resp: any) => {
            this.store.dispatch(
              GeneralLoaderActions.IsLoading({ payload: false })
            );

            if (resp.succeeded)
              return DocumentCollectionActions.getDocumentFolderFilesSuccess({
                files: !isArray(resp.entity) ? [resp.entity] : resp.entity,
              });
            else {
              return DocumentCollectionActions.getDocumentFolderFilesSuccess({
                files: [],
              });
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

            return of(error.message);
          })
        );
      })
    );
  });

  uploadFamilyMemberDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.uploadFamilyMemberDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const formData = new FormData();
        formData.append('userId', authState.user.UserId);
        formData.append('folderId', data.folderId.toString());
        formData.append('document', data.document);

        return this.docCollectionService
          .uploadFamilyMemberDocument(formData)
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
                return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  replaceFamilyMemberDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.replaceFamilyMemberDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const formData = new FormData();
        formData.append('userId', authState.user.UserId);
        formData.append('folderId', data.folderId.toString());
        formData.append('documentId', data.documentId.toString());
        formData.append('document', data.document);

        return this.docCollectionService
          .replaceFamilyMemberDocument(formData)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Document replaced successfully',
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
                  message: resp?.message || resp?.messages?.[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  createApplicationFamilyMemberDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.saveApplicationFamilyMemberDetails),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .saveApplicationFamilyMemberDetails({
            userId: authState.user.UserId,
            ...data.payload,
          })
          .pipe(
            map((resp) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message:
                    resp?.message ??
                    resp?.messages?.[0] ??
                    'Family member details created successfully',
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return DocumentCollectionActions.isFamilyMemberDetailsCreated({
                  isCreated: true,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message,
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
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

              return of({ error: error.message });
            })
          );
      })
    );
  });

  createDocumentParameter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.submitDocumentParameters),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .submitDocumentParameters({
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            concatMap((resp) => {
              this.store.dispatch(
                GeneralLoaderActions.IsLoading({ payload: false })
              );

              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp.message ?? resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return [
                  DocumentCollectionActions.setDocumentFolders({
                    folders: resp.entity,
                  }),
                  DocumentCollectionActions.isDocumentParametersCreated({
                    isCreated: true,
                  }),
                ];
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message ?? resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return of(resp);
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
              return of({ error: error.message });
            })
          );
      })
    );
  });

  saveDocumentParameter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.saveDocumentParameters),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .saveDocumentParameters({
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resp) => {
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
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of({ error: error.message });
            })
          );
      })
    );
  });

  completeDocumentCollation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.completeDocumentCollation),
      switchMap((data) => {
        return this.docCollectionService
          .completeDocumentCollation(data.applicationId, data.documentId)
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

              return of([]);
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

              return of(error.message);
            })
          );
      })
    );
  });

  getDocumentComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentComments),
      switchMap((data) => {
        return this.docCollectionService
          .getDocumentComments(data.documentId)
          .pipe(
            map((resp) => {
              if (resp.succeeded)
                return DocumentCollectionActions.getDocumentCommentsSuccess({
                  documentComments: resp.entity,
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
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of({ error: error.message });
            })
          );
      })
    );
  });

  createDocumentComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.createDocumentComment),
      switchMap((data) => {
        return this.docCollectionService
          .createDocumentComments(data.documentId, data.comment)
          .pipe(
            map((resp) => {
              if (resp.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resp?.message ?? 'Comment created successfully',
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return DocumentCollectionActions.getDocumentComments({
                  documentId: data.documentId,
                });
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
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of({ error: error.message });
            })
          );
      })
    );
  });

  getDocumentVersionHistory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentVersionHistory),
      switchMap((data) => {
        return this.docCollectionService
          .getDocumentVersionHistory(data.documentId)
          .pipe(
            map((resp) => {
              if (resp.succeeded)
                return DocumentCollectionActions.getDocumentVersionHistorySuccess(
                  { documentVersionHistory: resp.entity }
                );
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
            catchError((error: any) => {
              const notification: Notification = {
                state: 'error',
                message: error.message,
              };
              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return of({ error: error.message });
            })
          );
      })
    );
  });

  getDocumentOfficers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentCollectionActions.getDocumentOfficers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docCollectionService
          .getDocumentOfficers(authState.user.UserId, data.applicationId)
          .pipe(
            map((resp) => {
              if (resp.succeeded)
                return DocumentCollectionActions.getDocumentOfficersSuccess({
                  officers: resp.entity,
                });
              else {
                // const notification: Notification = {
                //   state: 'error',
                //   message: resp.message ?? resp.messages[0],
                // };
                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-error'
                // );

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
              return of({ error: error.message });
            })
          );
      })
    );
  });
}
