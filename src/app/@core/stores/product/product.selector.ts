import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromProducts from './product.reducer';

const getProductState = (state: fromApp.AppState) => state.products;

export const getProductIsLoading = createSelector(
  getProductState,
  (state: fromProducts.State) => state.isLoading
);

export const getAllProduct = createSelector(
  getProductState,
  (state: fromProducts.State) => state.allProducts
);

export const getAllProductByCountryId = createSelector(
  getProductState,
  (state: fromProducts.State) => state.allProductsByCountryId
);

export const getProductById = createSelector(
  getProductState,
  (state: fromProducts.State) => state.singleProducts
);
