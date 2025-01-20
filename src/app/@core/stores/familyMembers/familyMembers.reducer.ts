import { createReducer, on, Action } from '@ngrx/store';
import * as FamilyMembersActions from './familyMembers.actions';

export interface State {
  isLoading: boolean;
  allFamilyMembers: any[] | null;
  allFamilyMembersByCountryId: any[] | null;
  activeFamilyMembersByCountryId: any[] | null;
  familyMember: any | null;
  applicationFamilyMembers: any[] | null;
  singleFamilyMember: any | null;
}

const initialState: State = {
  isLoading: false,
  allFamilyMembers: null,
  allFamilyMembersByCountryId: null,
  activeFamilyMembersByCountryId: null,
  familyMember: null,
  applicationFamilyMembers: null,
  singleFamilyMember: null,
};

const familyMemberReducerInternal = createReducer(
  initialState,
  on(FamilyMembersActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(FamilyMembersActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(FamilyMembersActions.SaveAllFamilyMembers, (state, { payload }) => ({
    ...state,
    allFamilyMembers: payload,
  })),
  on(
    FamilyMembersActions.SaveAllFamilyMembersByCountryId,
    (state, { payload }) => ({
      ...state,
      allFamilyMembersByCountryId: payload,
    })
  ),
  on(FamilyMembersActions.SaveActiveFamilyMembers, (state, { payload }) => ({
    ...state,
    activeFamilyMembersByCountryId: payload,
  })),
  on(
    FamilyMembersActions.getFamilyMembersByApplicationSuccess,
    (state, action) => ({
      ...state,
      applicationFamilyMembers: action.familyMembers,
    })
  )
);

export function familyMemberReducer(state: State | undefined, action: Action) {
  return familyMemberReducerInternal(state, action);
}
