import { createReducer, on, Action } from '@ngrx/store';
import * as PartnersActions from './partners.actions';
import {
  // IALL_PARTNERS,
  IGET_ALL_PARTNERS_RESPONSE,
} from '../../models/partners.model';
// import { IPartnerState } from '../../models/partners.model';

export interface State {
  isLoading: boolean;
  allPartners: IGET_ALL_PARTNERS_RESPONSE | null;
}

const initialState: State = {
  isLoading: false,
  allPartners: null,
};

const partnersReducerInternal = createReducer(
  initialState,
  on(PartnersActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(PartnersActions.SaveAllPartners, (state, { payload }) => ({
    ...state,
    allPartners: payload,
  }))
);

export function partnersReducer(state: State | undefined, action: Action) {
  return partnersReducerInternal(state, action);
}
