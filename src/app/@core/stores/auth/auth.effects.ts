import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, share, switchMap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { MatDialog } from '@angular/material/dialog';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private authService: AuthService,
    private permissionService: PermissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  private handleCatchError = (errorRes: any, type: string) => {
    this.store.dispatch(AuthActions.IsLoading({ payload: false }));

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

  public parseJwt = (userToken: any) => {
    const base64Url = userToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  };

  initializeApp_DeveloperToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.InitializeApp_DeveloperToken),
      switchMap((authData) => {
        /**************If the Optiva_auth does not exist in localStorage or has expired**************/
        const OptivaAuthData: {
          bearer_token: string;
          expiryDate: number;
        } = JSON.parse(localStorage.getItem('Optiva_auth')!);

        if (
          OptivaAuthData === null ||
          OptivaAuthData.expiryDate < new Date().getTime()
        ) {
          return this.http
            .post<any>(
              `${environment.OptivaAuthUrl}/ApplicationAuth/login`,
              environment.OptivaDeveloperLoginCredentials
            )
            .pipe(
              map((resData) => {
                if (resData.isSuccess === true) {
                  const bearer_token = resData.token.accessToken;

                  const expiryDate =
                    resData.token.expiresIn * 60000 + new Date().getTime();

                  localStorage.setItem(
                    'Optiva_auth',
                    JSON.stringify({
                      bearer_token: bearer_token,
                      expiryDate: expiryDate,
                    })
                  );

                  this.store.dispatch(
                    AuthActions.UpdateDeveloperTokenStatus({
                      payload: { status: true },
                    })
                  );

                  return {
                    type: '[Auth] Successfully Received Developer Token',
                  };
                } else {
                  this.store.dispatch(
                    AuthActions.IsLoading({ payload: false })
                  );

                  return {
                    type: '[Auth] Failed To Receive Developer Token',
                  };
                }
              }),
              catchError((errorRes) => {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                this.store.dispatch({
                  type: `[Auth][CatchError] Failed To Receive Developer Token ${errorRes.message}`,
                });

                return of();
              })
            );
        } else {
          /*************************If the Optiva_auth exists in localStorage*************************/

          /****If the Optiva_auth exists in localStorage and the token has not expired****/
          if (OptivaAuthData.expiryDate > new Date().getTime()) {
            this.store.dispatch(
              AuthActions.UpdateDeveloperTokenStatus({
                payload: {
                  status: true,
                },
              })
            );

            return of({
              type: '[Auth] Developer token still exists in localStorage',
            });
          } else {
            /****If the Optiva_auth exists in localStorage but the token has expired****/
            this.store.dispatch(
              AuthActions.UpdateDeveloperTokenStatus({
                payload: { status: false },
              })
            );

            return of({
              type: '[Auth] Developer token has expired',
            });
          }
        }
      })
    );
  });

  initializeApp_AccessToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.InitializeApp_AccessToken),
      switchMap((authData) => {
        /****If Optiva does not exist in localStorage****/
        if (localStorage.getItem('Optiva') === null) {
          return of({
            type: '[Auth] Access token does not exist in localStorage',
          });
        } else {
          /*************************If Optiva exists in localStorage*************************/
          const optivaData: {
            accessToken: string;
            userToken: string;
            exp: number;
          } = JSON.parse(localStorage.getItem('Optiva')!);

          const optivaAuthData: {
            bearer_token: string;
            expiryDate: number;
          } = JSON.parse(localStorage.getItem('Optiva_auth')!);

          /****If Optiva exists in localStorage but the token has expired****/
          if (optivaData.exp < new Date().getTime()) {
            if (optivaData) {
              localStorage.removeItem('Optiva');
            }

            if (optivaAuthData) {
              localStorage.removeItem('Optiva_auth');
            }

            return of({
              type: '[Auth] Access token has expired and has been removed from localStorage',
            });
          } else {
            /****If the Optiva exists in localStorage and the token has not expired****/
            this.store.dispatch(
              AuthActions.UpdateAccessTokenStatus({
                payload: { status: true },
              })
            );

            return of({
              type: '[Auth] Access token still exists in localStorage',
            });
          }
        }
      })
    );
  });

  authLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LoginStart),
      switchMap((authData) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Authentication/login`, {
            email: authData.payload.email,
            password: authData.payload.password,
            deviceType: 1,
          })
          .pipe(
            map((resData: any) => {
              if (resData.isSuccess === true) {
                const accessToken = resData.token.accessToken;
                const userToken = resData.token.userToken;
                const exp =
                  resData.token.expiresIn * 60000 + new Date().getTime();
                const refreshToken = resData.token.refreshToken;
                const data = { accessToken, userToken, exp, refreshToken };

                localStorage.setItem('Optiva', JSON.stringify(data));

                const decoded_token = this.parseJwt(userToken);

                //console.log(decoded_token, 'decoded');

                const user: any = JSON.parse(decoded_token.UserEntity);

                const permissionsArray: any[] = [];

                if (decoded_token.Permissions) {
                  const allPermissions: any[] = JSON.parse(
                    decoded_token.Permissions
                  );

                  //console.log(allPermissions, 'allperm');

                  allPermissions.forEach((el) => {
                    if (el.Status === 1) {
                      permissionsArray.push(el.Name);
                      //console.log(el.Name, 'permisii');
                    }
                  });
                }
                // if (decoded_token.Permissions !== undefined) {
                //   this.formatPermissions(
                //     user,
                //     JSON.parse(decoded_token.Permissions),
                //     decoded_token.SubscriptionStatus === ''
                //       ? decoded_token.SubscriptionStatus
                //       : JSON.parse(decoded_token.SubscriptionStatus)
                //   );
                // } else {
                // }
                this.permissionService.setUserPermissions(permissionsArray);
                return AuthActions.AuthenticateSuccess({
                  payload: {
                    user: user,
                    permissionsArray,
                  },
                });
              } else {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Auth] Failed To Login`,
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

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
                type: `[Auth][CatchError] Failed To Login ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  authSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AuthenticateSuccess),
        map((authData) => {
          this.store.dispatch(
            AuthActions.UpdateAccessTokenStatus({ payload: { status: true } })
          );

          this.store.dispatch(AuthActions.IsLoading({ payload: false }));

          const returnUrl =
            this.activatedRoute.snapshot.queryParams['returnUrl'];

          if (returnUrl !== undefined) {
            this.router.navigateByUrl(returnUrl);
          } else if (
            this.router.url.includes('/login') ||
            this.router.url.includes('/check-user')
          ) {
            this.router.navigate(['/app/calculator']);
          }
          this.authService.startActivityMonitor();
        }),
        share()
      );
    },
    { dispatch: false }
  );

  refreshToken$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.RefreshToken),
        withLatestFrom(this.store.select('auth')),
        switchMap(([authData, authState]) => {
          return this.http
            .post<any>(
              `${environment.OptivaAuthUrl}/ApplicationAuth/RefreshToken`,
              {
                email: authState.user.Email,
                refreshToken: authData.payload.refreshToken,
              }
            )
            .pipe(
              map((resData) => {
                if (resData.isSuccess === true) {
                  this.authService.hasRefreshTokenBeenCalled = false;

                  const accessToken = resData.token.accessToken;
                  const userToken = resData.token.userToken;
                  const exp =
                    resData.token.expiresIn * 60000 + new Date().getTime();
                  const refreshToken = resData.token.refreshToken;
                  const data = { accessToken, userToken, exp, refreshToken };

                  localStorage.setItem('Optiva', JSON.stringify(data));

                  this.authService.stopActivityMonitor();
                  this.authService.startActivityMonitor();

                  this.authService.hasRefreshTokenBeenCalled = false;

                  localStorage.removeItem('Optiva_auth');

                  this.store.dispatch(
                    AuthActions.InitializeApp_DeveloperToken()
                  );

                  const decoded_token = this.parseJwt(userToken);

                  const user: any = JSON.parse(decoded_token.UserEntity);

                  // const user_branding: any = decoded_token?.Branding
                  //   ? JSON.parse(decoded_token?.Branding)
                  //   : null; //coming

                  // const theme_color = user_branding?.ThemeColor
                  //   ? user_branding?.ThemeColor.toLowerCase()
                  //   : 'theme1';

                  // // Theme test
                  // if (theme_color !== undefined || theme_color !== null) {
                  //   this.document.body.classList.remove('theme1'); // theme1 is always there by default, it has to be removed to effect user branding
                  //   this.document.body.classList.add(theme_color);
                  // } else {
                  //   this.document.body.classList.add('theme1');
                  // }

                  const permissionsArray: any[] = [];

                  if (decoded_token.Permissions) {
                    const allPermissions: any[] = JSON.parse(
                      decoded_token.Permissions
                    );

                    allPermissions.forEach((el) => {
                      if (el.Status === 1) {
                        permissionsArray.push(el.Name);
                      }
                    });
                  }

                  this.permissionService.setUserPermissions(permissionsArray);

                  this.store.dispatch(
                    AuthActions.RefreshTokenSuccess({
                      payload: {
                        user: user,
                        permissionsArray: permissionsArray,
                      },
                    })
                  );

                  // this.store.dispatch({
                  //   type: '[Auth] Refresh Token Sucessfully',
                  // });
                  return resData;
                } else {
                  this.store.dispatch({
                    type: '[Auth] Failed To Refresh Token',
                  });

                  return resData;
                }
              }),
              catchError((errorRes) => {
                return this.handleCatchError(
                  errorRes,
                  `[Auth][CatchError] Failed To Refresh Token ${errorRes.message}`
                );
              })
            );
        }),
        share()
      );
    },
    { dispatch: false }
  );

  refreshTokenSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.RefreshTokenSuccess),
      map((authData) => {
        this.store.dispatch(
          AuthActions.UpdateAccessTokenStatus({ payload: { status: true } })
        );

        return AuthActions.IsLoading({ payload: false });
      })
    );
  });

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AutoLogin),
      map(() => {
        const optivaData: {
          accessToken: string;
          userToken: string;
          exp: number;
        } = JSON.parse(localStorage.getItem('Optiva')!);

        if (
          optivaData &&
          // optivaAuthData &&
          new Date().getTime() < optivaData.exp
        ) {
          const userToken = optivaData.userToken;
          const decoded_token = JSON.parse(atob(userToken.split('.')[1]));
          const user: any = JSON.parse(decoded_token.UserEntity);

          const permissionsArray: any = [];

          if (decoded_token.Permissions) {
            const allPermissions: any[] = JSON.parse(decoded_token.Permissions);
            // console.log(allPermissions, 'allperm2');
            allPermissions.forEach((el) => {
              if (el.Status === 1) {
                permissionsArray!.push(el.Name);
              }
            });
          }

          return AuthActions.AuthenticateSuccess({
            payload: {
              user: user,
              permissionsArray,
            },
          });
        } else {
          return { type: '[Auth] No User Is Logged In' };
        }
      }),
      catchError((errorRes) => {
        return this.handleCatchError(
          errorRes,
          `[Auth][CatchError] Failed To Auto Login ${errorRes.message}`
        );
      })
    );
  });

  authLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.Logout),
      withLatestFrom(this.store.select('auth')),
      switchMap(([authData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Authentication/logout`, {
            email: authState.user.Email,
          })
          .pipe(
            map((resData) => {
              if (resData.succeeded) {
                this.authService.hasSessionLogoutBeenCalled = false;

                this.authService.stopActivityMonitor();

                localStorage.removeItem('Optiva');

                localStorage.removeItem('Optiva_auth');

                this.store.dispatch(
                  AuthActions.UpdateDeveloperTokenStatus({
                    payload: { status: false },
                  })
                );

                this.store.dispatch(
                  AuthActions.UpdateAccessTokenStatus({
                    payload: { status: false },
                  })
                );

                this.store.dispatch(AuthActions.ClearUser());

                // Closing all currently opened dialogs just incase any is open
                this.dialog.closeAll();

                /***************************Reset all stores***************************/
                this.store.dispatch(AuthActions.ResetStore());
                /**********************************************************************/

                this.router.navigate(['/login']);

                const notification: Notification = {
                  state: 'success',
                  message: `You have been logged out successfully.`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return { type: '[Auth] Logout Was Successful' };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Auth] Failed To Logout' };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

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
                type: `[Auth][CatchError] Failed To Auto Logout ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  authLoginWithInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.InviteLinkLogin),
      switchMap((authData) => {
        return this.http
          .post(
            `${environment.OptivaAuthUrl}/Authentication/verifyuser`,
            authData.payload
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                // this.store.dispatch({
                //   type: '[Auth] Verify With Invite Was Successful',
                // });
                this.router.navigate(['/login']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate(['/login']);

                return {
                  type: '[Auth] Create Password Was Succesful',
                };
              } else {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Auth] Failed To verify user`,
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

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
                type: `[Auth][CatchError] Failed To Login ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  resetPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.ResetPassword),
      switchMap((authData) => {
        return this.http
          .post(
            `${environment.OptivaAuthUrl}/Authentication/resetpassword`,
            authData.payload
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                this.router.navigate(['/login']);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate(['/login']);

                return {
                  type: '[Auth] Password Reset Was Succesful',
                };
              } else {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Auth] Reset Password Failed',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch({
                type: `[Auth][CatchError] Failed To Reset Password ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  forgotPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.ForgotPassword),
      switchMap((authData) => {
        return this.http
          .post(
            `${environment.OptivaAuthUrl}/Authentication/forgotpassword`,
            authData.payload
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate(['/reset-password-message'], {
                  queryParams: {
                    email: authData.payload.email,
                  },
                  queryParamsHandling: 'merge',
                });

                return {
                  type: '[Auth] Success',
                };
              } else {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Auth] Forgot Password Failed',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch({
                type: `[Auth][CatchError] Forgot Password Failed ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  authorizeUserLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AuthorizeUserLogin),
      withLatestFrom(this.store.select('auth')),
      switchMap(([authData, authState]) => {
        return this.http
          .post(
            `${environment.OptivaAuthUrl}/Authentication/authorizeuserlogin`,
            {
              ...authData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(AuthActions.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));
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
                  type: '[Auth] Success',
                };
              } else {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Auth] Forgot Password Failed',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch({
                type: `[Auth][CatchError] Forgot Password Failed ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  changePassword$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.ChangePassword),
        withLatestFrom(this.store.select('auth')),
        switchMap(([authData, authState]) => {
          return this.http
            .post(
              `${environment.OptivaAuthUrl}/Authentication/changepassword`,
              authData.payload
            )
            .pipe(
              map((resData: any) => {
                this.store.dispatch(AuthActions.IsLoading({ payload: false }));

                if (resData.succeeded) {
                  this.store.dispatch({
                    type: '[Auth] Change Password Was Successful',
                  });

                  if (authState.user.Email === authData.payload.email) {
                    const notification: Notification = {
                      state: 'success',
                      message: resData.message || resData.messages[0],
                    };

                    this.notificationService.openSnackBar(
                      notification,
                      'opt-notification-success'
                    );

                    setTimeout(() => {
                      this.store.dispatch(AuthActions.Logout());
                    }, 5000);
                  } else {
                    const notification: Notification = {
                      state: 'success',
                      message: `Password has successfully been updated`,
                    };

                    this.notificationService.openSnackBar(
                      notification,
                      'opt-notification-success'
                    );
                  }

                  return resData;
                } else {
                  const notification: Notification = {
                    state: 'error',
                    message: resData.message || resData.messages[0],
                  };

                  this.notificationService.openSnackBar(
                    notification,
                    'opt-notification-error'
                  );

                  this.store.dispatch({
                    type: '[Auth Failed To Change Password',
                  });

                  return resData;
                }
              }),
              catchError((errorRes) => {
                return this.handleCatchError(
                  errorRes,
                  `[Auth][CatchError] Failed To Change Password ${errorRes.message}`
                );
              })
            );
        }),
        share()
      );
    },
    { dispatch: false }
  );
}
