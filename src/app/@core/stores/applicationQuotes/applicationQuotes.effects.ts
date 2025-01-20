import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as ApplicationQuotesAction from './applicationQuotes.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { ApplicationResponseSchema } from './applicationQuotes.actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DefaultPagination } from 'src/app/@core/enums/default-pagination.enum';

@Injectable()
export class ApplicationQuotesEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

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

  getAllApplicationQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationQuotesAction.GetAllApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<ApplicationResponseSchema[]>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/getapplicationquotes/${data.payload.skip}/${data.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicationQuotesAction.SaveAllApplicationQuotes({
                  payload: resData.entity,
                });
              } else {
                return ApplicationQuotesAction.SaveAllApplicationQuotes({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get All Application Quotes ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getApplicationQuoteById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationQuotesAction.GetApplicationQuoteById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<ApplicationResponseSchema>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/getapplicationquotebyid/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.SaveApplicationQuotesCreateResponse({
                    payload: resData?.entity,
                  })
                );

                return ApplicationQuotesAction.SaveApplicationQuoteById({
                  payload: resData.entity,
                });
              } else {
                return ApplicationQuotesAction.SaveApplicationQuoteById({
                  payload: null,
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get Application Quote By Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateApplicationQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.CreateApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        let applicationResponsesData = [];

        applicationResponsesData = data.payload.applicationResponses.map(
          (x) => {
            return {
              ...x,
              userId: authState.user.UserId,
            };
          }
        );
        const applicationData = { ...data.payload };
        applicationData.applicationResponses = applicationResponsesData;

        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/generateapplicationquote`,
            {
              ...applicationData,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.SuccessAction({ payload: true })
                );

                this.store.dispatch(
                  ApplicationQuotesAction.SaveApplicationQuotesCreateResponse({
                    payload: resData?.entity,
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

                if (resData?.entity) {
                  // window.location.href = `/app/calculator/quote/builder/${resData?.entity?.application?.applicantId}/edit/${resData?.entity?.id}`;
                  this.router.navigate([
                    `/app/calculator/quote/builder/${resData?.entity?.application?.applicantId}/edit/${resData?.entity?.id}`,
                  ]);
                }

                return {
                  type: '[ApplicationQuotes] Create Application Quotes Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ApplicationQuotesAction.IsLoading({ payload: false })
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
                  type: '[ApplicationQuotes] Failed To Create Application Quotes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Create Application Quotes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  UpdateApplicationQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.UpdateApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        let applicationResponsesData = [];

        applicationResponsesData = data.payload.applicationResponses.map(
          (x) => {
            return {
              ...x,
              userId: authState.user.UserId,
            };
          }
        );
        const applicationData = { ...data.payload };
        applicationData.applicationResponses = applicationResponsesData;

        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/updategenerateapplicationquote`,
            {
              ...applicationData,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.SuccessAction({ payload: true })
                );

                this.store.dispatch(
                  ApplicationQuotesAction.SaveApplicationQuotesCreateResponse({
                    payload: resData?.entity,
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
                  type: '[ApplicationQuotes] Update Application Quotes Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ApplicationQuotesAction.IsLoading({ payload: false })
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
                  type: '[ApplicationQuotes] Failed To Update Application Quotes',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Update Application Quotes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  createApplication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.CreateApplication),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Applications/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.SaveCreatedApplication({
                    payload: resData.entity,
                  })
                );

                return {
                  type: '[ApplicationQuotes] Create Application Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ApplicationQuotesAction.IsLoading({ payload: false })
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
                  type: '[ApplicationQuotes] Failed To Create Application',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Update Application Quotes ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  sendApplicationQuoteToEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.SendApplicationQuotesToEmail),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        this.store.dispatch(GeneralActions.IsLoading({ payload: true }));
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/sendapplicationquotetoemail`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Quote sent successfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[ApplicationQuotes] Sending Application Quote To Mail Was Succesfull',
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
                  type: '[ApplicationQuotes] Failed To Sending Application Quote To Mail',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Sending Application Quote To Mail ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deleteApplicationQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.DeleteApplicationQuote),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          userId: authState.user.UserId,
          id: data.payload.quoteId,
          actorEmail: authState.user.email,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/delete`,
            {
              body: deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  ApplicationQuotesAction.GetAllApplicationQuotes({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Application Quote Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[ApplicationQuotes] Delete Application Quote Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed to Delete Application Quote',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[ApplicationQuotes] Failed To Delete Application Quote',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Delete Application Quote ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  confirmApplicationQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.ConfirmApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/confirmapplicationquote`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                this.router.navigate([
                  `/app/calculator/quote/quote-invoice/${resData?.entity?.id}`,
                ]);

                return {
                  type: '[ApplicationQuotes] Confirm Application Was Succesfull',
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
                  type: '[ApplicationQuotes] Failed To Confirm Application Quote',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Confirm Application Quote ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getApplicationQuotesByApplicant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.GetAllApplicationQuotesByApplicantId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/getapplicationquotesbyapplicant/${authState.user.UserId}/${data.applicantId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded)
                return ApplicationQuotesAction.SaveApplicantsApplication({
                  payload: resData.entity,
                });
              else return of([]);
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Sending Application Quote To Mail ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateApplicationQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.ActivateApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/activateapplicationquote`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.GetAllApplicationQuotes({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
                );

                return {
                  type: '[ApplicationQuotes] Activate Application Was Successfull',
                };
              } else {
                this.store.dispatch(
                  ApplicationQuotesAction.GetAllApplicationQuotes({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
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
                  type: '[ApplicationQuotes] Failed To Activate Application',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.GetAllApplicationQuotes({
                  payload: {
                    skip: data.paginationData.skip,
                    take: data.paginationData.take,
                  },
                })
              );

              return this.handleCatchError(
                errorRes,
                '[ApplicationQuotes][CatchError] Failed To Activate Application Quote'
              );
            })
          );
      })
    );
  });

  deactivateApplicationQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.DeactivateApplicationQuotes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/deactivateapplication`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.GetAllApplicationQuotes({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
                );

                return {
                  type: '[ApplicationQuotes] Deactivate Application Was Successful',
                };
              } else {
                this.store.dispatch(
                  ApplicationQuotesAction.GetAllApplicationQuotes({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
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
                  type: '[ApplicationQuotes] Failed To Deactivate Application',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.GetAllApplicationQuotes({
                  payload: {
                    skip: data.paginationData.skip,
                    take: data.paginationData.take,
                  },
                })
              );

              return this.handleCatchError(
                errorRes,
                '[ApplicationQuotes][CatchError] Failed To Deactivate Application Quote'
              );
            })
          );
      })
    );
  });

  getApplicationQuotesAuthorization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationQuotesAction.GetApplicationQuotesAuthorizations),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<ApplicationResponseSchema[]>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/authorizations/${data.payload.skip}/${data.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicationQuotesAction.SaveApplicationQuotesAuthorizations(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return ApplicationQuotesAction.SaveApplicationQuotesAuthorizations(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get Application Quotes Authorization ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getApplicationQuotesAuthorizationSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationQuotesAction.GetApplicationQuotesAuthorizationsSummary),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<ApplicationResponseSchema[]>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/authorizations/summary/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                return ApplicationQuotesAction.SaveApplicationQuotesAuthorizationsSummary(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return ApplicationQuotesAction.SaveApplicationQuotesAuthorizationsSummary(
                  {
                    payload: null,
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.SaveApplicationQuotesAuthorizationsSummaryError(
                  { error: errorRes }
                )
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Get Application Quotes Authorization Summary ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  approveRejectRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicationQuotesAction.ApproveRejectRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ApplicationQuotes/authorization/decision`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ApplicationQuotesAction.GetApplicationQuotesAuthorizations({
                    payload: {
                      skip: data.payload.skip ?? DefaultPagination.skip,
                      take: data.payload.take ?? DefaultPagination.take,
                    },
                  })
                );

                this.store.dispatch(
                  ApplicationQuotesAction.GetApplicationQuotesAuthorizationsSummary()
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
                  type: '[ApplicationQuotes] Approve Reject Request Succesful',
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
                  type: '[ApplicationQuotes] Failed To Approve Reject Request',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicationQuotesAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Approve Reject Request ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
