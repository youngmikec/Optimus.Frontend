import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import * as fromApp from '../app.reducer';
import * as ApplicantsActions from '../applicants/applicants.actions';
import * as GeneralActions from '../general/general.actions';
import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class ApplicantsEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllapplicant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsActions.GetAllApplicants),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getapplicants/${data.payload.skip}/${data.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              // console.log(resData, 'qwerty');
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsActions.SaveAllApplicants({
                  payload: resData.entity,
                });
              } else {
                // this.store.dispatch(
                //   UserActions.SetNotification({
                //     payload: {
                //       isSuccess: false,
                //       message: resData.message || resData.messages[0],
                //     },
                //   })
                // );
                return { type: '[Applicants] Failed To Get All Applicants' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Applicants][CatchError] Failed To Get All Applicants ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getSingleApplicant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicantsActions.GetSingleApplicants),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/getapplicantbyid/${authState.user.UserId}/${userData.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ApplicantsActions.SaveSingleApplicants({
                  payload: resData.entity,
                });
              } else {
                return ApplicantsActions.SaveSingleApplicants({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Applicants][CatchError] Failed To Get Single Applicants ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createapplicant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicantsActions.CreateApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([applicantData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Applicants/create`, {
            ...applicantData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  ApplicantsActions.SaveCreatedApplicant({
                    payload: resData.entity,
                  })
                );
                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: 0,
                      take: 10,
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
                  type: '[Applicant] Create Applicant Was Succesful',
                };
              } else {
                this.store.dispatch(
                  ApplicantsActions.IsLoading({ payload: false })
                );
                this.store.dispatch(
                  ApplicantsActions.SaveCreatedApplicant({
                    payload: null,
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
                  type: '[Applicant] Failed To Create Applicant',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              // const notification: Notification = {
              //   state: 'error',
              //   title: 'System Notification',
              //   message: `[Applicants] ${errorRes.name}`,
              // };

              // this.notificationService.openSnackBar(
              //   notification,
              //   'opt-notification-error'
              // );

              this.store.dispatch({
                type: `[Applicant][CatchError] Failed To Create Applicant ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateapplicant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicantsActions.UpdateApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([applicantData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Applicants/update`, {
            ...applicantData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: 0,
                      take: 10,
                    },
                  })
                );

                return {
                  type: '[Applicants] Update Applicant Was Succesful',
                };
              } else {
                this.store.dispatch(
                  ApplicantsActions.IsLoading({ payload: false })
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
                  type: '[applicant] Failed To Update Applicant',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[applicant] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[applicant][CatchError] Failed To Update Applicant ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  activateApplicant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicantsActions.ActivateApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([applicantData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/activateapplicant`,
            {
              userId: authState.user.UserId,
              id: applicantData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
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

                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: applicantData.paginationData.skip,
                      take: applicantData.paginationData.take,
                    },
                  })
                );

                return {
                  type: '[Applicants] Applicant Was Succesfully Activated',
                };
              } else {
                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: applicantData.paginationData.skip,
                      take: applicantData.paginationData.take,
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
                  type: '[Applicants] Failed To Activate Applicant',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Applicants] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[applicant][CatchError] Failed To Activate Applicant ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  deactivateApplicant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicantsActions.DeactivateApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([applicantData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/deactivateapplicant`,
            {
              userId: authState.user.UserId,
              id: applicantData.payload.id,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
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

                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: applicantData.paginationData.skip,
                      take: applicantData.paginationData.take,
                    },
                  })
                );

                return {
                  type: '[Applicants] Applicant Was Succesfully Deactivated',
                };
              } else {
                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: applicantData.paginationData.skip,
                      take: applicantData.paginationData.take,
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
                  type: '[Applicants] Failed To Deactivate Applicant',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ApplicantsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Applicants] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[applicant][CatchError] Failed To Deactivate Applicant ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  //delete user effect
  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApplicantsActions.DeleteApplicant),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          id: data.payload.id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Applicants/deleteapplicant`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  ApplicantsActions.GetAllApplicants({
                    payload: {
                      skip: skip || DefaultPagination.skip,
                      take: take || DefaultPagination.take,
                    },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Applicant Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Applicants] Delete Applicant Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Applicant',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Applicants] Failed To Delete Applicant',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Applicants][CatchError] Failed To Delete Applicant ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
