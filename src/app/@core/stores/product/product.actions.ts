import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Products] Reset Store');

export const IsLoading = createAction(
  '[Products] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllProducts = createAction('[Products] Get All Products');

export const GetAllProductsByCountryId = createAction(
  '[Products] Get All Products By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllProducts = createAction(
  '[Products] Save All Products',
  props<{
    payload: any;
  }>()
);

export const SaveAllProductsByCountryId = createAction(
  '[Products] Save All Products By Country Id',
  props<{
    payload: any;
  }>()
);

export const GetProductsById = createAction(
  '[Products] Get Products By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetProductsById = createAction(
  '[Products] Save Get Products By ID',
  props<{
    payload: any;
  }>()
);

export const CreateProducts = createAction(
  '[Products] Create Products',
  props<{
    payload: {
      name: string;
      description: string;
      productCategoryId: number;
    };
  }>()
);

export const EditProducts = createAction(
  '[Products] Edit Products',
  props<{
    payload: {
      id: number;
      name: string;
      description: string;
      productCategoryId: number;
    };
  }>()
);

export const ActivateProducts = createAction(
  '[Products] Activate Products',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const DeactivateProducts = createAction(
  '[Products] Deactivate Products',
  props<{
    payload: {
      id: number;
    };
  }>()
);
