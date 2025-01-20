import { createReducer, on, Action } from '@ngrx/store';
import * as ProductCategoryAction from './productCategory.actions';

export interface State {
  isLoading: boolean;
  allproductsCategory: any[] | null;
  allproductsCategoryByCountryId: any[] | null;
  singleproductsCategory: any | null;
}

const initialState: State = {
  isLoading: false,
  allproductsCategory: null,
  allproductsCategoryByCountryId: null,
  singleproductsCategory: null,
};

const productsCategoryReducerInternal = createReducer(
  initialState,
  on(ProductCategoryAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(ProductCategoryAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(ProductCategoryAction.SaveAllProductCategory, (state, { payload }) => ({
    ...state,
    allproductsCategory: payload,
  })),
  on(
    ProductCategoryAction.SaveAllProductCategoryByCountryId,
    (state, { payload }) => ({
      ...state,
      allproductsCategoryByCountryId: payload,
    })
  )
);

export function productsCategoryReducer(
  state: State | undefined,
  action: Action
) {
  return productsCategoryReducerInternal(state, action);
}
