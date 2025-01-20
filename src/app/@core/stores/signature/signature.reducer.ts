import { createReducer, on, Action } from '@ngrx/store';
import * as SignatureActions from './signature.actions';
import { SignatureInterface } from './signature.actions';

export interface State {
  isLoading: boolean;
  signatureByUser: SignatureInterface[] | null;
  createdSignature: SignatureInterface | null;
  updatedSignature: SignatureInterface | null;
}

const initialState: State = {
  isLoading: false,
  signatureByUser: null,
  createdSignature: null,
  updatedSignature: null,
};

const signatureReducerInternal = createReducer(
  initialState,
  on(SignatureActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(SignatureActions.SaveSignatureByUserId, (state, { payload }) => ({
    ...state,
    signatureByUser: payload,
  })),
  on(SignatureActions.CreateSignature, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(SignatureActions.CreateSignatureSuccess, (state, { payload }) => ({
    ...state,
    isLoading: false,
    createdSignature: payload,
  })),
  on(SignatureActions.CreateSignatureError, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(SignatureActions.UpdateSignature, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(SignatureActions.UpdateSignatureSuccess, (state, { payload }) => ({
    ...state,
    isLoading: false,
    updatedSignature: payload,
  })),
  on(SignatureActions.UpdateSignatureError, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export function signatureReducer(state: State | undefined, action: Action) {
  return signatureReducerInternal(state, action);
}
