import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromFamily from './familyMemberTypeSettings.reducer';

const getFamilyMemberState = (state: fromApp.AppState) =>
  state.familyMemberTypeSettings;

export const getFamilyMembersIsLoading = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.isLoading
);

export const getAllFamilyMemberTypeSettingsByCountryId = createSelector(
  getFamilyMemberState,
  (state: fromFamily.State) => state.allFamilyMemberTypeSettingsByCountryId
);
