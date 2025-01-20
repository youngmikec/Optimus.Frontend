import { createReducer, on, Action } from '@ngrx/store';
import * as DocumentConfigurationsActions from './documentConfiguration.actions';

export interface State {
  isLoading: boolean;
  allDocumentConfigurations: any | null;
  allActiveDocumentConfigurations: any | null;
  documentConfigurationById: any | null;
}

const initialState: State = {
  isLoading: false,
  allDocumentConfigurations: null,
  allActiveDocumentConfigurations: null,
  documentConfigurationById: null,
};

const documentConfigurationsReducerInternal = createReducer(
  initialState,
  on(DocumentConfigurationsActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(DocumentConfigurationsActions.IsLoading, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    DocumentConfigurationsActions.SaveAllDocumentConfigurations,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      allDocumentConfigurations: payload,
    })
  ),
  on(
    DocumentConfigurationsActions.SaveAllActiveDocumentConfigurations,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      allActiveDocumentConfigurations: payload,
    })
  ),
  on(
    DocumentConfigurationsActions.GetDocumentConfigurationById,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      documentConfigurationById: payload,
    })
  )
);

export function documentConfigurationsReducer(
  state: State | undefined,
  action: Action
) {
  return documentConfigurationsReducerInternal(state, action);
}
