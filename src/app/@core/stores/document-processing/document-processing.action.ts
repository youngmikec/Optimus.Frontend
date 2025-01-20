import { createAction, props } from '@ngrx/store';

export const getDocumentAnalytics = createAction(
  '[Document Processing] Document Processing Analytics',
  props<{ applicationId: number }>()
);

export const getDocumentAnalyticsSuccess = createAction(
  '[Document Processing] Document Processing Analytics Successfully',
  props<{ analytics: {} }>()
);

export const cmaApproveDocument = createAction(
  '[Document Processing] Document Processing Officer Approves Document',
  props<{ folderId: number; documentId: number; applicationPhaseId: number }>()
);

export const cmaRejectDocument = createAction(
  '[Document Processing] Document Processing Officer Rejects Document',
  props<{ folderId: number; documentId: number; applicationPhaseId: number }>()
);

// export const dpoCompleteDocumentProcessing = createAction(
//   '[Document Processing] Document Processing Officer Rejects Document',
//   props<{ applicationId: number; documentId: number }>()
// );
