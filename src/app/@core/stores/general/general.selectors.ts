import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromGeneral from './general.reducer';

const getGeneralState = (state: fromApp.AppState) => state.general;

export const getGeneralIsLoading = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.isLoading
);

export const getAllAccessLevels = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.allAccessLevels
);

export const getAllCountryCodes = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.countryCodes
);

export const getAllFamilyGroups = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.familyGroups
);

export const getAllFamilyTypes = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.familyTypes
);

export const getAllQuestionResponseType = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.questionResponseTypes
);

export const getAllFeeType = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.feeTypes
);

export const getAllFeeBasis = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.feeBasis
);

export const getAllDeviceType = createSelector(
  getGeneralState,
  (state: fromGeneral.State) => state.allDeviceType
);
