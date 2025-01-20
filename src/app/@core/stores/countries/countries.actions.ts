import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[Countries] Reset Store');

export const IsLoading = createAction(
  '[Countries] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllCountry = createAction(
  '[Countries] Get All Country',
  props<{
    payload: {
      skip?: number;
      take?: number;
    };
  }>()
);

export const GetActiveCountries = createAction(
  '[Countries] Get Active Countries'
);

export const GetCountryById = createAction(
  '[Countries] Get Country By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetCountryDashboardById = createAction(
  '[Countries] Get Country Dashboard By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetCountryById = createAction(
  '[Countries] Save Get Country By ID',
  props<{
    payload: any;
  }>()
);

export const SaveGetCountryDashboardById = createAction(
  '[Countries] Save Get Country Dashboard By ID',
  props<{
    payload: any;
  }>()
);

export const SaveAllCountry = createAction(
  '[Countries] Save All Country',
  props<{
    payload: any;
  }>()
);

export const SaveActiveCountries = createAction(
  '[Countries] Save Active Countries',
  props<{
    payload: any;
  }>()
);

export const GetIsoCountries = createAction('[Countries] Get Iso Countries');

export const SaveIsoCountries = createAction(
  '[Countries] Save Iso Countryies',
  props<{
    payload: any;
  }>()
);

export const CreateCountry = createAction(
  '[Countries] Create Country',
  props<{
    payload: {
      name: string;
      currencyCode: string;
      countryCode: string;
      flagUrl: string;
      description: string;
      programType?: number;
      skip: number;
      take: number;
    };
  }>()
);

export const EditCountry = createAction(
  '[Countries] Edit Country',
  props<{
    payload: {
      id: number;
      name: string;
      currencyCode: string;
      countryCode: string;
      flagUrl: string;
      description: string;
      programType?: number;
      skip: number;
      take: number;
    };
  }>()
);

export const GetCountryProgramTypes = createAction(
  '[Contries] Country Program Types'
);

export const SaveGetCountryProgramTypes = createAction(
  '[Contries] Country Program Types Successful',
  props<{ payload: any }>()
);

export const ActivateCountry = createAction(
  '[Countries] Activate Country',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const DeactivateCountry = createAction(
  '[Countries] Deactivate Country',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const ClearCountryDashboardData = createAction(
  '[Countries] Clear Country Dashboard Data'
);

export const DeleteCountry = createAction(
  '[Countries] Delete Country',
  props<{
    payload: {
      id: number;
      skip?: number;
      take?: number;
    };
  }>()
);
