import { Action, createReducer, on } from '@ngrx/store';
import * as DocumentAuditActions from './document-audit.action';

export interface State {
  partners: Array<[]>;
}

export const initialState: State = {
  partners: [],
};

export const documentAuditReducerInternal = createReducer(
  initialState,
  on(DocumentAuditActions.getPartnersSuccess, (state, action) => ({
    ...state,
    partners: action.partners,
  }))
);

export function documetAuditReducer(state: State | undefined, action: Action) {
  return documentAuditReducerInternal(state, action);
}
