import { createAction, props } from '@ngrx/store';
import {
  IDocumentParameters,
  IFamilyMembers,
} from '../../models/document-collection.model';

export const getApplicationResponse = createAction(
  '[Document Collection] Get Document Application Response',
  props<{ applicationId: number }>()
);

export const getApplicationResponseSuccess = createAction(
  '[Document Collection] Get Document Application Response Success',
  props<{ applicationResponse: [] }>()
);

export const isFamilyMemberDetailsCreated = createAction(
  '[Document Collection] Created Family Member Details Loader',
  props<{ isCreated: boolean }>()
);

export const getDocumentQuestionWithFamilyType = createAction(
  '[Document Collection] Get Document Collection Question With Family Type',
  props<{ countryId: number; migrationRouteId: number }>()
);

export const getDocumentQuestionWithFamilyTypeSuccess = createAction(
  '[Document Collection] Get Document Collection Question With Family Type Success',
  props<{ documentQuestionsWithFamily: [] }>()
);

export const getDocumentParameters = createAction(
  '[Document Collection] Get Document Parameters',
  props<{ applicationId: number }>()
);

export const isDocumentParametersCreated = createAction(
  '[Document Collection] Created Document Parameters Loader',
  props<{ isCreated: boolean }>()
);

export const getDocumentParametersSuccess = createAction(
  '[Document Collection] Get Document Parameters Success',
  props<{ documentParameters: [] }>()
);

export const getDocumentFolderFiles = createAction(
  '[Document Collection] Get Document Folder Files',
  props<{ folderId: number }>()
);

export const getDocumentFolderFilesSuccess = createAction(
  '[Document Collection] Get Document Folder Files Success',
  props<{ files: [] }>()
);

export const uploadFamilyMemberDocument = createAction(
  '[Document Collection] Upload Family Member Document',
  props<{ folderId: number; document: File }>()
);

export const replaceFamilyMemberDocument = createAction(
  '[Document Collection] Replace Family Member Document',
  props<{ folderId: number; documentId: number; document: File }>()
);

export const setDocumentFolders = createAction(
  '[Document Collection] Get Document Folders',
  props<{ folders: [] }>()
);

export const saveApplicationFamilyMemberDetails = createAction(
  '[Document Collection] Save Application Family Member Details',
  props<{ payload: IFamilyMembers }>()
);

export const saveDocumentParameters = createAction(
  '[Document Collection] Save Document Parameters',
  props<{ payload: IDocumentParameters[] }>()
);

export const submitDocumentParameters = createAction(
  '[Document Collection] Submit Document Parameters',
  props<{ payload: IDocumentParameters[] }>()
);

export const getDocumentComments = createAction(
  '[Document Collection] Get Document Comments',
  props<{ documentId: number }>()
);

export const getDocumentCommentsSuccess = createAction(
  '[Document Collection] Get Document Comments Success',
  props<{ documentComments: [] }>()
);

export const createDocumentComment = createAction(
  '[Document Collection] Create Document Comments',
  props<{ documentId: number; comment: string }>()
);

export const getDocumentVersionHistory = createAction(
  '[Document Collection] Get Document Version History',
  props<{ documentId: number }>()
);

export const getDocumentVersionHistorySuccess = createAction(
  '[Document Collection] Get Document Version History Success',
  props<{ documentVersionHistory: [] }>()
);

export const completeDocumentCollation = createAction(
  '[Document Collection] Complete Document Collation',
  props<{ applicationId: number; documentId: number }>()
);

export const getDocumentOfficers = createAction(
  '[Document Collection] Get Assigned Officers',
  props<{ applicationId: number }>()
);

export const getDocumentOfficersSuccess = createAction(
  '[Document Collection] Get Assigned Officers Successfully',
  props<{ officers: [] }>()
);
