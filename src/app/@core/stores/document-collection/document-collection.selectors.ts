import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as DocumentCollectionReducer from './document-collection.reducer';

const selectDocumentCollection = (state: fromApp.AppState) =>
  state.documentCollection;

export const documentQuestionWithFamilyTypeSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) =>
    state.documentQuestionWithFamilyType
);

export const createdFamilyMemberDetailsSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.createdFamilyMemberDetails
);

export const documentParameterSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.documentParameters
);

export const createdDocumentParametersSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.createdDocumentParameters
);

export const documentApplicationResponseSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.applicationResponse
);

export const documentFoldersSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.documentFolders
);

export const documentFolderFilesSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.folderFiles
);

export const documentCommentsSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.documentComments
);

export const documentVersionHistorySelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.documentVersionHistory
);

export const documentOfficersSelector = createSelector(
  selectDocumentCollection,
  (state: DocumentCollectionReducer.State) => state.officers
);
