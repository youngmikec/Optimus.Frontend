import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as GeneralActions from '../general/general.actions';
import * as DiscountActions from './discount.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDiscountDetails } from '../../models/discount-request.model';

@Injectable()
export class DiscountEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private action$: Actions,
    private http: HttpClient,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  //   private handleCatchError(errorRes: any, type: string) {
  //     this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

  //     const notification: Notification = {
  //       state: 'error',
  //       title: 'System Notification',
  //       message: `[Auth] ${errorRes.name}`,
  //     };

  //     this.notificationService.openSnackBar(
  //       notification,
  //       'opt-notification-error'
  //     );

  //     this.store.dispatch({
  //       type,
  //     });

  //     return of();
  //   }

  getAllDiscounts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetAllDiscount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        // /DiscountRequests/savediscount
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Discount/getdiscounts/${authState.user.UserId}/${skip}/${take}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.SaveGetAllDiscount({
                    payload: resData.entity,
                  })
                );

                // const notification: Notification = {
                //   state: 'success',
                //   message: resData.message || `Get Discount successful`,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-success'
                // );

                return {
                  type: '[Discount] Get Discount successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Get Discount successful`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Get All Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Get All Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDiscountByCountryId$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetAllDiscountByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take, countryId } = userData.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Discount/bycountryId/${authState.user.UserId}/${skip}/${take}/${countryId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.SaveGetAllDiscountByCountryId({
                    payload: resData.entity,
                  })
                );

                // const notification: Notification = {
                //   state: 'success',
                //   message: resData.message || `Get Discount successful`,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-success'
                // );

                return {
                  type: '[Discount] Get Discount By CountryId successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Get Discount successful`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Get All Discount By CountryId',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Get All Discount By CountryId ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getActiveDiscountByCountryIdAndMigrationRouteId$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetActiveDiscountByCountryIdAndMigrationRouteId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take, countryId, migrationRouteId } = userData.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Discount/bycountryId/${authState.user.UserId}/${skip}/${take}/${countryId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                const activeDiscount: IDiscountDetails =
                  resData.entity.data.find(
                    (item: IDiscountDetails) =>
                      item.migrationRouteId === migrationRouteId &&
                      item.statusDesc === 'Active' &&
                      item.discountStatusDesc === 'Approved'
                  );

                if (activeDiscount) {
                  this.store.dispatch(
                    DiscountActions.SaveGetActiveDiscountByCountryIdAndMigrationRouteId(
                      {
                        payload: activeDiscount,
                      }
                    )
                  );
                }

                // const notification: Notification = {
                //   state: 'success',
                //   message: resData.message || `Get Discount successful`,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-success'
                // );

                return {
                  type: '[Discount] Get Active Discount By CountryId And MigrationRoute Id successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || `Get Discount successful`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed To Get Active Discount By CountryId And MigrationRoute Id',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Get Active Discount By CountryId And MigrationRoute Id ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getAllDiscountsRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetAllDiscountRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take, status } = userData.payload;
        // /DiscountRequests/savediscount
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/getdiscountrequests/${authState.user.UserId}/${skip}/${take}/?status=${status}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.SaveGetAllDiscountRequests({
                    payload: resData.entity,
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || `Get Discount successful`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Discount] Get Discount Request was successful',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || `Get Discount Request was successful`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Get All Discount Requests',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Get All Discount Requests ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getDiscountRequestStats$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetDiscountRequestStats),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/getdiscountrequeststats?userid=${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.StatLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.SaveDiscountRequestStats({
                    payload: resData.entity,
                  })
                );

                // const notification: Notification = {
                //   state: 'success',
                //   message: resData.message || `Get Discount successful`,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-success'
                // );

                return {
                  type: '[Discount] Get DiscountRequest was successful',
                };
              } else {
                this.store.dispatch(
                  DiscountActions.StatLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || `Failed to Get Discount Request Stats`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Get Discount Request Stats',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.StatLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed to Get Discount Request Stats ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  getDiscountTypes$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.GetDiscountTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Utility/getdiscountypes`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.StatLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.SaveDiscounTypes({
                    payload: resData.entity,
                  })
                );

                // const notification: Notification = {
                //   state: 'success',
                //   message: resData.message || `Get Discount successful`,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-success'
                // );

                return {
                  type: '[Discount] Get DiscountRequest was successful',
                };
              } else {
                this.store.dispatch(
                  DiscountActions.StatLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || `Failed to Get Discount Request Stats`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Get Discount Request Stats',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.StatLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed to Get Discount Request Stats ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  createDiscountRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.CreateDiscount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          countryId: userData.payload.countryId,
          migrationRouteId: userData.payload.migrationRouteId,
          applicationId: 0,
          discountType: userData.payload.discountType,
          discountPercentage: userData.payload.discountPercentage,
          flatAmount: userData.payload.flatAmount,
          startDate: userData.payload.startDate,
          endDate: userData.payload.endDate,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/savediscount`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.CreateEditDiscountSuccess()
                );
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscount({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editDiscountRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.EditDiscount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          id: userData.payload.id,
          countryId: userData.payload.countryId,
          migrationRouteId: userData.payload.migrationRouteId,
          applicationId: 0,
          discountType: userData.payload.discountType,
          discountPercentage: userData.payload.discountPercentage,
          flatAmount: userData.payload.flatAmount,
          startDate: userData.payload.startDate,
          endDate: userData.payload.endDate,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/savediscount`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.CreateEditDiscountSuccess()
                );
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscount({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  approveDiscountRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.ApproveDiscountRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          id: userData.payload.id,
          discountId: userData.payload.discountId,
          status: userData.payload.status,
          approvedDiscountAmount: userData.payload.approvedDiscountAmount,
          approvedDiscountPercentage:
            userData.payload.approvedDiscountPercentage,
        };
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/approve`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.ApprovalIsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscountRequest({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  rejectDiscountRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.RejectDiscountRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          id: userData.payload.id,
          discountId: userData.payload.discountId,
          status: userData.payload.status,
          approvedDiscountAmount: userData.payload.approvedDiscountAmount,
          approvedDiscountPercentage:
            userData.payload.approvedDiscountPercentage,
        };
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/reject`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.ApprovalIsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscountRequest({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateDiscountRequestStatus$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.UpdateDiscountRequestStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          id: userData.payload.id,
          status: userData.payload.status,
        };
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/updatediscountrequeststatus`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscount({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  updateDiscountStatus$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.UpdateDiscountStatus),
      withLatestFrom(this.store.select('auth')),
      switchMap(([userData, authState]) => {
        const { skip, take, countryId } = userData.payload;
        const payload = {
          userId: authState.user.UserId,
          id: userData.payload.id,
          status: userData.payload.status,
        };
        return this.http
          .put<any>(
            `${environment.OptivaImmigrationUrl}/Discount/updatediscountstatus`,
            {
              ...payload,
            }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscountByCountryId({
                    payload: { skip: skip || 0, take: take || 10, countryId },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || `Discount was created succcessfully`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Discount] Create Discount was successfully',
                };
              } else {
                this.store.dispatch(
                  DiscountActions.IsLoading({ payload: false })
                );

                this.store.dispatch(
                  DiscountActions.GetAllDiscountByCountryId({
                    payload: { skip: skip || 0, take: take || 10, countryId },
                  })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || ``,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed to Create Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                DiscountActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Create Discount ${errorRes.message}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete Discount effect
  deleteDiscount$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.DeleteDiscount),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take, id } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/Discount/deletediscount`,
            {
              body: {
                ...deletePayload,
              },
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DiscountActions.GetAllDiscount({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Discount Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Discount] Discount Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Discount',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed To Delete Discount',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Delete Discount ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete DiscountRequest effect
  deleteDiscountRequest$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DiscountActions.DeleteDiscountRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take, id } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .delete<any>(
            `${environment.OptivaImmigrationUrl}/DiscountRequests/deletediscountrequest`,
            {
              body: {
                ...deletePayload,
              },
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  DiscountActions.GetAllDiscount({
                    payload: { skip: skip || 0, take: take || 10 },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Discount Request Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[Discount] Discount Request Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message:
                    resData.message || 'Failed to Delete Discount Request',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Discount] Failed To Delete Discount Request',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Discount][CatchError] Failed To Delete Discount Request ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
