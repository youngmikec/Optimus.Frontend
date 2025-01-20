import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromApp from '../app.reducer';
import * as InvoicesActions from './invoices.actions';
import * as GeneralActions from '../general/general.actions';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { InvoiceService } from '../../services/invoice.service';
import {
  IGET_INVOICE_RES,
  IINVOICE_DETAILS_RES,
  IMARK_AS_PAID_RES,
  ISEND_INVOICE_RES,
} from '../../models/invoice';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private invoicesService: InvoiceService,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getInvoiceById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.loadInvoiceById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getInvoiceById(authState.user.UserId, data.invoiceId)
          .pipe(
            map((resp: any) => {
              if (resp.succeeded)
                return InvoicesActions.singleInvoicesSuccess({
                  invoice: resp.entity,
                });
              else {
                const notification: Notification = {
                  state: 'error',
                  message: resp.message || resp.messages[0],
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );
                return InvoicesActions.invoiceFailure({
                  error: resp.message ?? resp.messages[0],
                });
              }
            }),
            catchError((error: any) =>
              of(InvoicesActions.invoiceFailure({ error: error.message }))
            )
          );
      })
    );
  });

  markAsPaid$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.markAsPaid),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        data.form.append('UserId', authState.user.UserId);
        return this.invoicesService.markAsPaid(data.form).pipe(
          map((res: IMARK_AS_PAID_RES) => {
            this.store.dispatch(
              InvoicesActions.createInvoiceLoading({ payload: false })
            );

            if (res.succeeded) {
              this.dialog.closeAll();

              this.store.dispatch(
                InvoicesActions.GetInvoiceByApplicationQuoteId({
                  payload: {
                    id: data.applicationQuoteId ?? 0,
                    skip: 0,
                    take: 100,
                  },
                })
              );

              const notification: Notification = {
                state: 'success',
                message: res.message ?? res.entity,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );

              return InvoicesActions.markAsPaidSuccessful();
            } else {
              const notification: Notification = {
                state: 'error',
                message: res.message,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              return InvoicesActions.markAsPaidFailed({ error: res.message });
            }
          }),
          catchError((err: any) => {
            this.store.dispatch(
              InvoicesActions.createInvoiceLoading({ payload: false })
            );

            return of(
              InvoicesActions.markAsPaidFailed({
                error: err.message,
              })
            );
          })
        );
      })
    );
  });

  updateMarkAsPaid$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.updateMarkAsPaid),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        const updatePayload = {
          userId: authState.user.UserId,
          invoicePaymentDetailId: data.invoicePaymentDetailId,
          paymentStatus: data.paymentStatus,
        };

        return this.invoicesService.updateMarkAsPaid(updatePayload).pipe(
          map((res: IMARK_AS_PAID_RES) => {
            this.store.dispatch(
              InvoicesActions.createInvoiceLoading({ payload: false })
            );

            if (res.succeeded) {
              this.dialog.closeAll();

              this.store.dispatch(
                InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId({
                  payload: {
                    applicationQuoteId: data.applicationQuoteId ?? 0,
                  },
                })
              );

              this.store.dispatch(
                InvoicesActions.GetInvoiceByApplicationQuoteId({
                  payload: {
                    id: data.applicationQuoteId ?? 0,
                    skip: 0,
                    take: 100,
                  },
                })
              );

              const notification: Notification = {
                state: 'success',
                message: res.message ?? res.entity,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-success'
              );

              return InvoicesActions.markAsPaidSuccessful();
            } else {
              const notification: Notification = {
                state: 'error',
                message: res.message,
              };

              this.notificationService.openSnackBar(
                notification,
                'opt-notification-error'
              );

              return InvoicesActions.markAsPaidFailed({ error: res.message });
            }
          }),
          catchError((err: any) => {
            this.store.dispatch(
              InvoicesActions.createInvoiceLoading({ payload: false })
            );

            return of(
              InvoicesActions.markAsPaidFailed({
                error: err.message,
              })
            );
          })
        );
      })
    );
  });

  sendInvoiceToEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.SendInvoiceToEmail),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        this.store.dispatch(
          InvoicesActions.createInvoiceLoading({ payload: false })
        );
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Invoices/sendinvoicepdftoemail`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoicesActions.createInvoiceLoading({ payload: false })
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

                this.dialog.closeAll();

                return {
                  type: '[Invoices] Sending Invoice To Mail Was Succesfull',
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
                  type: '[Invoices] Failed To Sending Invoice To Mail',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoicesActions.createInvoiceLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Invoices][CatchError] Failed To Sending Invoice To Mail ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  sendInvoicePaymentToEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.SendInvoicePaymentToEmail),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        this.store.dispatch(
          InvoicesActions.SetLoadingState({ payload: { isLoading: false } })
        );
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/InvoicePaymentDetail/sendpaymentdetailpdftoemail`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                InvoicesActions.SetLoadingState({
                  payload: { isLoading: false },
                })
              );
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
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
                  type: '[Invoices] Sending Invoice To Mail Was Succesfull',
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
                  type: '[Invoices] Failed To Sending Invoice To Mail',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                InvoicesActions.SetLoadingState({
                  payload: { isLoading: false },
                })
              );
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Invoices][CatchError] Failed To Sending Invoice To Mail ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  searchAllInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.searchAllInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .searchInvoices(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.searchWord
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.pageCount) {
                return InvoicesActions.getAllInvoicesSuccess({
                  invoices: res,
                });
              } else if (res.succeeded && !res.entity.pageCount) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getAllInvoicesSuccess({
                  invoices: {
                    ...res,
                    entity: {
                      pageItems: res.entity,
                      pageCount: 1,
                      totalCount: 30,
                    },
                  },
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

                return InvoicesActions.getAllInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getAllInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  getAllInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getAllInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllInvoice(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.data.length) {
                return InvoicesActions.getAllInvoicesSuccess({
                  invoices: res,
                });
              } else if (res.succeeded && !res.entity.data.length) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getAllInvoicesSuccess({
                  invoices: {
                    ...res,
                    entity: {
                      data: res.entity.data,
                      pageCount: res.entity.pageCount || 1,
                      totalCount: res.entity.totalCount || 30,
                    },
                  },
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

                return InvoicesActions.getAllInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getAllInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  searchPaidInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.searchPaidInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .searchInvoices(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.searchWord,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.data.length) {
                return InvoicesActions.getPaidInvoicesSuccess({
                  paidInvoices: res,
                });
              } else if (res.succeeded && !res.entity.data.length) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getPaidInvoicesSuccess({
                  paidInvoices: {
                    ...res,
                    entity: {
                      data: res.entity.data,
                      pageCount: res.entity.pageCount || 1,
                      totalCount: res.entity.totalCount || 30,
                    },
                  },
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

                return InvoicesActions.getPaidInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getPaidInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  getAllPaidInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getPaidInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllInvoice(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.data.length) {
                return InvoicesActions.getPaidInvoicesSuccess({
                  paidInvoices: res,
                });
              } else if (res.succeeded && !res.entity.data.length) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getPaidInvoicesSuccess({
                  paidInvoices: {
                    ...res,
                    entity: {
                      data: res.entity.data,
                      pageCount: res.entity.pageCount || 1,
                      totalCount: res.entity.totalCount || 30,
                    },
                  },
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

                return InvoicesActions.getPaidInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getPaidInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  searchOutstandingInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.searchOutStandingInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .searchInvoices(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.searchWord,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.data.length) {
                return InvoicesActions.getOutstandingInvoicesSuccess({
                  outstandingInvoices: res,
                });
              } else if (res.succeeded && !res.entity.data.length) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getOutstandingInvoicesSuccess({
                  outstandingInvoices: {
                    ...res,
                    entity: {
                      data: res.entity.data,
                      pageCount: res.entity.pageCount || 1,
                      totalCount: res.entity.totalCount || 30,
                    },
                  },
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

                return InvoicesActions.getOutstandingInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.getOutstandingInvoicesFailure({ error: err })
              );
            })
          );
      })
    );
  });

  getAllOutstandingInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getOutstandingInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllInvoiceWithPaymentStatus(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              // if (res.succeeded && res.entity.pageCount) {
              //   return InvoicesActions.getOutstandingInvoicesSuccess({
              //     outstandingInvoices: res,
              //   });
              // } else if (res.succeeded && !res.entity.pageCount) {
              //   /**
              //    * Mock endpoint data manipulation. Temporary fix
              //    **/
              //   return InvoicesActions.getOutstandingInvoicesSuccess({
              //     outstandingInvoices: {
              //       ...res,
              //       entity: {
              //         pageItems: res.entity,
              //         pageCount: 1,
              //         totalCount: 30,
              //       },
              //     },
              //   });
              // } else {
              //   const notification: Notification = {
              //     state: 'error',
              //     message: res.message,
              //   };

              //   this.notificationService.openSnackBar(
              //     notification,
              //     'opt-notification-error'
              //   );

              //   return InvoicesActions.getOutstandingInvoicesFailure({
              //     error: res.message,
              //   });
              // }
              if (res.succeeded && res.entity.data.length) {
                return InvoicesActions.getOutstandingInvoicesSuccess({
                  outstandingInvoices: res,
                });
              } else if (res.succeeded && !res.entity.data.length) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getOutstandingInvoicesSuccess({
                  outstandingInvoices: {
                    ...res,
                    entity: {
                      data: res.entity.data,
                      pageCount: res.entity.pageCount || 1,
                      totalCount: res.entity.totalCount || 30,
                    },
                  },
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

                return InvoicesActions.getOutstandingInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.getOutstandingInvoicesFailure({ error: err })
              );
            })
          );
      })
    );
  });

  sendInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.sendInvoice),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .sendInvoice(authState.user.UserId, data.id, data.attachment)
          .pipe(
            map((res: ISEND_INVOICE_RES) => {
              if (res.succeeded) {
                //Reload current url
                const currentUrl = this.router.url;

                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => {
                    {
                      this.router.navigate([currentUrl]);
                    }
                  });
                const notification: Notification = {
                  state: 'success',
                  message: res.message,
                };
                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                return InvoicesActions.sendInvoiceSuccess();
              } else {
                const notification: Notification = {
                  state: 'error',
                  message: res.message,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return InvoicesActions.sendInvoiceFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.sendInvoiceFailure({
                  error: err.message,
                })
              );
            })
          );
      })
    );
  });

  getInvoiceDetailsById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getInvoiceDetailsById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getInvoiceById(authState.user.UserId, data.applicantId)
          .pipe(
            map((res: IINVOICE_DETAILS_RES) => {
              if (res.succeeded) {
                return InvoicesActions.getInvoiceDetailsByIdSuccess({
                  ...res.entity.invoice,
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

                return InvoicesActions.getInvoiceDetailsByIdFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.getInvoiceDetailsByIdFailure({
                  error: err.message,
                })
              );
            })
          );
      })
    );
  });

  createInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.createInvoice),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        let newInvoiceDetails = [];
        let newInvoiceBankAccounts = [];
        newInvoiceDetails = data.invoice.invoiceDetails.map((x) => {
          return {
            ...x,
            userId: authState.user.UserId,
          };
        });
        newInvoiceBankAccounts = data.invoice.invoiceBankAccounts.map((x) => {
          return {
            ...x,
            userId: authState.user.UserId,
          };
        });
        newInvoiceBankAccounts = newInvoiceBankAccounts.filter(
          (bankAcc) => bankAcc.bankAccountId
        );
        const newData = { ...data.invoice };
        newData.invoiceDetails = newInvoiceDetails;
        newData.invoiceBankAccounts = newInvoiceBankAccounts;

        return this.invoicesService
          .createInvoice(newData, authState.user.UserId)
          .pipe(
            map((res: IINVOICE_DETAILS_RES) => {
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.store.dispatch(
                InvoicesActions.createInvoiceLoading({ payload: false })
              );

              if (res.succeeded) {
                const notification: Notification = {
                  state: 'success',
                  message: `Invoice created successfully ${
                    newData.sendMail ? 'and email sent' : ''
                  }`,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-success'
                );
                if (newData.sendMail) {
                  this.dialog.closeAll();
                  this.router.navigate([
                    `/app/calculator/quote/quote-invoice/${newData.applicationQuoteId}/loan/${res?.entity?.invoice?.id}`,
                  ]);
                }

                this.store.dispatch(
                  InvoicesActions.createInvoiceSuccess({
                    payload: true,
                    invoiceId: res?.entity?.invoice?.id,
                    invoiceQuotePDFURL:
                      res?.entity?.invoice?.invoiceQuotePDFURL,
                    countryFeeInvoiceQuotePDFURL:
                      res?.entity?.invoice?.countryFeeInvoiceQuotePDFURL,
                    localFeeInvoiceQuotePDFURL:
                      res?.entity?.invoice?.localFeeInvoiceQuotePDFURL,
                    signature: res?.entity?.invoice?.signature,
                  })
                );

                return {
                  type: '[Invoices] Create Invoice Success',
                };
              } else {
                this.store.dispatch(
                  GeneralActions.IsLoading({ payload: false })
                );
                this.store.dispatch(
                  InvoicesActions.createInvoiceSuccess({ payload: false })
                );
                const notification: Notification = {
                  state: 'error',
                  message: res.message,
                };

                this.notificationService.openSnackBar(
                  notification,
                  'opt-notification-error'
                );

                return {
                  type: '[Invoices] Create Invoice Error',
                };
              }
            }),
            catchError((err: any) => {
              this.dialog.closeAll();
              this.store.dispatch(GeneralActions.IsLoading({ payload: false }));
              this.store.dispatch(
                InvoicesActions.createInvoiceLoading({ payload: false })
              );
              this.store.dispatch(InvoicesActions.createInvoiceFailure());

              return of(err);
            })
          );
      })
    );
  });

  GetInvoiceByApplicationQuoteId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoicesActions.GetInvoiceByApplicationQuoteId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getInvoiceByApplicationQuoteId(
            data.payload.id,
            authState.user.UserId,
            { skip: data.payload.skip, take: data.payload.take }
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                return InvoicesActions.SaveInvoiceByApplicationQuoteId({
                  payload: resData.entity,
                });
              } else {
                return InvoicesActions.SaveInvoiceByApplicationQuoteId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Invoice][CatchError] Failed To Get Invoice By Application Quote Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetInvoiceStatisticsByApplicationQuoteId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getInvoiceStatisticsByApplicationQuoteId(
            data.payload.applicationQuoteId,
            authState.user.UserId
          )
          .pipe(
            map((resData: any) => {
              if (resData.succeeded) {
                return InvoicesActions.SaveInvoiceStatisticsByApplicationQuoteId(
                  {
                    payload: resData.entity,
                  }
                );
              } else {
                return InvoicesActions.SaveInvoiceStatisticsByApplicationQuoteId(
                  {
                    payload: resData.entity ? resData.entity : null,
                  }
                );
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch({
                type: `[Invoice][CatchError] Failed To Get Invoice Statistics By Application Quote Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllApplicationInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getAllApplicantionInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllApplicationInvoice(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.applicationQuoteId!,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.pageCount) {
                return InvoicesActions.getAllApplicationInvoicesSuccess({
                  invoices: res,
                });
              } else if (res.succeeded && !res.entity.pageCount) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getAllApplicationInvoicesSuccess({
                  invoices: {
                    ...res,
                    entity: {
                      pageItems: res.entity,
                      pageCount: 1,
                      totalCount: 30,
                    },
                  },
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

                return InvoicesActions.getAllInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getAllInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  getAllPaidApplicationInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getAllPaidApplicantionInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllApplicationInvoice(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.applicationQuoteId!,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.pageCount) {
                return InvoicesActions.getAllPaidApplicantionSuccess({
                  invoices: res,
                });
              } else if (res.succeeded && !res.entity.pageCount) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getAllPaidApplicantionSuccess({
                  invoices: {
                    ...res,
                    entity: {
                      pageItems: res.entity,
                      pageCount: 1,
                      totalCount: 30,
                    },
                  },
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

                return InvoicesActions.getPaidInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(InvoicesActions.getPaidInvoicesFailure({ error: err }));
            })
          );
      })
    );
  });

  getAllOutstandingApplicationInvoices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.getAllOutstandingApplicantionInvoices),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getAllApplicationInvoice(
            authState.user.UserId,
            data.payload.skip,
            data.payload.take,
            data.payload.applicationQuoteId!,
            data.payload.paymentStatus
          )
          .pipe(
            map((res: IGET_INVOICE_RES | any) => {
              if (res.succeeded && res.entity.pageCount) {
                return InvoicesActions.getAllOutstandingApplicantionSuccess({
                  invoices: res,
                });
              } else if (res.succeeded && !res.entity.pageCount) {
                /**
                 * Mock endpoint data manipulation. Temporary fix
                 **/
                return InvoicesActions.getAllOutstandingApplicantionSuccess({
                  invoices: {
                    ...res,
                    entity: {
                      pageItems: res.entity,
                      pageCount: 1,
                      totalCount: 30,
                    },
                  },
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

                return InvoicesActions.getOutstandingInvoicesFailure({
                  error: res.message,
                });
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.getOutstandingInvoicesFailure({ error: err })
              );
            })
          );
      })
    );
  });

  getInvoiceStatistics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InvoicesActions.GetInvoiceStatisticsByApplicationQuoteId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.invoicesService
          .getInvoiceStatistics(
            authState.user.UserId,
            data.payload.applicationQuoteId
          )
          .pipe(
            map((res: any) => {
              if (res.succeeded) {
                return InvoicesActions.GetInvoiceStatisticsByApplicationQuoteIdSuccess(
                  {
                    statistics: res.entity,
                  }
                );
              } else {
                return InvoicesActions.GetInvoiceStatisticsByApplicationQuoteIdFail(
                  { error: res.message }
                );
              }
            }),
            catchError((err: any) => {
              return of(
                InvoicesActions.GetInvoiceStatisticsByApplicationQuoteIdFail({
                  error: err,
                })
              );
            })
          );
      })
    );
  });
}
