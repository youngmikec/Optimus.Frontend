import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromPartners from './partners.reducer';

const getPartnersState = (state: fromApp.AppState) => state.partners;

export const getPartnersIsLoading = createSelector(
  getPartnersState,
  (state: fromPartners.State) => state.isLoading
);

export const getAllPartners = createSelector(
  getPartnersState,
  (state: fromPartners.State) => state.allPartners
);
