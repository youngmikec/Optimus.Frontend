import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromProductCategory from './productCategory.reducer';

const getProductCategoryState = (state: fromApp.AppState) =>
  state.productCategory;

export const getProductIsLoading = createSelector(
  getProductCategoryState,
  (state: fromProductCategory.State) => state.isLoading
);

export const getAllProductCategory = createSelector(
  getProductCategoryState,
  (state: fromProductCategory.State) => state.allproductsCategory
);

export const getAllProductCategoryByCountryId = createSelector(
  getProductCategoryState,
  (state: fromProductCategory.State) => state.allproductsCategoryByCountryId
);

export const getProductCategoryById = createSelector(
  getProductCategoryState,
  (state: fromProductCategory.State) => state.singleproductsCategory
);
