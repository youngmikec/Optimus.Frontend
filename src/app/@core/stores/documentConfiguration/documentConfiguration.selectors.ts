import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromDocumentConfigurations from './documentConfiguration.reducer';

const getDocumentConfigurationsState = (state: fromApp.AppState) =>
  state.documentConfigurations;

export const getDocumentConfigurationsIsLoading = createSelector(
  getDocumentConfigurationsState,
  (state: fromDocumentConfigurations.State) => state.isLoading
);

export const getAllDocumentConfigurations = createSelector(
  getDocumentConfigurationsState,
  (state: fromDocumentConfigurations.State) => state.allDocumentConfigurations
);

export const getAllActiveDocumentConfigurations = createSelector(
  getDocumentConfigurationsState,
  (state: fromDocumentConfigurations.State) =>
    state.allActiveDocumentConfigurations
);

export const getDocumentConfigurationById = createSelector(
  getDocumentConfigurationsState,
  (state: fromDocumentConfigurations.State) => state.documentConfigurationById
);
