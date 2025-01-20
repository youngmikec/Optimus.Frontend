import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  forkJoin,
  map,
  of,
  share,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import { MatDialog } from '@angular/material/dialog';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { SalesOverviewService } from '../../services/sales-overview.service';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import {
  IEDIT_ASSIGNED_OFFICERS,
  IEDIT_ASSIGNED_OFFICERS_RES,
  IGET_ALL_ACTIVITIES_BY_ID_RES,
  IGET_ALL_OFFICERS_BY_ROLE_RES,
} from '../../models/sales';
// import { DialogDataService } from '../../services/dialog-data.service';

@Injectable()
export class SaleServiceEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private salesOverviewService: SalesOverviewService // private dialogDataService: DialogDataService,
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

  /**Sale List */
  getSalesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetSalesList),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        const {
          startDate,
          endDate,
          countryId,
          status,
          assignmentStatus,
          take,
          skip,
        } = saleData.payload;
        return this.http
          .get<any>(
            `${
              environment.OptivaImmigrationUrl
            }/Sales/getsales/?Take=${take}&Skip=${skip}&UserId=${authState.user.UserId.trim()}` +
              (countryId ? `&countryId=${countryId}` : '') +
              (startDate ? `&startDate=${startDate?.trim()}` : '') +
              (endDate ? `&endDate=${endDate?.trim()}` : '') +
              (status ? `&status=${status?.trim()}` : '') +
              (assignmentStatus
                ? `&assignmentStatus=${assignmentStatus?.trim()}`
                : '')
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch({
                  type: '[Sales-Loan] Get Sales List Was Successful',
                });

                return SaleServiceActions.SaveSaleList({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveSaleList({
                    payload: [],
                  })
                );

                return { type: '[Sales-Loan] Failed to get Sale List' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get All Sale List`
              );
            })
          );
      })
    )
  );

  searchSalesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.SearchSalesList),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        const params = {
          filter: saleData.payload.filter,
        };

        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/salesoverview/searchaftersalesapplicationquery/${authState.user.UserId}/${saleData.payload.skip}/${saleData.payload.take}`,
            { params }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch({
                  type: '[Sales-Loan] Get Searched Sales List Was Successful',
                });

                return SaleServiceActions.SaveSearchedSaleList({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveSearchedSaleList({
                    payload: [],
                  })
                );

                return {
                  type: '[Sales-Loan] Failed to get Searched Sale List',
                };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get All Searched Sale List`
              );
            })
          );
      })
    )
  );

  /** Sale Overview */
  getSalesOverview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetSaleOverview),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/salesoverview/getapplicationtrailsalesoverview/${authState.user.UserId}/${saleData.applicationQuoteId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch({
                  type: '[Sales-Loan] Get Sales Overview Was Successful',
                });

                return SaleServiceActions.SaveSaleOverview({
                  payload: resData.entity,
                });
              } else {
                return { type: '[Sales-Loan] Failed to get Sale Overview' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get All Sale Overview`
              );
            })
          );
      })
    )
  );

  /** Sale Loans */

  getSalesLoans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetSaleLoans),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        // const params = new HttpParams().set('userId', authState.user.UserId);
        const params: any = {
          startDate: loanData.payload.startDate,
          endDate: loanData.payload.endDate,
        };

        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanbyapplicationquoteid/${authState.user.UserId}/${loanData.payload.skip}/${loanData.payload.take}`,
            { params }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                SaleServiceActions.GetTotalLoanFilter({
                  payload: {
                    applicantId: loanData.payload.applicantId,
                  },
                })
              );

              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.IsLoading({ payload: false })
                );
                return SaleServiceActions.SaveSaleLoans({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveSaleLoanLoan({
                    payload: [],
                  })
                );
                return { type: '[Sales-Loan] Failed to get Sale loans' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get All Sale Loans`
              );
            })
          );
      })
    )
  );

  getAllLoansStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAllLoansStatistics),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .get<any>(
            // ${loanData.payload.startDate}/${loanData.payload.endDate}
            `${environment.OptivaImmigrationUrl}/InvoiceLoan/getallinvoiceloanstatistics/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.IsLoading({ payload: false })
                );
                return SaleServiceActions.SaveAllLoansStatistics({
                  payload: resData.entity,
                });
              } else {
                return {
                  type: '[Sales-Loan] Failed to get all loans statistics',
                };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                SaleServiceActions.IsLoading({ payload: false })
              );
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get All Loans Statistics`
              );
            })
          );
      })
    )
  );

  getSalesLoanById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetSaleLoanById),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authData]) => {
          return this.http
            .get(
              `${environment.OptivaAfterSalesUrl}/loan/getloanbyid/${authData.user.UserId}/${data.payload.id}`
            )
            .pipe(
              map((resData: any) => {
                if (resData.succeeded) {
                  this.store.dispatch({
                    type: '[Sales-Loan] Get Sales Loan By Application Id Was Successful',
                  });

                  return resData.entity;
                } else {
                  this.store.dispatch({
                    type: '[Sales-Loan] Failed to get Sale Loan By Application Id',
                  });
                  return [];
                }
              }),
              catchError((errorRes: any) => {
                return this.handleCatchError(
                  errorRes,
                  '[Sale Service][Catch error] Failed to get Sale Loan By Application Id'
                );
              })
            );
        }),
        share()
      ),
    { dispatch: false }
  );

  // Get invoice id by application quote id
  getInvoiceIdByQuoteId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetInvoiceIdByQuoteId),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authData]) => {
          return this.http
            .get(
              `${environment.OptivaImmigrationUrl}/InvoiceDetails/getInvoiceDetailsByQuote/${authData.user.UserId}/${data.applicationQuoteId}`
            )
            .pipe(
              map((resData: any) => {
                if (resData.succeeded) {
                  const invoiceId = resData.entity[0].invoiceId;
                  this.store.dispatch(
                    SaleServiceActions.GetInvoiceIdByQuoteIdSuccess({
                      payload: { invoiceId },
                    })
                  );
                } else {
                  this.store.dispatch({
                    type: '[Sales-Service] Failed to get invoice id By Id',
                  });
                }
              }),
              catchError((errorRes: any) => {
                of(
                  SaleServiceActions.GetInvoiceIdByQuoteIdFailure({
                    error: errorRes,
                  })
                );
                return this.handleCatchError(
                  errorRes,
                  '[Sales-Loan][Catch error] Failed to get Sale Loan By Id'
                );
              })
            );
        }),
        share()
      ),
    { dispatch: false }
  );

  // Get invoice loan by invoice id
  getSalesLoanByInvoiceId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetSaleLoanByApplicationQuoteId),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authData]) => {
          return this.http
            .get(
              `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanbyapplicationquoteid/${authData.user.UserId}/${data.payload.applicationQuoteId}`
              // `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanbyinvoiceid/${authData.user.UserId}/${data.payload.invoiceId}`
            )
            .pipe(
              map((resData: any) => {
                if (resData.succeeded) {
                  this.store.dispatch(
                    SaleServiceActions.GetSaleLoanByApplicationQuoteIdSuccess({
                      payload: resData,
                    })
                  );
                } else {
                  this.store.dispatch({
                    type: '[Sales-Loan] Failed to get Sale Loan By Id',
                  });
                }
              }),
              catchError((errorRes: any) => {
                of(
                  SaleServiceActions.GetSaleLoanByApplicationQuoteIdFailure({
                    error: errorRes,
                  })
                );
                return this.handleCatchError(
                  errorRes,
                  '[Sales-Loan][Catch error] Failed to get Sale Loan By Id'
                );
              })
            );
        }),
        share()
      ),
    { dispatch: false }
  );

  // Get loan statistics by invoice id
  getSalesLoanStatisticsByInvoiceId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetSaleLoanStatisticsByInvoiceId),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authData]) => {
          return this.salesOverviewService
            .getSalesLoanStatistics(
              authData.user.UserId,
              data.payload.applicationQuoteId
            )
            .pipe(
              map((resData: any) => {
                if (resData.succeeded) {
                  this.store.dispatch(
                    SaleServiceActions.GetSalesLoanStatisticsByInvoiceIdSuccess(
                      {
                        payload: resData.entity,
                      }
                    )
                  );
                } else {
                  this.store.dispatch({
                    type: '[Sales-Loan] Failed to get Sale Loan statistics',
                  });
                }
              }),
              catchError((errorRes: any) => {
                of(
                  SaleServiceActions.GetSaleLoanByApplicationQuoteIdFailure({
                    error: errorRes,
                  })
                );
                return this.handleCatchError(
                  errorRes,
                  '[Sales-Loan][Catch error] Failed to get Sale Loan statistics'
                );
              })
            );
        }),
        share()
      ),
    { dispatch: false }
  );

  getTotalLoanFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetTotalLoanFilter),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/loan/gettotalloanfilter/${loanData.payload.applicantId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.SaveTotalLoanFilter({
                    payload: resData.entity,
                  })
                );

                return {
                  type: '[Sales-Loan] Get Total Loans Filter was successful',
                };
              } else {
                return { type: '[Sales-Loan] Failed to get Total Loan Filter' };
              }
            }),
            catchError((errorRes) => {
              this.store.dispatch(
                SaleServiceActions.SaveTotalLoanFilter({
                  payload: [],
                })
              );

              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Get Total Loans Filter`
              );
            })
          );
      })
    )
  );

  requestLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.RequestLoan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/loan/create`, {
            ...loanData.payload,
            userId: authState.user.UserId,
            name: authState.user.Email,
            currencyCode: 1,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.dialog.closeAll();
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return { type: '[Sales-Loan] Request Loan was Successful' };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Sales-Loan] Request Loan was not Successful' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Request Loan`
              );
            })
          );
      })
    )
  );

  approveLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.ApproveLoan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/loan/activateloan`, {
            id: loanData.payload.id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.GetSaleLoans({
                    payload: {
                      applicantId: loanData.paginationData.applicantId,
                      applicationId: loanData.paginationData.applicationId,
                      skip: loanData.paginationData.skip,
                      take: loanData.paginationData.take,
                      startDate: null,
                      endDate: null,
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

                return { type: '[Sales-Loan] Approve Loan was Successful' };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Sales-Loan] Approve Loan was not Successful' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Approve Loan`
              );
            })
          );
      })
    )
  );

  rejectLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.RejectLoan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/loan/deactivateLoan`, {
            id: loanData.payload.id,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.GetSaleLoans({
                    payload: {
                      applicantId: loanData.paginationData.applicantId,
                      applicationId: loanData.paginationData.applicationId,
                      skip: loanData.paginationData.skip,
                      take: loanData.paginationData.take,
                      startDate: null,
                      endDate: null,
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

                return { type: '[Sales-Loan] Reject Loan was Successful' };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Sales-Loan] Reject Loan was not Successful' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Reject Loan`
              );
            })
          );
      })
    )
  );

  updateLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.UpdateLoan),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaAfterSalesUrl}/loan/update`, {
            ...loanData.payload,
            userId: authState.user.UserId,
            name: authState.user.Email,
            currencyCode: 1,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.dialog.closeAll();

              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return { type: '[Sales-Loan] Update Loan was Successful' };
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Sales-Loan] Update Loan was not Successful' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                `[Sale][CatchError] Failed To Update Loan`
              );
            })
          );
      })
    )
  );

  /** LOAN REPAYMENT */
  createLoanRepayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.CreateLoanRepayment),
      withLatestFrom(this.store.select('auth')),
      switchMap(([loanData, authState]) => {
        const formData = new FormData();

        formData.append(
          'AmountPaid',
          JSON.stringify(loanData.payload.AmountPaid)
        );

        formData.append('LoanId', JSON.stringify(loanData.payload.LoanId));

        formData.append(
          'TelexNumber',
          JSON.stringify(loanData.payload.TelexNumber)
        );

        formData.append('ProofOfPayment', loanData.payload.ProofOfPayment);

        formData.append('UserId', authState.user.UserId);

        return this.http
          .post<any>(
            `${environment.OptivaAfterSalesUrl}/loanpayment/createloanpayment`,
            formData
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.dialog.closeAll();

              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Sales-Loan] Create Loan Payment was Successful',
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
                  type: '[Sales-Loan] Create Loan Payment was not Successful',
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

  getSalesLoanRepaymentById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetSaleLoanRepaymentById),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authData]) => {
          return this.http
            .get(
              `${environment.OptivaAfterSalesUrl}/loanpayment/getloanpaymentsbyid/${authData.user.UserId}/${data.payload.id}`
            )
            .pipe(
              map((resData: any) => {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );

                if (resData.succeeded) {
                  this.store.dispatch({
                    type: '[Sales-Loan] Get Sales Loan Repayment By Id Was Successful',
                  });

                  return resData.entity;
                } else {
                  this.store.dispatch({
                    type: '[Sales-Loan] Failed to get Sale Loan Repayment By Id',
                  });
                  return [];
                }
              }),
              catchError((errorRes: any) => {
                return this.handleCatchError(
                  errorRes,
                  '[Sale Service][Catch error] Failed to get Sale Loan Repayment By Id'
                );
              })
            );
        }),
        share()
      ),
    { dispatch: false }
  );

  /** ADD TASKS */
  getAllTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAllTask),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/salestask/getallsalestasks/${authState.user.UserId}/${saleData.payload.applicationId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                return SaleServiceActions.SaveTasks({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveTasks({
                    payload: [],
                  })
                );
                return { type: '[Sales-Loan] Failed to get Sale Task' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed To Get All Sale Task'
              );
            })
          );
      })
    )
  );

  getAllActiveTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAllActiveTask),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/salestask/getactivesalestaskbyapplicationid/${authState.user.UserId}/${saleData.payload.applicationId}`
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                return SaleServiceActions.SaveActiveTasks({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveActiveTasks({
                    payload: [],
                  })
                );
                return { type: '[Sales-Loan] Failed to get Active Task' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed To Get Active Task'
              );
            })
          );
      })
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.AddTask),
      withLatestFrom(this.store.select('auth')),

      switchMap(([taskData, authState]) => {
        // console.log(authState.user.UserId);
        const { applicationId, assignedTo, title, dueDate, closeOnSuccess } =
          taskData.payload;
        return this.http
          .post(
            `${environment.OptivaAfterSalesUrl}/salestask/createsalestask`,
            {
              applicationId,
              assignedTo,
              title,
              dueDate,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              closeOnSuccess && this.dialog.closeAll();

              this.store.dispatch(
                GeneralActions.IsLoading({
                  payload: false,
                })
              );
              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.GetAllActiveTask({
                    payload: {
                      applicationId: applicationId,
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
                  type: '[Sales-Loan] Task added Successfully',
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

                return { type: '[Sales-Loan] Failed to add task' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Add Tasks'
              );
            })
          );
      })
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.UpdateTask),
      withLatestFrom(this.store.select('auth')),

      switchMap(([taskData, authState]) => {
        return this.http
          .put(`${environment.OptivaAfterSalesUrl}/salestask/updatesalestask`, {
            ...taskData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                GeneralActions.IsLoading({
                  payload: false,
                })
              );

              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.GetAllActiveTask({
                    payload: {
                      applicationId: taskData.payload.applicationId,
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

                this.dialog.closeAll();
                return {
                  type: '[Sales-Loan] Task added Successfully',
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

                this.dialog.closeAll();

                return { type: '[Sales-Loan] Failed to add task' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Add Tasks'
              );
            })
          );
      })
    )
  );

  cancelTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.CancelTask),
      withLatestFrom(this.store.select('auth')),

      switchMap(([taskData, authState]) => {
        return this.http
          .put(`${environment.OptivaAfterSalesUrl}/salestask/cancelsalestask`, {
            ...taskData.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.store.dispatch(
                SaleServiceActions.GetAllActiveTask({
                  payload: {
                    applicationId: taskData.payload.applicationId,
                  },
                })
              );

              this.dialog.closeAll();
              if (resData.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Sales-Loan] Task Canceled Successfully',
                };
              } else {
                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return { type: '[Sales-Loan] Failed to Cancel task' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Cancel Tasks'
              );
            })
          );
      })
    )
  );

  MarkTaskAsDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.MarkTaskAsDone),
      withLatestFrom(this.store.select('auth')),

      switchMap(([taskData, authState]) => {
        // console.log(authState.user.UserId);
        return this.http
          .put(
            `${environment.OptivaAfterSalesUrl}/salestask/marksalesasdonetask`,
            {
              ...taskData.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.GetAllActiveTask({
                    payload: {
                      applicationId: taskData.payload.applicationId,
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
                  type: '[Sales-Loan] Task Marked As Done Successfully',
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

                return { type: '[Sales-Loan] Failed to Mark task As Done' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Mark Task As Done'
              );
            })
          );
      })
    )
  );

  /** Meetings */

  getAllMeetings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAllMeetings),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/meeting/upcomingmeetings/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                return SaleServiceActions.SaveMeetings({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveMeetings({
                    payload: [],
                  })
                );
                return { type: '[Sales-Loan] Failed to get Sale loans' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed To Get All Sale Loans'
              );
            })
          );
      })
    )
  );

  getAllMeetingsByApplicationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAllMeetingsByApplicationId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([saleData, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaAfterSalesUrl}/meeting/meetings/${authState.user.UserId}/${saleData.payload.applicationId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded) {
                return SaleServiceActions.SaveMeetings({
                  payload: resData.entity,
                });
              } else {
                this.store.dispatch(
                  SaleServiceActions.SaveMeetings({
                    payload: [],
                  })
                );
                return { type: '[Sales-Loan] Failed to get Sale loans' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed To Get All Sale Loans'
              );
            })
          );
      })
    )
  );

  createMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.CreateMeeting),
      withLatestFrom(this.store.select('auth')),

      switchMap(([meetingData, authState]) => {
        const formData = new FormData();
        formData.append('UserId', authState.user.UserId);
        formData.append('Title', meetingData.payload.title);
        formData.append('ApplicationId', meetingData.payload.applicationId);
        formData.append('EndDate', meetingData.payload.endDate);
        formData.append('StartDate', meetingData.payload.startDate);
        formData.append('Location', meetingData.payload.location);
        formData.append(
          'MeetingGuestRequests',
          JSON.stringify(meetingData.payload.meetingGuestRequests)
        );

        if (meetingData.payload.fileAttachment) {
          formData.append('FileAttachment', meetingData.payload.fileAttachment);
        }

        if (meetingData.payload.message) {
          formData.append('message', meetingData.payload.message);
        }

        return this.http
          .post(
            `${environment.OptivaAfterSalesUrl}/meeting/createmeeting`,
            formData
          )
          .pipe(
            switchMap((resData: any) => {
              this.store.dispatch(
                GeneralActions.IsLoading({
                  payload: false,
                })
              );

              this.dialog.closeAll();

              if (resData.succeeded) {
                this.store.dispatch(SaleServiceActions.GetAllMeetings());

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return of({
                  type: '[Sales-Loan] Meeting added Successfully',
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

                return of({ type: '[Sales-Loan] Failed to add Meeting' });
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Add Meetings'
              );
            })
          );
      })
    )
  );

  updateMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.UpdateMeeting),
      withLatestFrom(this.store.select('auth')),

      switchMap(([meetingData, authState]) => {
        const formData = new FormData();
        formData.append('UserId', authState.user.UserId);
        formData.append('Title', meetingData.payload.title);
        formData.append(
          'meetingId',
          JSON.stringify(meetingData.payload.meetingId)
        );
        formData.append('EndDate', meetingData.payload.endDate);
        formData.append('StartDate', meetingData.payload.startDate);
        formData.append('Location', meetingData.payload.location);
        formData.append(
          'MeetingGuestRequests',
          JSON.stringify(meetingData.payload.meetingGuestRequests)
        );

        if (meetingData.payload.fileAttachment) {
          formData.append('FileAttachment', meetingData.payload.fileAttachment);
        }

        if (meetingData.payload.message) {
          formData.append('message', meetingData.payload.message);
        }

        return this.http
          .post(
            `${environment.OptivaAfterSalesUrl}/meeting/updatemeeting`,
            formData
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                GeneralActions.IsLoading({
                  payload: false,
                })
              );

              this.dialog.closeAll();

              if (resData.succeeded) {
                this.store.dispatch(SaleServiceActions.GetAllMeetings());

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Sales-Loan] Meeting Updated Successfully',
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

                return { type: '[Sales-Loan] Failed to Update Meeting' };
              }
            }),
            catchError((errorRes) => {
              return this.handleCatchError(
                errorRes,
                '[Sales-Loan][CatchError] Failed to Update Meeting'
              );
            })
          );
      })
    )
  );

  cancelMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.CancelMeeting),
      withLatestFrom(this.store.select('auth')),
      switchMap(([meetingData, authState]) => {
        const formData = {
          userId: authState.user.UserId,
          id: meetingData.payload.meetingId,
        };
        return this.http
          .put(
            `${environment.OptivaAfterSalesUrl}/meeting/cancelmeeting`,
            formData
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                GeneralActions.IsLoading({
                  payload: false,
                })
              );
              if (resData.succeeded) {
                this.store.dispatch(SaleServiceActions.GetAllMeetings());

                const notification: Notification = {
                  state: 'success',
                  message: resData.message || resData.messages[0],
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );

                return {
                  type: '[Sales-Loan] Meeting Canceled Successfully',
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

                return { type: '[Sales-Loan] Failed to Cancel Meeting' };
              }
            })
          );
      })
    )
  );

  getAllActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetActivities),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.salesOverviewService
          .getActivitiesByApplicationId(authState.user.UserId, data.payload.id)
          .pipe(
            map((res: any) => {
              if (res.succeeded) {
                return SaleServiceActions.GetActivitesSuccess({
                  activities: res.entity,
                });
              } else {
                // const notification: Notification = {
                //   state: 'error',
                //   message: res.message,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-error'
                // );

                return SaleServiceActions.GetActivitiesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                SaleServiceActions.GetActivitiesFailure({ error: err.message })
              );
            })
          );
      })
    )
  );

  getMeetingTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetMeetingTypes),
      withLatestFrom(this.store.select('auth')),
      switchMap(([authData]) => {
        return this.http
          .get(`${environment.OptivaAfterSalesUrl}/utility/getmeetingtypes`)
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                this.store.dispatch(
                  SaleServiceActions.SaveMeetingTypes({
                    payload: resData.entity,
                  })
                );

                return {
                  type: '[Sales Service] Get Meeting Types Successful',
                };
              } else {
                this.store.dispatch(
                  SaleServiceActions.IsLoading({ payload: false })
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
                  type: '[Sales Service] Failed To Get Meeting Types',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                SaleServiceActions.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Sales Service][CatchError] Failed To Get Meeting Types ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    )
  );

  //Activities by application Id
  getAllActivitiesByApplicationId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetActivitiesByApplicationId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.salesOverviewService
          .getActivitiesById(authState.user.UserId, data.payload.id)
          .pipe(
            map((res: IGET_ALL_ACTIVITIES_BY_ID_RES) => {
              if (res.succeeded) {
                return SaleServiceActions.GetActivitesSuccess({
                  activities: res.entity,
                });
              } else {
                // const notification: Notification = {
                //   state: 'error',
                //   message: res.message,
                // };

                // this.notificationService.openSnackBar(
                //   notification,
                //   'opt-notification-error'
                // );

                return SaleServiceActions.GetActivitiesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                SaleServiceActions.GetActivitiesFailure({ error: err.message })
              );
            })
          );
      })
    )
  );

  markActivityAsDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.MarkActivityAsDone),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const { applicationId } = data.payload;
        return this.salesOverviewService
          .markActivityAsDone(
            authState.user.UserId,
            data.payload.id,
            data.payload.status
          )
          .pipe(
            map((res: any) => {
              if (res.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: res.entity,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                this.store.dispatch(
                  SaleServiceActions.GetActivities({
                    payload: { id: applicationId },
                  })
                );
                return SaleServiceActions.GetActivities({
                  payload: { id: applicationId },
                });
                // return SaleServiceActions.MarkActivityAsDoneSuccess();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: res.message,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return SaleServiceActions.MarkActivityAsDoneFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                SaleServiceActions.MarkActivityAsDoneFailure({
                  error: err.message,
                })
              );
            })
          );
      })
    )
  );

  editAllAsssignedOfficers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.EditAssignedOfficer),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const payload: IEDIT_ASSIGNED_OFFICERS = {
          ...data,
          userId: authState.user.UserId,
        };
        delete payload?.roleString;
        delete payload?.applicationId;
        return this.salesOverviewService.editAssignedOfficers(payload).pipe(
          map((res: IEDIT_ASSIGNED_OFFICERS_RES) => {
            if (res.succeeded) {
              const notification: Notification = {
                state: 'success',
                message: `Successfully reassigned ${data.roleString} officers`,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );

              return DocumentCollectionActions.getDocumentOfficers({
                applicationId: data.applicationId!,
              });
            } else {
              const notification: Notification = {
                state: 'error',
                message: res.message,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              return SaleServiceActions.EditAssignedOfficerFailure({
                error: res.message,
              });
            }
          })
        );
      })
    )
  );

  getAllAssignedOfficersByRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetAssignedOfficersByRole),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.salesOverviewService
          .getOfficersByRole(authState.user.UserId, data.officerRole)
          .pipe(
            map((res: IGET_ALL_OFFICERS_BY_ROLE_RES) => {
              if (res.succeeded) {
                return SaleServiceActions.GetAssignedOfficersByRoleSuccess({
                  payload: res.entity,
                });
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: res.message,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return SaleServiceActions.GetAssignedOfficersByRoleFailure({
                  error: res.message,
                });
              }
            })
          );
      })
    )
  );

  /** By partial we imply the data gotten by merge several api call responses **/
  getSalesOverviewDataPartial$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SaleServiceActions.GetSalesOverviewPartiaData),
        withLatestFrom(this.store.select('auth')),
        switchMap(([data, authState]) => {
          return forkJoin([
            of(authState),
            this.salesOverviewService.getApplicantById(
              authState.user.UserId,
              data.payload.userid
            ),
            this.salesOverviewService.getPhases(data.payload.userid),
            this.salesOverviewService.getTotalPaidInvoice(data.payload.userid),
          ]).pipe(
            map((res: any) => {
              // const [authState, applicant, phases, invoice] = res;

              // if (
              //   applicant.succeeded &&
              //   phases.succeeded &&
              //   invoice.succeeded
              // ) {
              //   console.log()
              // }

              return res;
            }),
            catchError((err) => {
              // eslint-disable-next-line no-console
              // console.log('Error ooo', err);
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  getSalesOverviewStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaleServiceActions.GetSaleOverviewStatistics),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.salesOverviewService
          .getSalesStatistics(authState.user.UserId, data.applicationQuoteId)
          .pipe(
            map((res: any) => {
              if (res.succeeded) {
                return SaleServiceActions.GetSaleOverviewStatisticsSucess({
                  statistics: res.entity,
                });
              } else {
                return SaleServiceActions.GetSaleOverviewStatisticsFailure({
                  error: res.message,
                });
              }
            }),
            catchError((error) =>
              of(
                SaleServiceActions.GetSaleOverviewStatisticsFailure({
                  error: error,
                })
              )
            )
          );
      })
    )
  );
}
