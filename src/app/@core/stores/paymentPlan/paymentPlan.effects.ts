import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as PaymentPlanAction from './paymentPlan.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';

// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class PaymentPlanEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllPaymentPlansByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentPlanAction.GetAllPaymentPlanByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/getpaymentplansbycountry/${authState.user.UserId}/${data.payload.id}/${skip}/${take}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return PaymentPlanAction.SaveAllPaymentPlanByCountryId({
                  payload: resData.entity.data,
                });
              } else {
                return PaymentPlanAction.SaveAllPaymentPlanByCountryId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Get All Payment Plan By Migration Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreatePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentPlanAction.CreatePaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const payload = {
          countryId: data.payload.countryId,
          name: data.payload.name,
          description: data.payload.description,
          numberOfInstallment: data.payload.numberOfInstallment,
          duration: data.payload.duration,
          downPayment: data.payload.downPayment,
          interestRate: data.payload.interestRate,
          feeCategory: data.payload.feeCategory,
          percentage: data.payload.percentage,
          serialNumber: data.payload.serialNumber,
          migrationRouteId: data.payload.migrationRouteId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/create`,
            {
              ...payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              if (resData.succeeded === true) {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: true })
                );
                this.store.dispatch(
                  PaymentPlanAction.GetAllPaymentPlanByCountryId({
                    payload: {
                      id: data.payload.countryId,
                      skip: skip || 0,
                      take: take || 10,
                    },
                  })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || 'Create Payment Plan Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[PaymentPlan] Create Payment Plan Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed To Create Payment Plan',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[PaymentPlan] Failed To Create Payment Plan',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Create Payment Plan ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  // editPaymentPlan$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(PaymentPlanAction.EditPaymentPlan),
  //     withLatestFrom(this.store.select('auth')),
  //     switchMap(([data, authState]) => {
  //       return this.http
  //         .post<any>(
  //           `${environment.OptivaImmigrationUrl}/PaymentPlans/update`,
  //           {
  //             ...data.payload,
  //             userId: authState.user.UserId,
  //           }
  //         )
  //         .pipe(
  //           map((resData) => {
  //             this.store.dispatch(
  //               PaymentPlanAction.IsLoading({ payload: true })
  //             );

  //             if (resData.succeeded === true) {
  //               this.store.dispatch(
  //                 PaymentPlanAction.GetAllPaymentPlanByCountryId({
  //                   payload: { id: resData.payload.countryId },
  //                 })
  //               );

  //               const notification: Notification = {
  //                 state: 'success',
  //                 message: "Update Payment Plan Was Succesfull",
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-success'
  //               );

  //               this.dialog.closeAll();

  //               return {
  //                 type: '[PaymentPlan] Update Payment Plan Was Succesfull',
  //               };
  //             } else {
  //               this.store.dispatch(
  //                 PaymentPlanAction.IsLoading({ payload: false })
  //               );

  //               const notification: Notification = {
  //                 state: 'error',
  //                 message: 'Failed To Update Payment Plan',
  //               };

  //               this.notificationService.openSnackBar(
  //                 notification,
  //                 'opt-notification-error'
  //               );

  //               return {
  //                 type: '[PaymentPlan] Failed To Update Payment Plan',
  //               };
  //             }
  //           }),
  //           catchError((errorRes: any) => {
  //             this.store.dispatch(
  //               PaymentPlanAction.IsLoading({ payload: false })
  //             );

  //             this.store.dispatch({
  //               type: `[PaymentPlan][CatchError] Failed To Update Payment Plan ${errorRes}`,
  //             });

  //             return of(errorRes);
  //           })
  //         );
  //     })
  //   );
  // });

  updatePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentPlanAction.EditPaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take } = data.payload;
        const payload = {
          id: data.payload.id,
          countryId: data.payload.countryId,
          name: data.payload.name,
          description: data.payload.description,
          numberOfInstallment: data.payload.numberOfInstallment,
          duration: data.payload.duration,
          downPayment: data.payload.downPayment,
          interestRate: data.payload.interestRate,
          feeCategory: data.payload.feeCategory,
          percentage: data.payload.percentage,
          serialNumber: data.payload.serialNumber,
          migrationRouteId: data.payload.migrationRouteId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/update`,
            {
              ...payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              if (resData?.succeeded) {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'success',
                  message:
                    resData.message || 'Edit Payment Plan Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  PaymentPlanAction.GetAllPaymentPlanByCountryId({
                    payload: {
                      id: data.payload.countryId,
                      skip: skip || 0,
                      take: take || 10,
                    },
                  })
                );

                this.dialog.closeAll();

                return {
                  type: '[PaymentPlan] Edit Payment Plan Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: false })
                );

                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed To Update PaymentPlan',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[PaymentPlan] Failed To Update PaymentPlan',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              const notification: Notification = {
                state: 'error',
                title: 'System Notification',
                message: `[PaymentPlan] ${errorRes.name}`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Edit PaymentPlan ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    );
  });

  activatePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentPlanAction.ActivatePaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take, id, countryId } = data.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/activatepaymentplan`,
            {
              id,
              countryId,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  PaymentPlanAction.GetAllPaymentPlanByCountryId({
                    payload: {
                      id: data.payload.countryId,
                      skip: skip || 0,
                      take: take || 10,
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
                  type: '[PaymentPlan] Payment Plan Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: false })
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
                  type: '[PaymentPlan] Failed To Activate Payment Plan',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Activate Payment Plan ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivatePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentPlanAction.DeactivatePaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { skip, take, id, countryId } = data.payload;
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/deactivatepaymentplan`,
            {
              id,
              countryId,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  PaymentPlanAction.GetAllPaymentPlanByCountryId({
                    payload: {
                      id: data.payload.countryId,
                      skip: skip || 0,
                      take: take || 10,
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
                  type: '[PaymentPlan] Payment Plan Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  PaymentPlanAction.IsLoading({ payload: false })
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
                  type: '[PaymentPlan] Failed To Deactivate Payment Plan',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                PaymentPlanAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Deactivate Payment Plan ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  //delete PaymentPlan effect
  deletePaymentPlan$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentPlanAction.DeletePaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { id, countryId, skip, take } = data.payload;
        const deletePayload = {
          id,
          userId: authState.user.UserId,
        };
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/PaymentPlans/deletepaymentplan`,
            {
              ...deletePayload,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (resData.succeeded) {
                this.store.dispatch(
                  PaymentPlanAction.GetAllPaymentPlanByCountryId({
                    payload: {
                      id: countryId,
                      skip: skip || 0,
                      take: take || 10,
                    },
                  })
                );
                const notification: Notification = {
                  state: 'success',
                  message: 'Delete Payment Plan Was Succesfull',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.dialog.closeAll();

                return {
                  type: '[PaymentPlan] Payment Plan Delete Was Succesfull',
                };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || 'Failed to Delete Payment Plan',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[PaymentPlan] Failed To Delete Payment Plan',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[PaymentPlan][CatchError] Failed To Delete Payment Plan ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
