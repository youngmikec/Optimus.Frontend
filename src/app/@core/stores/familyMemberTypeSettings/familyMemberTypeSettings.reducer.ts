import { createReducer, on, Action } from '@ngrx/store';
import * as FamilyMemberTypeSettingsActions from './familyMemberTypeSettings.actions';

export interface State {
  isLoading: boolean;
  allFamilyMemberTypeSettingsByCountryId: any[] | null;
}

const initialState: State = {
  isLoading: false,
  allFamilyMemberTypeSettingsByCountryId: null,
};

const familyMemberTypeSettingsReducerInternal = createReducer(
  initialState,
  on(FamilyMemberTypeSettingsActions.ResetStore, (state) => ({
    ...initialState,
  })),
  on(FamilyMemberTypeSettingsActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(
    FamilyMemberTypeSettingsActions.SaveAllFamilyMembersTypeSettingsByCountryId,
    (state, { payload }) => ({
      ...state,
      allFamilyMemberTypeSettingsByCountryId: payload,
    })
  )
);

export function familyMemberTypeSettingsReducer(
  state: State | undefined,
  action: Action
) {
  return familyMemberTypeSettingsReducerInternal(state, action);
}
