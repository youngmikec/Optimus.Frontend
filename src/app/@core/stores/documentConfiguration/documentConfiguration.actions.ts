import { createAction, props } from '@ngrx/store';
import { IDocumentConfiguration } from '../../models/document-configuration.model';

export const ResetStore = createAction('[Document Configuration] Reset Store');

export const IsLoading = createAction('[Document Configuration] Is Loading');

export const CreateDocumentConfiguration = createAction(
  '[Document Configuration] Create Document Configuration',
  props<{
    payload: IDocumentConfiguration;
  }>()
);

export const EditDocumentConfiguration = createAction(
  '[Document Configuration] Document Configuration',
  props<{
    payload: IDocumentConfiguration;
  }>()
);

export const GetAllDocumentConfigurations = createAction(
  '[Document Configuration] Get All Document Configurations',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const GetAllActiveDocumentConfigurations = createAction(
  '[Document Configuration] Get All Active Document Configurations',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllDocumentConfigurations = createAction(
  '[Document Configuration] Save All Document Configuration',
  props<{
    payload: any[];
  }>()
);

export const SaveAllActiveDocumentConfigurations = createAction(
  '[Document Configuration] Save All Active Document Configuration',
  props<{
    payload: any[];
  }>()
);

export const GetDocumentConfigurationById = createAction(
  '[Document Configuration] Get Document Configuration By Id',
  props<{
    payload: {
      documentConfigurationId: number;
    };
  }>()
);

export const SaveDocumentConfigurationById = createAction(
  '[Document Configuration] Save Single Document Configuration',
  props<{
    payload: any;
  }>()
);

export const ActivateDocumentConfiguration = createAction(
  '[Document Configuration] Activate Document Configuration',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeactivateDocumentConfiguration = createAction(
  '[Document Configuration] Deactivate Document Configuration',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeleteDocumentConfiguration = createAction(
  '[Document Configuration] Delete Document Configuration',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);
