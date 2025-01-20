import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultPagination } from '../../enums/default-pagination.enum';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import * as fromApp from '../app.reducer';
import * as DepartmentsActions from '../department/departments.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Router } from '@angular/router';

@Injectable()
export class DepartmentsEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router
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

  getAllDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetAllDepartments),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Department/getall/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllDepartments({
                  payload: resData.entity,
                });
              } else {
                return { type: '[Departments] Failed To Get All Departments' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Departments][CatchError] Failed To Get All Departments ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getActiveDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetAllDepartments),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Department/getactive/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveActiveDepartments({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[Departments] Failed To Get Active Departments',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Departments][CatchError] Failed To Get Active Departments ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.CreateDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([departmentData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Department/create`, {
            ...departmentData.payload,
            userId: authState.user.UserId,
            // name: departmentData.payload.name,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All dept List
                this.store.dispatch(
                  DepartmentsActions.GetAllDepartments({
                    payload: {
                      skip: 0,
                      take: 10,
                    },
                  })
                );
                this.router.navigate([
                  '/app/admin-settings/org-settings/department',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate([
                  '/app/admin-settings/org-settings/department',
                ]);

                return {
                  type: '[Department] Create Department Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Department] Failed To Create Department',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              // const notification: Notification = {
              //   state: 'error',
              //   title: 'System Notification',
              //   message: `[Departments] ${errorRes.name}`,
              // };

              // this.notificationService.openSnackBar(
              //   notification,
              //   'opt-notification-error'
              // );

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Create Department ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([departmentData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Department/update`, {
            ...departmentData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllDepartments({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Departments] Update Department Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Department] Failed To Update Department',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Department] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Update Department ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  //delete Department effect
  deleteDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          departmentId: data.payload.departmentId,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Department/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllDepartments({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Department Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Department] Department Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Department',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Department] Failed To Delete Department',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Delete Department ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Bank Account effect
  deleteBankAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteBankAccount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const deletePayload = {
          id: data.payload.id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/BankAccount/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
                    payload: { skip: 0, take: 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Bank Account Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Department] Bank Account Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Bank Account',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Department] Failed To Delete Bank Account',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Delete Bank Account ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  changeDepartmentStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ChangeDepartmentStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([departmentData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Department/updatestatus`, {
            userId: authState.user.UserId,
            departmentId: departmentData.payload.departmentId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllDepartments({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                      // searchValue: '',
                      // filter: [],
                    },
                  })
                );

                return {
                  type: '[Departments] Change Department Status Was Succesful',
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
                  type: '[Departments] Failed To Change Department Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Departments] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Change Department Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  // division
  createDivision$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.CreateDivision),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Division/create`, {
            ...divisionData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Division List
                this.store.dispatch(
                  DepartmentsActions.GetAllDivisions({
                    payload: {
                      skip: 0,
                      take: 0,
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
                  type: '[Division] Create Division Was Successful',
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
                  type: '[Division] Failed To Create Division',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Create Division ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateDivision$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateDivision),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Division/update`, {
            ...divisionData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Division List
                this.store.dispatch(
                  DepartmentsActions.GetAllDivisions({
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
                  type: '[Division] Edit Division Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Division] Failed To Edit Division',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Division] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Edit Division ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  //delete Division effect
  deleteDivision$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteDivision),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const deletePayload = {
          divisionId: data.payload.divisionId,
          loggedInUserId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Division/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllDivisions({
                    payload: { skip: 0, take: 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Division Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Department] Division Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Division',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Department] Failed To Delete Division',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To Delete Division ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDivisions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllDivisions),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Division/getall/${authState.user.UserId}/${divisionData.payload.skip}/${divisionData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllDivisions({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveAllDivisions({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Get All Divisions ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getActiveDivisions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetActiveDivisions),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Division/getactive/${authState.user.UserId}/${divisionData.payload.skip}/${divisionData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveActiveDivisions({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveActiveDivisions({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Get All Divisions ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  changeDivisionStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ChangeDivisionStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Division/updatestatus`, {
            ...divisionData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllDivisions({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[division] Change Division Status Was Successful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[division] Failed To Change Division Status',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[division] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[division][CatchError] Failed To Change Department Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getAllDivisionByDepartmentId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllDivisionsByDepartmentId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Division/getbydepartmentid/${authState.user.UserId}/${divisionData.payload.id}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllDivisionsByDepartmentId({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveAllDivisionsByDepartmentId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Get All Divisions ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDepartmentByDivisionId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllDepartmentsByDivisionId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([divisionData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Department/getactivedepartmentbydivision/${divisionData.payload.id}/${divisionData.payload.skip}/${divisionData.payload.take}/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllDepartmentsByDivisionId({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  title: 'Warning',
                  message:
                    'This Division Does Not Have A Department. Select Another Division Or Create A Department For This Division.',
                  state: 'warning',
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-warning'
                );
                return DepartmentsActions.SaveAllDepartmentsByDivisionId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Get All Divisions ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate Department Effect
  activateDeactivateDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateDepartment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/Department/activate`
            : `${environment.OptivaAuthUrl}/Department/deactivate`;
        return this.http
          .post<any>(url, {
            departmentId: id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllDepartments({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Department Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Department] Department Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Department',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} Department`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} Department ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate Bank Effect
  activateDeactivateBank$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateBank),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaImmigrationUrl}/BankAccount/activatebankaccount`
            : `${environment.OptivaImmigrationUrl}/BankAccount/deactivatebankaccount`;
        return this.http
          .post<any>(url, {
            id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Bank Account Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Department] Bank Accoun Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Bank Accoun',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} Bank Accoun`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} Bank Accoun ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate JobTitle Effect
  activateDeactivateJobTitle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/JobTitle/activate`
            : `${environment.OptivaAuthUrl}/JobTitle/deactivate`;
        return this.http
          .post<any>(url, {
            id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetJobTitle({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} JobTitle Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Department] JobTitle Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete JobTitle',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} JobTitle`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} JobTitle ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate Branch Effect
  activateDeactivateBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/Branch/activatebranch`
            : `${environment.OptivaAuthUrl}/Branch/deactivatebranch`;
        return this.http
          .post<any>(url, {
            id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBranches({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Branch Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: `[Department] Branch ${action} Was Succesfull`,
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Failed to ${action} Branch`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} Branch`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} Branch ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate Division Effect
  activateDeactivateDivision$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateDivision),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/Division/activate`
            : `${environment.OptivaAuthUrl}/Division/deactivate`;
        return this.http
          .post<any>(url, {
            divisonId: id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllDivisions({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Division Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: `[Department] Division ${action} Was Succesfull`,
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Failed to ${action} Division`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} Division`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} Division ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // activate / deactivate Unit Effect
  activateDeactivateUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateDeactivateUnit),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, skip, take, action } = data.payload;
        const url: string =
          action === 'Activate'
            ? `${environment.OptivaAuthUrl}/Unit/activate`
            : `${environment.OptivaAuthUrl}/Unit/deactivate`;
        return this.http
          .post<any>(url, {
            unitId: id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllUnits({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: `${action} Unit Was Succesfull`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: `[Department] Unit ${action} Was Succesfull`,
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Failed to ${action} Unit`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: `[Department] Failed To ${action} Unit`,
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Department][CatchError] Failed To ${action} Unit ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // deactivateDivision$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(UserActions.DeactivateDepartment),
  //       withLatestFrom(this.store.select('auth')),
  //       switchMap(([userData, authState]) => {
  //         return this.http
  //           .post(
  //             `${environment.OptivaAuthUrl}/Department/deactivatedepartmentstatus`,
  //             {
  //               userId: authState.user.UserId,
  //               subscriberId: authState.user.SubscriberId,
  //               ...userData.payload,
  //             }
  //           )
  //           .pipe(
  //             map((resData: any) => {
  //               this.store.dispatch(UserActions.IsLoading({ payload: false }));

  //               if (resData.succeeded) {
  //                 const notification: Notification = {
  //                   state: 'success',
  //                   message: 'Department deactivated successfully',
  //                 };

  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-success'
  //                 );

  //                 this.store.dispatch({
  //                   type: '[User] Deactivate Department Was Successful',
  //                 });

  //                 this.store.dispatch(
  //                   UserActions.GetAllDepartment({
  //                     payload: { skip: 0, take: 10 },
  //                   })
  //                 );

  //                 return resData;
  //               } else {
  //                 const notification: Notification = {
  //                   state: 'error',
  //                   message: resData.message || resData.messages[0],
  //                 };

  //                 this.notificationService.openSnackBar(
  //                   notification,
  //                   'opt-notification-error'
  //                 );

  //                 return { type: '[User] Failed To Deactivate Department' };
  //               }
  //             }),
  //             catchError((errorRes) => {
  //               return this.handleCatchError(
  //                 errorRes,
  //                 `[User][CatchError] Failed To Deactivate Department ${errorRes.message}`
  //               );
  //             })
  //           );
  //       }),
  //       share()
  //     ),
  //   { dispatch: false }
  // );

  createUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.CreateUnit),
      withLatestFrom(this.store.select('auth')),
      switchMap(([unitData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Unit/create`, {
            ...unitData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Unit List
                this.store.dispatch(
                  DepartmentsActions.GetAllUnits({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                this.router.navigate([
                  '/app/admin-settings/org-settings/units',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate([
                  '/app/admin-settings/org-settings/units',
                ]);

                return {
                  type: '[Units] Create Units Was Successful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Units] Failed To Create Units',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Unit][CatchError] Failed To Create Unit ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateUnit),
      withLatestFrom(this.store.select('auth')),
      switchMap(([unitData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Unit/update`, {
            ...unitData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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

                // Refetch All Division List
                this.store.dispatch(
                  DepartmentsActions.GetAllUnits({
                    payload: {
                      skip: 0,
                      take: 0,
                    },
                  })
                );

                return {
                  type: '[Unit] Edit Unit Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Unit] Failed To Edit Unit',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Department] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Unit][CatchError] Failed To Edit Unit ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllUnits),
      withLatestFrom(this.store.select('auth')),
      switchMap(([unitData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Unit/getall/${authState.user.UserId}/${unitData.payload.skip}/${unitData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllUnits({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveAllUnits({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Division][CatchError] Failed To Get All Units ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  changeUnitStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ChangeUnitStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([unitData, authState]) => {
        return this.http
          .post(`${environment.OptivaAuthUrl}/Unit/updatestatus`, {
            ...unitData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllUnits({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[unit] Change Unit Status Was Successful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[unit] Failed To Change Unit Status',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[unit] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[unit][CatchError] Failed To Change Unit Status ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  // getAllUnitsByDivisionId$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(DepartmentsActions.GetAllUnitsByDivisionId),
  //     withLatestFrom(this.store.select('auth')),
  //     switchMap(([unitData, authState]) => {
  //       return this.http
  //         .get<any>(
  //           `${environment.OptivaAuthUrl}/Unit/getbydivisionid/${authState.user.UserId}/${unitData.payload.id}`
  //         )
  //         .pipe(
  //           map((resData) => {
  //             this.store.dispatch(
  //               DepartmentsActions.IsLoading({ payload: false })
  //             );

  //             if (resData.succeeded === true) {
  //               return DepartmentsActions.SaveAllUnitsByDivisionId({
  //                 payload: resData.entity,
  //               });
  //             } else {
  //               return DepartmentsActions.SaveAllUnitsByDivisionId({
  //                 payload: [],
  //               });
  //             }
  //           }),
  //           catchError((errorRes: any) => {
  //             this.store.dispatch(
  //               DepartmentsActions.IsLoading({ payload: false })
  //             );

  //             this.store.dispatch({
  //               type: `[Unit][CatchError] Failed To Get All Units ${errorRes}`,
  //             });

  //             return of(errorRes);
  //           })
  //         );
  //     })
  //   );
  // });

  getAllUnitsByDepartmentId$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllUnitsByDepartmentId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([unitData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Unit/getactiveunitbydepartment/${authState.user.UserId}/${unitData.payload.id}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllUnitsByDepartmentId({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveAllUnitsByDepartmentId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Unit][CatchError] Failed To Get All Units ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //Branch

  getAllBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetAllBranches),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/Branch/getall/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllBranches({
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
                return { type: '[Branch] Failed To Get All Branches' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Get All Branches ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  createBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.CreateBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([departmentData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Branch/create`, {
            ...departmentData.payload,
            userId: authState.user.UserId,
            // name: departmentData.payload.name,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // Refetch All branch List
                this.store.dispatch(
                  DepartmentsActions.GetAllBranches({
                    payload: {
                      skip: 0,
                      take: 10,
                    },
                  })
                );
                this.router.navigate([
                  '/app/admin-settings/org-settings/branch',
                ]);

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.router.navigate([
                  '/app/admin-settings/org-settings/branch',
                ]);

                return {
                  type: '[Department] Create Branch Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Department] Failed To Create Branch',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Create Branch ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([departmentData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Branch/update`, {
            ...departmentData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllBranches({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                      // searchValue: '',
                      // filter: [],
                    },
                  })
                );

                return {
                  type: '[Branch] Update Branch Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Branch] Failed To Update Branch',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Branch] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Update Branch ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  activateBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Branch/activatebranch`, {
            ...countryData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBranches({
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
                  type: '[Countries] Country Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Branch] Failed To Activate Branch',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Activate Branch ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeactivateBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Branch/deactivatebranch`, {
            ...countryData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBranches({
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
                  type: '[Branch] Branch Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Branch] Failed To Deactivate Branch',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Deactivate Branch ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // Head Office
  createCompanyProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateCompanyProfile),
      withLatestFrom(this.store.select('auth')),
      switchMap(([companyProfileData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaAuthUrl}/HeadOffice/updatecompanyprofile`,
            {
              ...companyProfileData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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
                  DepartmentsActions.GetAllBranches({
                    payload: {
                      skip: DefaultPagination.skip,
                      take: DefaultPagination.take,
                    },
                  })
                );

                return {
                  type: '[Branch] Update Company Profile Was Successful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Branch] Failed To Update company Profile',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Branch] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Update Company Profile ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  updateCompanyProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateCompanyProfile),
      withLatestFrom(this.store.select('auth')),
      switchMap(([companyProfileData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaAuthUrl}/HeadOffice/updatecompanyprofile`,
            {
              ...companyProfileData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
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

                this.store.dispatch(DepartmentsActions.GetHeadOffice());

                return {
                  type: '[Location] Update Company Profile Was Successful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Location] Failed To Update company Profile',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Branch] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Update Company Profile ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getHeadOffice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetHeadOffice),
      withLatestFrom(this.store.select('auth')),
      switchMap(([bankAccountData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAuthUrl}/HeadOffice/getheadofficeusers/${authState.user.UserId}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveHeadOffice({
                  payload: resData.entity,
                });
              } else {
                return DepartmentsActions.SaveHeadOffice({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Location][CatchError] Failed To Get Head Office ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //Bank Accounts

  createBankAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.CreateBankAccount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([bankAccountData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/BankAccount/create`, {
            ...bankAccountData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Bank Accounts
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
                    payload: {
                      skip: 0,
                      take: 0,
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
                  type: '[Bank Account] Create Bank Account Was Successful',
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
                  type: '[Bank Account] Failed To Create Bank Account',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Bank Account][CatchError] Failed To Create Bank Account ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateBankAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.UpdateBankAccount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([BankAccountData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/BankAccount/update`, {
            ...BankAccountData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();

                // Refetch All Division List
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
                    payload: {
                      skip: 0,
                      take: 1000,
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
                  type: '[Bank Account] Edit Bank Account Was Succesful',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Bank Account] Failed To Edit Bank Account',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[Bank Account] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[Bank Account][CatchError] Failed To Edit Bank Account ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  getAllBankAccounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetAllBankAccounts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([bankAccountData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/BankAccount/getbankaccounts/${authState.user.UserId}/${bankAccountData.payload.skip}/9999`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllBankAccounts({
                  payload: resData.entity.pageItems,
                });
              } else {
                return DepartmentsActions.SaveAllBankAccounts({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Bank Account][CatchError] Failed To Get All Bank Accounts ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getActiveBankAccounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.GetActiveBankAccounts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([bankAccountData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/BankAccount/getactivebankaccounts/${authState.user.UserId}/${bankAccountData.payload.skip}/${bankAccountData.payload.take}`
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveActiveBankAccounts({
                  payload: resData.entity.pageItems,
                });
              } else {
                return DepartmentsActions.SaveActiveBankAccounts({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Bank Account][CatchError] Failed To Get Active Bank Accounts ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateBank$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ActivateBank),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/BankAccount/activatebankaccount`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
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
                  type: '[Bank] Country Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Bank] Failed To Activate Bank',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Bank][CatchError] Failed To Activate Bank ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateBank$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeactivateBank),
      withLatestFrom(this.store.select('auth')),
      switchMap(([countryData, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/BankAccount/deactivatebankaccount`,
            {
              ...countryData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBankAccounts({
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
                  type: '[Bank] Bank Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Bank] Failed To Deactivate Branch',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Bank][CatchError] Failed To Deactivate Branch ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getJobTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            // TODO: Call the right API to get all job Listings
            `${environment.OptivaAuthUrl}/JobTitle/getalljobtitles/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllJobTitle({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return { type: '[Job Title] Failed To Get All Job Titles' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              return this.handleCatchError(
                errorRes,
                '[Job Title][CatchError] Failed To Get All  Job Titles'
              );
            })
          );
      })
    )
  );

  getJobTitleByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetJobTitleByStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            // TODO: Call the right API to get all job Listings
            `${environment.OptivaAuthUrl}/JobTitle/getjobtitlesbystatus/${authState.user.UserId}/${userData.payload.status}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllJobTitle({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return { type: '[Job Title] Failed To Get All Job Titles' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              return this.handleCatchError(
                errorRes,
                '[Job Title][CatchError] Failed To Get All  Job Titles'
              );
            })
          );
      })
    )
  );

  getActiveJobTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetActiveJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            // TODO: Call the right API to get all job Listings
            `${environment.OptivaAuthUrl}/JobTitle/getactivejobtitles/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllJobTitle({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return {
                  type: '[Job Title] Failed To Get All Active Job Titles',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              return this.handleCatchError(
                errorRes,
                '[Job Title][CatchError] Failed To Get All Active Job Titles}'
              );
            })
          );
      })
    )
  );

  getInactiveJobTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.GetInactiveJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            // TODO: Call the right API to get all job Listings
            `${environment.OptivaAuthUrl}/JobTitle/getinactivejobtitles/${authState.user.UserId}/${userData.payload.skip}/${userData.payload.take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return DepartmentsActions.SaveAllJobTitle({
                  payload: resData.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return {
                  type: '[Job Title] Failed To Get All Inactive Job Titles',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              return this.handleCatchError(
                errorRes,
                '[Job Title][CatchError] Failed To Get All Inactive Job Titles}'
              );
            })
          );
      })
    )
  );

  createJobTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.CreateJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/JobTitle/createjobtitle`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.dialog.closeAll();
                return DepartmentsActions.GetJobTitle({
                  payload: {
                    skip: 0,
                    take: 10,
                  },
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return { type: '[Job Title] Failed To Get All Job Titles' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Job Title][CatchError] Failed To Get All Job Titles ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  updateJobTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentsActions.UpdateJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/JobTitle/updatejobtitle`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                return DepartmentsActions.GetJobTitle({
                  payload: {
                    skip: 0,
                    take: 10,
                  },
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
                );
                return { type: '[Job Title] Failed To Update Job Title' };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Job Title][CatchError] Failed To Update Job Title ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  updateJobTitleStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.ChangeJobTitleStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .put<any>(
            `${environment.OptivaAuthUrl}/JobTitle/updatejobtitlestatus/${authState.user.UserId}/${data.payload.status}/${data.payload.id}`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: true })
              );

              const filterIndex = data.paginationData.status;

              if (filterIndex === 0) {
                this.store.dispatch(
                  DepartmentsActions.GetJobTitle({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
                );
              } else if (filterIndex === 1) {
                this.store.dispatch(
                  DepartmentsActions.GetActiveJobTitle({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
                );
              } else {
                this.store.dispatch(
                  DepartmentsActions.GetInactiveJobTitle({
                    payload: {
                      skip: data.paginationData.skip,
                      take: data.paginationData.take,
                    },
                  })
                );
              }

              if (resData.succeeded === true) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Job Title]   Update Job Title Status Succeeded',
                };
              } else {
                this.store.dispatch(
                  DepartmentsActions.IsLoading({ payload: false })
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
                  type: '[Job Title] Failed To Update Job Title Status',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DepartmentsActions.IsLoading({ payload: false })
              );

              return this.handleCatchError(
                errorRes,
                '[Job Title][CatchError] Failed To Change Job Title Status'
              );
            })
          );
      })
    );
  });

  //delete JobTitle effect
  deleteJobTitle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteJobTitle),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          id: data.payload.id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/JobTitle/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetJobTitle({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete JobTitle Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[JobTitle] JobTitle Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete JobTitle',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[JobTitle] Failed To Delete JobTitle',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[JobTitle][CatchError] Failed To Delete JobTitle ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Branch effect
  deleteBranch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteBranch),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          id: data.payload.id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Branch/deletetebranch`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllBranches({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Branch Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Branch] Branch Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Branch',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Branch] Failed To Delete Branch',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Branch][CatchError] Failed To Delete Branch ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Unit effect
  deleteUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DepartmentsActions.DeleteUnit),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const deletePayload = {
          unitId: data.payload.unitId,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(`${environment.OptivaAuthUrl}/Unit/delete`, {
            ...deletePayload,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DepartmentsActions.GetAllUnits({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Unit Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Unit] Unit Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Unit',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Unit] Failed To Delete Unit',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Unit][CatchError] Failed To Delete Unit ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
