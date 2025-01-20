import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[ProductCategory] Reset Store');

export const IsLoading = createAction(
  '[ProductCategory] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllProductCategory = createAction(
  '[ProductCategory] Get All Product Category'
);

export const GetAllProductCategoryByCountryId = createAction(
  '[ProductCategory] Get All Product Category By Country Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllProductCategory = createAction(
  '[ProductCategory] Save All Product Category',
  props<{
    payload: any;
  }>()
);

export const SaveAllProductCategoryByCountryId = createAction(
  '[ProductCategory] Save All Product Category By Country Id',
  props<{
    payload: any;
  }>()
);

export const GetProductCategoryById = createAction(
  '[ProductCategory] Get Product Category By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetProductCategoryById = createAction(
  '[ProductCategory] Save Get Product Category By ID',
  props<{
    payload: any;
  }>()
);

export const CreateProductCategory = createAction(
  '[ProductCategory] Create Product Category',
  props<{
    payload: {
      countryId: number;
      name: string;
      description: string;
      isDefault: boolean;
    };
  }>()
);

export const EditProductCategory = createAction(
  '[ProductCategory] Edit Product Category',
  props<{
    payload: {
      id: number;
      countryId: number;
      name: string;
      description: string;
      isDefault: boolean;
    };
  }>()
);

export const ActivateProductCategory = createAction(
  '[ProductCategory] Activate Product Category',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const DeactivateProductCategory = createAction(
  '[ProductCategory] Deactivate Product Category',
  props<{
    payload: {
      id: number;
    };
  }>()
);
