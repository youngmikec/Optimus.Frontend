import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
// import * as CountriesAction from './countries.actions';
import * as FamilyMembersAction from './familyMembers.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { FamilyMembersService } from './family-members.service';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class FamilyMembersEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private familyMembersService: FamilyMembersService
  ) {}

  getAllFamilyMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersAction.GetAllFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/getfamilymembers/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FamilyMembersAction.SaveAllFamilyMembers({
                  payload: resData.entity,
                });
              } else {
                return FamilyMembersAction.SaveAllFamilyMembers({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Get Family Members ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllFamilyMembersByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersAction.GetAllFamilyMembersByCountryId),
      switchMap((familyMemberData) => {
        const countryId = familyMemberData.payload.id;
        return this.familyMembersService
          .GetAllFamilyMembersByCountryId(countryId)
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FamilyMembersAction.SaveAllFamilyMembersByCountryId({
                  payload: resData.entity,
                });
              } else {
                return FamilyMembersAction.SaveAllFamilyMembersByCountryId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Get Family Members ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveFamilyMembersByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FamilyMembersAction.GetActiveFamilyMembersByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        // familyMemberData
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/getactivefamilymembers/${authState.user.UserId}/${familyMemberData.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FamilyMembersAction.SaveActiveFamilyMembers({
                  payload: resData.entity,
                });
              } else {
                return FamilyMembersAction.SaveActiveFamilyMembers({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Get Family Members ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateFamilyMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.CreateFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/create`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  FamilyMembersAction.GetAllFamilyMembersByCountryId({
                    payload: { id: familyMemberData.payload.countryId },
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
                  type: '[FamilyMembers] Create Family Member Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersAction.IsLoading({ payload: false })
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
                  type: '[FamilyMembers] Failed To Create Family Member',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Create Family Member ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editFamilyMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.EditFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/update`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  FamilyMembersAction.GetAllFamilyMembersByCountryId({
                    payload: { id: familyMemberData.payload.countryId },
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
                  type: '[FamilyMembers] Update Family Member Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersAction.IsLoading({ payload: false })
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
                  type: '[FamilyMembers] Failed To Update Family Member',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Update Family Member ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateFamilyMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.ActivateFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/activatefamilymember`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  FamilyMembersAction.GetAllFamilyMembersByCountryId({
                    payload: { id: familyMemberData.payload.countryId },
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
                  type: '[FamilyMembers] Family Member Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersAction.IsLoading({ payload: false })
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
                  type: '[FamilyMembers] Failed To Activate Family Member',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Activate Family Member ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateFamilyMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.DeactivateFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/deactivatefamilymember`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  FamilyMembersAction.GetAllFamilyMembersByCountryId({
                    payload: { id: familyMemberData.payload.countryId },
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
                  type: '[FamilyMembers] Family Member Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersAction.IsLoading({ payload: false })
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
                  type: '[FamilyMembers] Failed To Deactivate Family Member',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Deactivate Family Member ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // delete family member;
  deleteFamilyMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.DeleteFamilyMember),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        const deletePayload = {
          id: familyMemberData.payload.id,
          userId: authState.user.UserId,
          actorEmail: authState.user.email,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMembers/delete`,
            {
              body: deletePayload,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  FamilyMembersAction.GetAllFamilyMembersByCountryId({
                    payload: { id: familyMemberData.payload.countryId },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: 'Family Member Deleted Succesfully',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[FamilyMembers] Family Member Deleted Succesfully',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersAction.IsLoading({ payload: false })
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
                  type: '[FamilyMembers] Failed To Delete Family Member',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To Delete Family Member ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getApplicationsFamilyMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersAction.getFamilyMembersByApplicationId),
      switchMap((data) => {
        return this.familyMembersService
          .getFamilyMembersByApplicationId(data.applicationId)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return FamilyMembersAction.getFamilyMembersByApplicationSuccess(
                  {
                    familyMembers: resp.entity,
                  }
                );
              else {
                return {
                  type: '[FamilyMembers] Failed To Get Family Member By Application',
                };
              }
            }),
            catchError((error: any) => {
              this.store.dispatch({
                type: `[FamilyMembers][CatchError] Failed To get Family Member ${error.message}`,
              });

              return of(error.message);
            })
          );
      })
    );
  });
}
