import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as DocumentAuditReducer from './document-audit.reducers';

const selectDocumentAudit = (state: fromApp.AppState) => state.documentAudit;

export const partnersSelector = createSelector(
  selectDocumentAudit,
  (state: DocumentAuditReducer.State) => state.partners
);
