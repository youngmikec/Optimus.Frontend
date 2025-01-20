import { createAction, props } from '@ngrx/store';

export const daoApproveDocument = createAction(
  '[Document Audit] Document Audit Officer Approves Document',
  props<{ documentId: number; applicationPhaseId: number }>()
);

export const daoRejectDocument = createAction(
  '[Document Audit] Document Audit Officer Rejects Document',
  props<{ documentId: number; applicationPhaseId: number }>()
);

export const getPartners = createAction(
  '[Document Audit] Get List of Partners',
  props<{ skip: number; take: number }>()
);

export const getPartnersSuccess = createAction(
  '[Document Audit] Get List of Partners Successfully',
  props<{ partners: any[] }>()
);

export const submitToHOD = createAction(
  '[Document Audit] Submit Document Audit to HOD Officer',
  props<{ applicationId: number }>()
);

export const sendToPartner = createAction(
  '[Document Audit] Send Documents to Partnets',
  props<{ partnerDocuments: any; applicationId: number }>()
);
