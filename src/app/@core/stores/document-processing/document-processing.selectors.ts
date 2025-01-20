import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as DocumentProcessingReducer from './document-processing.reducers';

const selectDocumentProcessing = (state: fromApp.AppState) =>
  state.documentProcessing;

export const documentAnalyticsSelector = createSelector(
  selectDocumentProcessing,
  (state: DocumentProcessingReducer.State) => state.analytics
);
