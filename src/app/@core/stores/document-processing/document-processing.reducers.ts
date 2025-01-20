import { Action, createReducer, on } from '@ngrx/store';
import * as DocumentProcessingActions from './document-processing.action';

export interface State {
  analytics: object;
}

export const initialState: State = {
  analytics: {},
};

export const documentProcessingReducerInternal = createReducer(
  initialState,
  on(
    DocumentProcessingActions.getDocumentAnalyticsSuccess,
    (state, action) => ({
      ...state,
      analytics: action.analytics,
    })
  )
);

export function documetProcessingReducer(
  state: State | undefined,
  action: Action
) {
  return documentProcessingReducerInternal(state, action);
}
