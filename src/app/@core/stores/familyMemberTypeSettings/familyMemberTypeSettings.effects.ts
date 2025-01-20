import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as FamilyMembersTypeSettingsAction from './familyMemberTypeSettings.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class FamilyMemberTypeSettingsEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllFamilyMembersTypeSettingsByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        FamilyMembersTypeSettingsAction.GetAllFamilyMembersTypeSettingsByCountryId
      ),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberTypeSettingsData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMemberTypeSettings/getfamilymembertypesettingsbycountry/${authState.user.UserId}/${familyMemberTypeSettingsData.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return FamilyMembersTypeSettingsAction.SaveAllFamilyMembersTypeSettingsByCountryId(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return FamilyMembersTypeSettingsAction.SaveAllFamilyMembersTypeSettingsByCountryId(
                  {
                    payload: [],
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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

  CreateFamilyMemberTypeSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersTypeSettingsAction.CreateFamilyMemberTypeSettings),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMemberTypeSettings/create`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.GetAllFamilyMembersTypeSettingsByCountryId(
                    {
                      payload: { id: resData.entity.countryId },
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
                  type: '[FamilyMembers] Create Family Member Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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

  editFamilyMemberTypeSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersTypeSettingsAction.EditFamilyMemberTypeSettings),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMemberTypeSettings/update`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.GetAllFamilyMembersTypeSettingsByCountryId(
                    {
                      payload: { id: resData.entity.countryId },
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
                  type: '[FamilyMembers] Update Family Member Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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

  activateFamilyMemberTypeSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersTypeSettingsAction.ActivateFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMemberTypeSettings/activatefamilymembertypesetting`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.GetAllFamilyMembersTypeSettingsByCountryId(
                    {
                      payload: { id: resData.entity.countryId },
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
                  type: '[FamilyMembers] Family Member Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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

  deactivateFamilyMemberTypeSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FamilyMembersTypeSettingsAction.DeactivateFamilyMembers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([familyMemberData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/FamilyMemberTypeSettings/deactivatefamilymembertypesetting`,
            {
              ...familyMemberData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                FamilyMembersTypeSettingsAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.GetAllFamilyMembersTypeSettingsByCountryId(
                    {
                      payload: { id: resData.entity.countryId },
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
                  type: '[FamilyMembers] Family Member Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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
                FamilyMembersTypeSettingsAction.IsLoading({ payload: false })
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
}
