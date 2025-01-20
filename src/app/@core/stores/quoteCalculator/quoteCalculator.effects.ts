import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as QuoteCalcActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { QuoteCalculatorService } from '../../services/quote-calculator.service';
import { IUploadDocQuoteCalc } from '../../models/sales';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import {
  IInterestOverrideRequest,
  ILoanRequest,
  ISchedulePaymentPlan,
} from '../../models/quote-calculator.model';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class QuoteCalculatorEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog,
    private quoteCalculatorService: QuoteCalculatorService,
    private notificationService: NotificationService
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

  uploadDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.UploadDocument),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: IUploadDocQuoteCalc = {
          ...data.payload,
          UserId: authState.user.UserId,
        };
        return this.quoteCalculatorService.uploadDoc(payload).pipe(
          map((res) => {
            if (res.succeeded) {
              const notification: Notification = {
                state: 'success',
                message: res.message || res.messages[0],
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );

              return QuoteCalcActions.UploadDocumentSuccess({
                isUploaded: true,
              });
            }

            const notification: Notification = {
              state: 'error',
              message: res.message || res.messages[0],
            };

            this.notificationService.openSnackBar(
              notification,
              'opt-notification-error'
            );

            return QuoteCalcActions.UploadDocumentFailure(res.message);
          }),
          catchError((err: any) => {
            return this.handleCatchError(
              err,
              `[QuoteCalculator] Request Authorisation Failure`
            );
          })
        );
      })
    )
  );

  schedulePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.schedulePaymentPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: ISchedulePaymentPlan = {
          ...data.payload,
          userId: authState.user.UserId,
        };

        return this.quoteCalculatorService.schedulePaymentPlan(payload).pipe(
          map((res) => {
            if (res.succeeded) {
              this.store.dispatch(
                QuoteCalcActions.schedulePaymentPlanSuccess({
                  payload: res.entity,
                })
              );
              const notification: Notification = {
                state: 'success',
                message: res.message || res.entity || res.messages[0],
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );
              // this.quoteCalculatorService.setOverrideFxn();
              return QuoteCalcActions.getLoanRequest({
                payload: {
                  applicationQuoteId: data.applicationQuoteId
                    ? data.applicationQuoteId
                    : 0,
                  userId: authState.user.UserId,
                },
              });
              // return QuoteCalcActions.overrideIntrRequestSuccess();
            }

            const notification: Notification = {
              state: 'error',
              message: res.message || res.messages[0],
            };

            this.notificationService.openSnackBar(
              notification,
              'opt-notification-error'
            );
            return QuoteCalcActions.overrideIntrRequestFailure({
              error: res.message,
            });
          })
        );
      })
    )
  );

  updatePaymentSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.updatePaymentsPlan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: ISchedulePaymentPlan = {
          ...data.payload,
          userId: authState.user.UserId,
        };

        return this.quoteCalculatorService
          .updateSchedulePaymentPlan(payload)
          .pipe(
            map((res) => {
              if (res.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: res.message || res.entity || res.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return QuoteCalcActions.getLoanRequest({
                  payload: {
                    applicationQuoteId: data.applicationQuoteId || 0,
                    userId: authState.user.UserId,
                  },
                });
              }

              const notification: Notification = {
                state: 'error',
                message: res.message || res.messages[0],
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );
              return QuoteCalcActions.overrideIntrRequestFailure({
                error: res.message,
              });
            })
          );
      })
    )
  );

  requestInterestOverride$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.overrideIntrRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: IInterestOverrideRequest = {
          ...data.payload,
          userId: authState.user.UserId,
        };

        return this.quoteCalculatorService
          .requestInterestOverride(payload)
          .pipe(
            map((res) => {
              if (res.succedded) {
                const notification: Notification = {
                  state: 'success',
                  message: res.message || res.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                this.quoteCalculatorService.setOverrideFxn();
                return QuoteCalcActions.overrideIntrRequestSuccess();
              }

              const notification: Notification = {
                state: 'error',
                message: res.message || res.messages[0],
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              return QuoteCalcActions.overrideIntrRequestFailure({
                error: res.message,
              });
            })
          );
      })
    )
  );

  getLoanRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.getLoanRequest),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: ILoanRequest = {
          ...data.payload,
          userId: authState.user.UserId,
        };
        return this.quoteCalculatorService.requestLoan(payload).pipe(
          map((res) => {
            if (res.succeeded) {
              return QuoteCalcActions.getLoanRequestSuccess({
                payload: res.entity,
              });
            }

            const notification: Notification = {
              state: 'error',
              message: res.message || res.messages[0],
            };

            this.notificationService.openSnackBar(
              notification,
              'opt-notification-error'
            );

            return QuoteCalcActions.getLoanRequestFailure({
              error: res.message,
            });
          }),
          catchError((err: any) => {
            return this.handleCatchError(
              err,
              '[Quote Calculator] Get Loan Request Failure'
            );
          })
        );
      })
    )
  );

  geLoanPaymentsSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.getPaymentsSchedule),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload = {
          ...data.payload,
          userId: authState.user.UserId,
        };
        return this.quoteCalculatorService
          .getLoanPaymentPlanSchedule(payload)
          .pipe(
            map((res) => {
              if (res.succeeded) {
                return QuoteCalcActions.getPaymentsScheduleSuccess({
                  payload: res.entity,
                });
              }
              return QuoteCalcActions.getPaymentsScheduleFailure();
            }),
            catchError((err: any) => {
              return this.handleCatchError(
                err,
                '[Quote Calculator] Get Payment Plan Schedule Failure'
              );
            })
          );
      })
    )
  );

  geLoanPaymentsScheduleHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.getPaymentsScheduleHistory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload = {
          ...data.payload,
          userId: authState.user.UserId,
        };
        return this.quoteCalculatorService
          .getLoanPaymentPlanScheduleHistory(payload)
          .pipe(
            map((res) => {
              return QuoteCalcActions.getPaymentsScheduleHistorySuccess({
                payload: res.entity,
              });
            }),
            catchError((err: any) => {
              return this.handleCatchError(
                err,
                '[Quote Calculator] Get Payment Plan Schedule Failure'
              );
            })
          );
      })
    )
  );

  /** LOAN REPAYMENT Schedule history */
  createLoanPaymentScheduleHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.CreateLoanPaymentHistory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        const formData = new FormData();

        formData.append(
          'amountPaid',
          JSON.stringify(loanData.payload.amountPaid)
        );

        formData.append(
          'paymentScheduleId',
          JSON.stringify(loanData.payload.paymentScheduleId)
        );

        // formData.append(
        //   'TelexNumber',
        //   JSON.stringify(loanData.payload.TelexNumber)
        // );

        formData.append('document', loanData.payload.document);

        formData.append('userId', authState.user.UserId);
        return this.quoteCalculatorService
          .createLoanPaymentPlanScheduleHistory(formData)
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.dialog.closeAll();

              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Payment receipt created successfully!',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Quote Calculator] Create Loan Payment was Successful',
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
                  type: '[Quote Calculator] Create Loan Payment was not Successful',
                };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Create Loan Payment`
              );
            })
          );
      })
    )
  );

  /** LOAN REPAYMENT Schedule history */
  updateLoanPaymentScheduleHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.updatePaymentsScheduleHistory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, authState]) => {
        return this.quoteCalculatorService
          .updateLoanPaymentPlanScheduleHistory({
            id: action.payload.id,
            paymentStatus: 1,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.dialog.closeAll();

              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Payment History updated successfully!',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return QuoteCalcActions.getPaymentsScheduleHistory({
                  payload: {
                    paymentscheduleId: action.payload.paymentSchdeuleId,
                    userId: authState.user.UserId,
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

                return {
                  type: '[Quote Calculator] Create Loan Payment was not Successful',
                };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Create Loan Payment`
              );
            })
          );
      })
    )
  );

  getFinancialStatement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuoteCalcActions.GenerateFinancialStatement),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, authState]) => {
        let payload: any;
        if (action.invoiceLoanId) {
          payload = {
            userId: authState.user.UserId,
            applicationQuoteId: action.applicationQuoteId,
            invoiceLoanId: action.invoiceLoanId,
          };
        } else {
          payload = {
            userId: authState.user.UserId,
            applicationQuoteId: action.applicationQuoteId,
          };
        }
        return this.quoteCalculatorService
          .generateFinancialStatement(payload)
          .pipe(
            map((res) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              if (res.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: 'Financial statement generated successfully!',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                this.store.dispatch(
                  QuoteCalcActions.GenerateFinancialStatementSuccess({
                    pdfUrl: res.entity,
                  })
                );
                return {
                  type: '[Quote Calculator] Generate Financial Statement was Successful',
                };
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );
                const notification: Notification = {
                  state: 'warning',
                  message:
                    res.message || 'Failed To Generate financial statement',
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                this.dialog.closeAll();

                return {
                  type: '[Quote Calculator] Failed To Generate financial statement',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.dialog.closeAll();
              return this.handleCatchError(
                errorRes,
                `[Quote Calculator] Failed To Generate financial statement`
              );
            })
          );
      })
    )
  );
}
