import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, of, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import * as ProductCategoryAction from './productCategory.actions';
import { Notification } from '../../interfaces/notification.interface';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
// import { DefaultPagination } from '../../enums/default-pagination.enum';

@Injectable()
export class ProductCategoryEffects {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  getAllProductCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCategoryAction.GetAllProductCategory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/getproductcategories/${authState.user.UserId}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ProductCategoryAction.SaveAllProductCategory({
                  payload: resData.entity,
                });
              } else {
                return ProductCategoryAction.SaveAllProductCategory({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Get All Product Category ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  getAllProductCategoryByCountryId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCategoryAction.GetAllProductCategoryByCountryId),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/getproductcategoriesbycountry/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ProductCategoryAction.SaveAllProductCategoryByCountryId({
                  payload: resData.entity,
                });
              } else {
                return ProductCategoryAction.SaveAllProductCategoryByCountryId({
                  payload: [],
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Get All Product Category ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  GetProductCategoryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCategoryAction.GetProductCategoryById),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .get<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/getproductcategorybyid/${authState.user.UserId}/${data.payload.id}`
          )
          .pipe(
            map((resData: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              if (resData.succeeded === true) {
                return ProductCategoryAction.SaveGetProductCategoryById({
                  payload: resData.entity,
                });
              } else {
                return ProductCategoryAction.SaveGetProductCategoryById({
                  payload: {},
                });
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Get All Product Category ${errorRes.message}`,
              });

              return of();
            })
          );
      })
    )
  );

  CreateProductCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductCategoryAction.CreateProductCategory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/create`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  ProductCategoryAction.GetAllProductCategoryByCountryId({
                    payload: { id: resData.entity.countryId },
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
                  type: '[ProductCategory] Create Product Category Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ProductCategoryAction.IsLoading({ payload: false })
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
                  type: '[ProductCategory] Failed To Create Product Category',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[Product Category][CatchError] Failed To Create Product Category ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  editProductCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductCategoryAction.EditProductCategory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/update`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.dialog.closeAll();
                this.store.dispatch(
                  ProductCategoryAction.GetAllProductCategoryByCountryId({
                    payload: { id: resData.entity.countryId },
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
                  type: '[ProductCategory] Update Product Category Was Succesfull',
                };
              } else {
                this.store.dispatch(
                  ProductCategoryAction.IsLoading({ payload: false })
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
                  type: '[ProductCategory] Failed To Update Product Category',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Update Product Category ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  activateProductCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductCategoryAction.ActivateProductCategory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/activateproductcategory`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ProductCategoryAction.GetAllProductCategoryByCountryId({
                    payload: { id: resData.entity.countryId },
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
                  type: '[ProductCategory] Product Category Activated Succesfully',
                };
              } else {
                this.store.dispatch(
                  ProductCategoryAction.IsLoading({ payload: false })
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
                  type: '[ProductCategory] Failed To Activate Product Category',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Activate Product Category ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });

  deactivateProductCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductCategoryAction.DeactivateProductCategory),
      withLatestFrom(this.store.select('auth')),
      switchMap(([data, authState]) => {
        return this.http
          .post<any>(
            `${environment.OptivaImmigrationUrl}/ProductCategories/deactivateproductcategory`,
            {
              ...data.payload,
              userId: authState.user.UserId,
            }
          )
          .pipe(
            map((resData) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: true })
              );

              if (resData.succeeded === true) {
                this.store.dispatch(
                  ProductCategoryAction.GetAllProductCategoryByCountryId({
                    payload: { id: resData.entity.countryId },
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
                  type: '[ProductCategory] Product Category Deactivated Succesfully',
                };
              } else {
                this.store.dispatch(
                  ProductCategoryAction.IsLoading({ payload: false })
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
                  type: '[ProductCategory] Failed To Deactivate Product Category',
                };
              }
            }),
            catchError((errorRes: any) => {
              this.store.dispatch(
                ProductCategoryAction.IsLoading({ payload: false })
              );

              this.store.dispatch({
                type: `[ProductCategory][CatchError] Failed To Deactivate Product Category ${errorRes}`,
              });

              return of(errorRes);
            })
          );
      })
    );
  });
}
