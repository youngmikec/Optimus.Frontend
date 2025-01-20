import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromSignature from './signature.reducer';

const getSignatureState = (state: fromApp.AppState) => state.signature;

export const getSignatureIsLoading = createSelector(
  getSignatureState,
  (state: fromSignature.State) => state.isLoading
);

export const getSignatureByUserId = createSelector(
  getSignatureState,
  (state: fromSignature.State) => state.signatureByUser
);

export const getCreatedSignature = createSelector(
  getSignatureState,
  (state: fromSignature.State) => state.createdSignature
);

export const getUpdatedSignature = createSelector(
  getSignatureState,
  (state: fromSignature.State) => state.updatedSignature
);
