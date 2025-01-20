import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as RolesActions from './roles.actions';
import * as UsersActions from '../users/users.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { DefaultPagination } from '../../enums/default-pagination.enum';
import { Router } from '@angular/router';

@Injectable()
export class RolesEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  getAllRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.GetAllRole),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Roles/getall/${authState.user.UserId}/${roleData.payload.skip}/${roleData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return RolesActions.SaveAllRole({
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
                return { type: '[Roles] Failed To Get All Role' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Get All Role ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllActiveRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.GetAllActiveRoles),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Roles/getactive/${authState.user.UserId}/${roleData.payload.skip}/${roleData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return RolesActions.SaveAllActiveRoles({
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
                return { type: '[Roles] Failed To Get All Active Roles' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Get All Active Roles ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  assignRoleAndDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.AssignRoleAndDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([rolesData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Roles/assignroleanddepartment`, {
            ...rolesData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

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
                  UsersActions.GetAllUsers({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Roles] Failed To Assign Role and Department',
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
                  type: '[Roles] Failed To Assign Role and Department',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Roles] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Assign Role and Department ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  createRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.CreateRoleAndPermission),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Roles/create`, {
            ...roleData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // Refetch All Feature List
                this.store.dispatch(
                  RolesActions.GetAllRoles({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );
                this.router.navigate(['/app/admin-settings/roles-permission']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate(['/app/admin-settings/roles-permission']);

                return {
                  type: '[Roles] Create Role Permission Was Succesful',
                };
              } else {
                this.store.dispatch(RolesActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Roles] Failed To Create Role Permission',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Create Role Permission ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editRoleAndPermission$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.EditRoleAndPermission),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Roles/update`, {
            ...roleData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // Refetch All Feature List
                this.store.dispatch(
                  RolesActions.GetAllRoles({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );
                this.store.dispatch(RolesActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                this.router.navigate(['/app/admin-settings/roles-permission']);

                return {
                  type: '[Roles] Update Role Permission Was Succesful',
                };
              } else {
                this.store.dispatch(RolesActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Roles] Failed To Update Role Permission',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Update Role Permission ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.GetAllRoles),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Roles/getall/${authState.user.UserId}/${roleData.payload.skip}/${roleData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return RolesActions.SaveAllRoles({
                  payload: resData.entity,
                });
              } else {
                return RolesActions.SaveAllRoles({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Role][CatchError] Failed To Get All Roles ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getRoleById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.GetRoleById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Roles/getbyid/${roleData.payload.id}/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return RolesActions.SaveGetRoleById({
                  payload: resData.entity,
                });
              } else {
                return RolesActions.SaveGetRoleById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Role][CatchError] Failed To Get All Role By ID ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getRolePermissionById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.GetRolePermissionById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([roleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Roles/getrolespermissionbyroleid/${roleData.payload.id}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return RolesActions.SvaeGetRolePermissionById({
                  payload: resData.entity,
                });
              } else {
                return RolesActions.SvaeGetRolePermissionById({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Role][CatchError] Failed To Get All Role By ID ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  changeRoleStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.ChangeRoleStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([rolesData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Roles/changerolestatus`, {
            ...rolesData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

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
                  RolesActions.GetAllRole({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                      searchValue: '',
                      filter: [],
                    },
                  })
                );

                return {
                  type: '[Roles] Change Role Status Was Successful',
                };
              } else {
                this.store.dispatch(RolesActions.IsLoading({ payload: false }));
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.store.dispatch(
                  RolesActions.GetAllRole({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                      searchValue: '',
                      filter: [],
                    },
                  })
                );

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Roles] Failed To Change Role Status',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(RolesActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Roles] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Chnage Role Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  // activate / deactivate Role Effect
  activateDeactivateRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.ActivateDeactivateRoles),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/Roles/activate`
            : `${environment.OptivaAuthUrl}/Roles/deactivate`;
        return this.http
          .post<any>(url, {
            roleId: id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  RolesActions.GetAllRole({
                    payload: {
                      skip: skip || 0,
                      take: take || 10,
                      searchValue: '',
                      filter: [],
                    },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Role Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Roles] Role Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Role',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Roles] Failed To ${action} Role`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To ${action} Role ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Role effect
  deleteRole$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RolesActions.DeleteRole),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          roleId: data.payload.id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Roles/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  RolesActions.GetAllRole({
                    payload: {
                      skip: skip || 0,
                      take: take || 10,
                      searchValue: '',
                      filter: [],
                    },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Role Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Roles] Role Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Role',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Roles] Failed To Delete Role',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Roles][CatchError] Failed To Delete Role ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
