import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as DocumentConfigurationActions from './documentConfiguration.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { DocumentConfigurationService } from './document-configuration.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class DocumentConfigurationEffects {
  refreshToken: string;
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private docConfigService: DocumentConfigurationService,
    private http: HttpClient
  ) {
    const OptivaData = JSON.parse(localStorage.getItem('Optiva')!);
    this.refreshToken = OptivaData?.refreshToken;
  }

  private handleCatchError = (errorRes: any, type: string) => {
    this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

    const notification: Notification = {
      state: 'error',
      title: 'System Notification',
      message: `[Auth] ${errorRes.name}`,
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-error'
    );

    this.store.dispatch({
      type: type,
    });

    return of();
  };

  createDocumentConfigurationEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.CreateDocumentConfiguration),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.docConfigService
          .createDocumentConfiguration(authState.user.UserId, data.payload)
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Document Configuration List
                this.store.dispatch(
                  DocumentConfigurationActions.GetAllActiveDocumentConfigurations(
                    {
                      payload: {
                        skip: 0,
                        take: 0,
                      },
                    }
                  )
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Document Configuration] Create Document Configuration Was Successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Document Configuration] Failed To Create Document Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Create Document Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editDocumentConfigurationEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.EditDocumentConfiguration),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        return this.docConfigService
          .updateDocumentConfiguration(
            authState.user.UserId,
            documentData.payload
          )
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Document Configuration List
                this.store.dispatch(
                  DocumentConfigurationActions.GetAllActiveDocumentConfigurations(
                    {
                      payload: {
                        skip: 0,
                        take: 0,
                      },
                    }
                  )
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Document Configuration] Edit Document Configuration Was Successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Document Configuration] Failed To Edit Document Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Edit Document Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDocumentConfigurations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.GetAllDocumentConfigurations),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        const { skip, take } = documentData.payload;
        return this.docConfigService
          .getAllDocumentConfiguration(authState.user.UserId, { skip, take })
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                return DocumentConfigurationActions.SaveAllDocumentConfigurations(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return DocumentConfigurationActions.SaveAllDocumentConfigurations(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              return this.handleCatchError(
                errorRes,
                '[Document Configuration][CatchError] Failed To Activate Document Configurations'
              );
            })
          );
      })
    );
  });

  getAllActiveDocumentConfigurations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.GetAllActiveDocumentConfigurations),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        const { skip, take } = documentData.payload;
        return this.docConfigService
          .getAllActiveDocumentConfiguration(authState.user.UserId, {
            skip,
            take,
          })
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                return DocumentConfigurationActions.SaveAllActiveDocumentConfigurations(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return DocumentConfigurationActions.SaveAllActiveDocumentConfigurations(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              return this.handleCatchError(
                errorRes,
                '[Document Configuration][CatchError] Failed To Fetch All Active Document Configurations'
              );
            })
          );
      })
    );
  });

  getDocumentConfigurationById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.GetDocumentConfigurationById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        return this.docConfigService
          .getDocumentConfigurationById(
            authState.user.UserId,
            documentData.payload.documentConfigurationId
          )
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                return DocumentConfigurationActions.SaveDocumentConfigurationById(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return {
                  type: '[Document Configuration] Failed To Get Document Configuration By Id',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Get Document's Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateDocumentConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.ActivateDocumentConfiguration),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaImmigrationUrl}/DocumentConfiguration/activatedocumentconfiguration`,
            {
              id: documentData.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DocumentConfigurationActions.GetAllDocumentConfigurations({
                    payload: {
                      skip: documentData.paginationData.skip,
                      take: documentData.paginationData.take,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Document Configuration] Activate Document Configuration Successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return {
                  type: '[Document Configuration] Failed To Activate Document Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Get Document's Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateDocumentConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.DeactivateDocumentConfiguration),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaImmigrationUrl}/DocumentConfiguration/deactivatedocumentconfiguration`,
            {
              id: documentData.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DocumentConfigurationActions.GetAllDocumentConfigurations({
                    payload: {
                      skip: documentData.paginationData.skip,
                      take: documentData.paginationData.take,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Document Configuration] Deactivate Document Configuration Successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return {
                  type: '[Document Configuration] Failed to Deactivate Document Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Get Document's Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deleteDocumentConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentConfigurationActions.DeleteDocumentConfiguration),
      withLatestFrom(this.store.select('auth')),
      switchMap(([documentData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaImmigrationUrl}/DocumentConfiguration/deletetedocumentconfiguration`,
            {
              id: documentData.payload.id,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );
                this.store.dispatch(
                  DocumentConfigurationActions.GetAllDocumentConfigurations({
                    payload: {
                      skip: documentData.paginationData.skip,
                      take: documentData.paginationData.take,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Document Configuration] Delete Document Configuration Successful',
                };
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return {
                  type: '[Document Configuration] Failed to Delete Document Configuration',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.store.dispatch({
                type: `[Document Configuration][CatchError] Failed To Get Document's Configuration ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
