import { createReducer, on, Action } from '@ngrx/store';
import * as GeneralActions from './general.actions';
import { FeeType } from 'src/app/@components/webapp/admin-settings/country-setup/country-dashboard/migration-routes/migration-route-dashboard/route-fees/create-route-fees/create-route-fees.component';

export interface State {
  isLoading: boolean;
  allAccessLevels: any;
  countryCodes: any[] | null;
  familyGroups: any[] | null;
  familyTypes: any[] | null;
  questionResponseTypes: any[] | null;
  feeTypes: FeeType[] | null;
  feeBasis: any[] | null;
  allDeviceType: any[] | null;
}

const initialState: State = {
  isLoading: false,
  allAccessLevels: null,
  countryCodes: null,
  familyGroups: null,
  familyTypes: null,
  questionResponseTypes: null,
  feeTypes: [],
  feeBasis: null,
  allDeviceType: null,
};

const generalReducerInternal = createReducer(
  initialState,

  on(GeneralActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),

  on(GeneralActions.SaveAllAccessLevels, (state, { payload }) => ({
    ...state,
    allAccessLevels: payload,
  })),

  on(GeneralActions.SaveCountryCodes, (state, { payload }) => ({
    ...state,
    countryCodes: payload,
  })),
  on(GeneralActions.SaveFamilyGroups, (state, { payload }) => ({
    ...state,
    familyGroups: payload,
  })),
  on(GeneralActions.SaveFamilyTypes, (state, { payload }) => ({
    ...state,
    familyTypes: payload,
  })),
  on(GeneralActions.SaveQuestionResponseType, (state, { payload }) => ({
    ...state,
    questionResponseTypes: payload,
  })),
  on(GeneralActions.SaveFeeType, (state, { payload }) => ({
    ...state,
    feeTypes: payload,
  })),
  on(GeneralActions.SaveFeeBases, (state, { payload }) => ({
    ...state,
    feeBasis: payload,
  })),
  on(GeneralActions.SaveAllDeviceType, (state, { payload }) => ({
    ...state,
    allDeviceType: payload,
  }))
);

export function generalReducer(state: State | undefined, action: Action) {
  return generalReducerInternal(state, action);
}
