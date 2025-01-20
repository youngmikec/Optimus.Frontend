import { createReducer, on, Action } from '@ngrx/store';
import * as ProductsAction from './product.actions';

export interface State {
  isLoading: boolean;
  allProducts: any[] | null;
  allProductsByCountryId: any[] | null;
  singleProducts: any | null;
}

const initialState: State = {
  isLoading: false,
  allProducts: null,
  allProductsByCountryId: null,
  singleProducts: null,
};

const productsReducerInternal = createReducer(
  initialState,
  on(ProductsAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(ProductsAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(ProductsAction.SaveAllProducts, (state, { payload }) => ({
    ...state,
    allProducts: payload,
  })),
  on(ProductsAction.SaveAllProductsByCountryId, (state, { payload }) => ({
    ...state,
    allProductsByCountryId: payload,
  })),
  on(ProductsAction.SaveGetProductsById, (state, { payload }) => ({
    ...state,
    singleProducts: payload,
  }))
);

export function productsReducer(state: State | undefined, action: Action) {
  return productsReducerInternal(state, action);
}
