import { createAction, props } from '@ngrx/store';

export const hcmApproveDocument = createAction(
  '[Document Support] Document Support Officer Approves Document',
  props<{ folderId: number; documentId: number; applicationPhaseId: number }>()
);

export const hcmRejectDocument = createAction(
  '[Document Support] Document Support Officer Rejects Document',
  props<{ folderId: number; documentId: number; applicationPhaseId: number }>()
);
