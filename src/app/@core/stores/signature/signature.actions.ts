import { createAction, props } from '@ngrx/store';

export interface SignatureInterface {
  userId: string;
  signature: string;
  id: number;
  name: string;
  createdByEmail: string;
  createdById: string;
  createdDate: Date;
  lastModifiedById: string;
  lastModifiedByEmail: string | null;
  lastModifiedDate: Date | null;
  status: number;
  statusDesc: string;
}

export const ResetStore = createAction('[Signature] Reset Store');

export const GetSignatureByUserId = createAction(
  '[Signature] Get Signature By ID'
);

export const SaveSignatureByUserId = createAction(
  '[Signature] Save Signature By ID',
  props<{
    payload: SignatureInterface[] | null;
  }>()
);

export const CreateSignature = createAction(
  '[Signature] Create Signature',
  props<{
    payload: {
      signature: string;
    };
  }>()
);

export const CreateSignatureSuccess = createAction(
  '[Signature] Create Signature Success',
  props<{
    payload: SignatureInterface;
  }>()
);

export const CreateSignatureError = createAction(
  '[Signature] Create Signature Error',
  props<{
    error: string;
  }>()
);

export const UpdateSignature = createAction(
  '[Signature] Update Signature',
  props<{
    payload: {
      id: number;
      signature: string;
    };
  }>()
);

export const UpdateSignatureSuccess = createAction(
  '[Signature] Update Signature Success',
  props<{
    payload: SignatureInterface;
  }>()
);

export const UpdateSignatureError = createAction(
  '[Signature] Update Signature Error',
  props<{
    error: string;
  }>()
);
