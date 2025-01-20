import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromFamily from './familyMembers.reducer';

const getFamilyMemberState = (state: fromApp.AppState) => state.family;

export const getFamilyMembersIsLoading = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.isLoading
);

export const getAllFamilyMembers = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.allFamilyMembers
);

export const getAllFamilyMembersByCountryId = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.allFamilyMembersByCountryId
);

export const getActiveFamilyMembersByCountryId = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.activeFamilyMembersByCountryId
);

export const getApplicationsFamilyMembersSelector = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.applicationFamilyMembers
);
