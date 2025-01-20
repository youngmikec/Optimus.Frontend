import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { HttpClient } from '@angular/common/http';
import * as UserActions from './users.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';

import { catchError, map, of, share, switchMap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DefaultPagination } from 'src/app/@core/enums/index.enum';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.CreateUser),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Users/create`, {
            ...userData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              //console.log(resData, 'working');
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Users List
                this.store.dispatch(
                  UserActions.GetAllUsers({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                this.router.navigate(['/app/admin-settings/user-management']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate(['/app/admin-settings/user-management']);

                return {
                  type: '[User] Create User Was Successful',
                };
              } else {
                this.store.dispatch(UserActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[User] Failed To Create User',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[User][CatchError] Failed To Create User ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.GetAllUsers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Users/getallusers/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return UserActions.SaveAllUser({
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
                return { type: '[User] Failed To Get All User' };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Users][CatchError] Failed To Get All Users ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.GetActiveUsers),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Users/getactiverusersfilter/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return UserActions.SaveActiveUsers({
                  payload: resData.entity,
                });
              } else return { type: '[User] Failed To Get All Active User' };
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Users][CatchError] Failed To Get All Active Users ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.UpdateUser),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .put(`${environment.OptivaAuthUrl}/Users/update`, {
            ...userData.payload,
            loggedInUser: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All Users List
                this.store.dispatch(
                  UserActions.GetAllUsers({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                this.router.navigate(['/app/admin-settings/user-management']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  UserActions.GetAllUsers({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Users] Updated User Successfully',
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
                  type: '[Users] Failed To Update User',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Services] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[User][CatchError] Failed To Update User ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  updateUserProfilePicture$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.UpdateUserProfilePicture),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Users/updateprofilepicture`, {
            ...userData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  UserActions.GetUserById({
                    payload: {
                      userId: authState.user.UserId,
                      loggedInUser: authState.user.UserId,
                    },
                  })
                );
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Users] Updated User Profile Picture Successfully',
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
                  type: '[Users] Failed To Update User Profile Picture',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Services] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[User][CatchError] Failed To Update User Profile Picture ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  updateUserSignature$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.UpdateUserSignature),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Users/updatesignature`, {
            ...userData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  UserActions.GetUserById({
                    payload: {
                      userId: authState.user.UserId,
                      loggedInUser: authState.user.UserId,
                    },
                  })
                );
                this.dialog.closeAll();

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Users] Updated User Successfully',
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
                  type: '[Users] Failed To Update User Profile Picture',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Services] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[User][CatchError] Failed To Update User Profile Picture ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.GetUserById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get(
            `${environment.OptivaAuthUrl}/Users/getbyid/${authState.user.UserId}/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return UserActions.SaveUserById({
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
                return { type: '[User] Failed To Get User By ID' };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Users][CatchError] Failed To Get User by ID ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getUserByIdForEdit$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.GetUserByIdForEdit),
        withLatestFrom(this.store.select('auth')),
        switchMap(([userData, authState]) => {
          return this.http
            .get(
              `${environment.OptivaAuthUrl}/Users/getbyid/${userData.payload.userId}/${userData.payload.loggedInUser}`
            )
            .pipe(
              map((resData: any) => {
                this.store.dispatch(UserActions.IsLoading({ payload: false }));

                if (resData.succeeded === true) {
                  //
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
                    type: '[Users] Failed To Get User By Id For Effect',
                  };
                }

                return resData;
              }),
              catchError((errorRes) => {
                this.store.dispatch(UserActions.IsLoading({ payload: false }));

                this.store.dispatch({
                  type: `[Users][CatchError] Failed To Get User By Id For Effect ${errorRes.message}`,
                });

                return of();
              })
            );
        }),
        share()
      );
    },
    { dispatch: false }
  );

  changeUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.ChangeUserStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const url: string =
          userData.payload.status === 1
            ? `${environment.OptivaAuthUrl}/Users/deactivate`
            : `${environment.OptivaAuthUrl}/Users/activate`;
        return this.http
          .post(url, {
            userId: userData.payload.userId,
            loggedInUserId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                this.store.dispatch(
                  UserActions.GetAllUsers({
                    payload: {
                      skip: skip || DefaultPagination.skip,
                      take: take || DefaultPagination.take,
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
                  type: '[Users] Change User Status Was Succesful',
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
                  type: '[Users] Failed To Change User Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Users] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Users][CatchError] Failed To Change User Status ${errorRes.message}`,
              });
              return of();
            })
          );
      })
    )
  );

  //delete user effect
  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.DeleteUser),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          userId: data.payload.userId,
          loggedInUserId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Users/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  UserActions.GetAllUsers({
                    payload: {
                      skip: skip || DefaultPagination.skip,
                      take: take || DefaultPagination.take,
                    },
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
                  type: '[ApplicationQuotes] User Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete User',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[ApplicationQuotes] Failed To Delete User',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[ApplicationQuotes][CatchError] Failed To Delete User ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // createDepartment$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(UserActions.CreateUser),
  //     withLatestFrom(this.store.select('auth')),
  //     switchMap(([userData, authState]) => {
  //       return this.http
  //         .post<any>(`${environment.OptivaAuthUrl}/Department/create`, {
  //           ...userData.payload,
  //           userId: authState.user.UserId,
  //         })
  //         .pipe(
  //           map((resData) => {
  //             //console.log(resData, 'working');
  //             this.store.dispatch(UserActions.IsLoading({ payload: true }));

  //             if (resData.succeeded === true) {
  //               // Refetch All Users List
  //               this.store.dispatch(
  //                 UserActions.GetAllUsers({
  //                   payload: {
  //                     skip: 0,
  //                     take: 0,
  //                   },
  //                 })
  //               );

  //               this.router.navigate([
  //                 '/app/admin-settings/org-settings/department',
  //               ]);

  //               const notification: Notification = {
  //                 state: 'success',
  //                 message: resData.message || resData.messages[0],
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-success'
  //               );

  //               this.router.navigate([
  //                 '/app/admin-settings/org-settings/department',
  //               ]);

  //               return {
  //                 type: '[User] Create Department Was Succesful',
  //               };
  //             } else {
  //               this.store.dispatch(UserActions.IsLoading({ payload: false }));

  //               const notification: Notification = {
  //                 state: 'error',
  //                 message: resData.message || resData.messages[0],
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-error'
  //               );

  //               return {
  //                 type: '[User] Failed To Create Department',
  //               };
  //             }
  //           }),
  //           catchError((errorRes: any) => {
  //             this.store.dispatch(UserActions.IsLoading({ payload: false }));

  //             this.store.dispatch({
  //               type: `[User][CatchError] Failed To Create Department ${errorRes}`,
  //             });

  //             return of(errorRes);
  //           })
  //         );
  //     })
  //   );
  // });

  getAllDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.GetAllDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Department/getall/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              // console.log(resData, 'qwerty');
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return UserActions.SaveAllDepartment({
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
                return { type: '[Users] Failed To Get All Users' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Users][CatchError] Failed To Get All Users ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  changeDepartmentStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.ChangeDepartmentStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Department/updatestatus`, {
            ...userData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

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
                  UserActions.GetAllDepartment({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                      searchValue: '',
                      filter: [],
                    },
                  })
                );

                return {
                  type: '[User] Change Department Status Was Successful',
                };
              } else {
                this.store.dispatch(UserActions.IsLoading({ payload: false }));
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[User] Failed To Change Department Status',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(UserActions.IsLoading({ payload: false }));

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[User] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[User][CatchError] Failed To Chnage Department Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });
}
