import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as ProductsAction from './product.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class ProductsEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.GetAllProducts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Products/getproductcategories/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return ProductsAction.SaveAllProducts({
                  payload: resData.entity,
                });
              } else {
                return ProductsAction.SaveAllProducts({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Get All Products ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllProductsByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.GetAllProductsByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Products/getproductsbycountry/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return ProductsAction.SaveAllProductsByCountryId({
                  payload: resData.entity,
                });
              } else {
                return ProductsAction.SaveAllProductsByCountryId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Get All Products By Country Id ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetProductsById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.SaveGetProductsById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/Products/getproductcategorybyid/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              if (resData.succeeded === true) {
                return ProductsAction.SaveGetProductsById({
                  payload: resData.entity,
                });
              } else {
                return ProductsAction.SaveGetProductsById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Get All Products ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsAction.CreateProducts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Products/create`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                // console.log(resData);

                this.dialog.closeAll();
                // country Id Not coming back
                this.store.dispatch(
                  ProductsAction.GetAllProductsByCountryId({
                    payload: { id: resData.entity.productCategory.countryId },
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
                  type: '[Products] Create Products Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ProductsAction.IsLoading({ payload: false })
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
                  type: '[Products] Failed To Create Products',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Create Products ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsAction.EditProducts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(`${environment.OptivaImmigrationUrl}/Products/update`, {
            ...data.payload,
            userId: authState.user.UserId,
          })
          .pipe(
            map((resData) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                // console.log(resData);
                // country Id Not coming back
                this.store.dispatch(
                  ProductsAction.GetAllProductsByCountryId({
                    payload: { id: resData.entity.productCategory.countryId },
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
                  type: '[Products] Update Products Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ProductsAction.IsLoading({ payload: false })
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
                  type: '[Products] Failed To Update Products',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Update Products ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsAction.ActivateProducts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Products/activateproduct`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ProductsAction.GetAllProductsByCountryId({
                    payload: { id: resData.entity.productCategory.countryId },
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
                  type: '[Products] Products Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  ProductsAction.IsLoading({ payload: false })
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
                  type: '[Products] Failed To Activate Products',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Activate Products ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsAction.DeactivateProducts),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/Products/deactivateproduct`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: true }));

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ProductsAction.GetAllProductsByCountryId({
                    payload: { id: resData.entity.productCategory.countryId },
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
                  type: '[Products] Products Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  ProductsAction.IsLoading({ payload: false })
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
                  type: '[Products] Failed To Deactivate Products',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(ProductsAction.IsLoading({ payload: false }));

              this.store.dispatch({
                type: `[Products][CatchError] Failed To Deactivate Products ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
