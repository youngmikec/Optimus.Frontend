import { Action, createReducer, on } from '@ngrx/store';
import * as DocumentCollectionActions from './document-collection.actions';
import { IASSIGNED_OFFICERS } from '../../models/sales';

export interface State {
  documentQuestionWithFamilyType: [];
  createdFamilyMemberDetails: boolean;
  createdDocumentParameters: boolean;
  documentParameters: [];
  applicationResponse: [];
  documentFolders: [];
  folderFiles: [];
  documentComments: [];
  documentVersionHistory: [];
  officers: IASSIGNED_OFFICERS[];
}

export const initialState: State = {
  documentQuestionWithFamilyType: [],
  createdFamilyMemberDetails: false,
  createdDocumentParameters: false,
  documentParameters: [],
  applicationResponse: [],
  documentFolders: [],
  folderFiles: [],
  documentComments: [],
  documentVersionHistory: [],
  officers: [],
};

export const documentCollectionReducerInternal = createReducer(
  initialState,
  on(
    DocumentCollectionActions.getDocumentQuestionWithFamilyTypeSuccess,
    (state, action) => ({
      ...state,
      documentQuestionWithFamilyType: action.documentQuestionsWithFamily,
    })
  ),

  on(
    DocumentCollectionActions.isFamilyMemberDetailsCreated,
    (state, action) => ({
      ...state,
      createdFamilyMemberDetails: action.isCreated,
    })
  ),

  on(
    DocumentCollectionActions.getDocumentParametersSuccess,
    (state, action) => ({
      ...state,
      documentParameters: action.documentParameters,
    })
  ),

  on(
    DocumentCollectionActions.isDocumentParametersCreated,
    (state, action) => ({
      ...state,
      createdDocumentParameters: action.isCreated,
    })
  ),

  on(DocumentCollectionActions.setDocumentFolders, (state, action) => ({
    ...state,
    documentFolders: action.folders,
  })),

  on(
    DocumentCollectionActions.getApplicationResponseSuccess,
    (state, action) => ({
      ...state,
      applicationResponse: action.applicationResponse,
    })
  ),

  on(
    DocumentCollectionActions.getDocumentFolderFilesSuccess,
    (state, action) => ({
      ...state,
      folderFiles: action.files,
    })
  ),

  on(DocumentCollectionActions.getDocumentCommentsSuccess, (state, action) => ({
    ...state,
    documentComments: action.documentComments,
  })),

  on(
    DocumentCollectionActions.getDocumentVersionHistorySuccess,
    (state, action) => ({
      ...state,
      documentVersionHistory: action.documentVersionHistory,
    })
  ),

  on(DocumentCollectionActions.getDocumentOfficersSuccess, (state, action) => ({
    ...state,
    officers: action.officers,
  }))
);

export function documetCollectionReducer(
  state: State | undefined,
  action: Action
) {
  return documentCollectionReducerInternal(state, action);
}
