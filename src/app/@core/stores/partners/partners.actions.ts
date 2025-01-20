import { createAction, props } from '@ngrx/store';
import PartnerActionTypes from './actionTypes';
import {
  ICHANGE_PARTNER_STATUS,
  // IALL_PARTNERS,
  ICREATE_PARTNER,
  IEDIT_PARTNER,
  IEDIT_PARTNER_PAYLOAD,
  IGET_ALL_PARTNERS,
  IGET_ALL_PARTNERS_RESPONSE,
  IMULTIPLE_PARTNER_STATUS_UPDATE,
  // IPARTNER_PAGE_ITEMS,
} from '../../models/partners.model';

export const IsLoading = createAction(
  `${PartnerActionTypes.IS_LOADING}`,
  props<{
    payload: boolean;
  }>()
);

export const GetAllPartners = createAction(
  `${PartnerActionTypes.GET_ALL_PARTNERS}`,
  props<{
    payload: IGET_ALL_PARTNERS;
  }>()
);

export const SaveAllPartners = createAction(
  `${PartnerActionTypes.SAVE_ALL_PARTNERS}`,
  props<{
    payload: IGET_ALL_PARTNERS_RESPONSE;
  }>()
);

export const CreatePartner = createAction(
  `${PartnerActionTypes.CREATE_PARTNER}`,
  props<{
    payload: ICREATE_PARTNER;
  }>()
);

export const EditPartner = createAction(
  `${PartnerActionTypes.EDIT_PARTNER}`,
  props<{
    payload: IEDIT_PARTNER;
  }>()
);

export const GetPartnerByIdForEdit = createAction(
  '[Edit Partner] Get Partner By Id For Edit',
  props<{
    payload: IEDIT_PARTNER_PAYLOAD;
  }>()
);

export const ChangePartnerStatus = createAction(
  `${PartnerActionTypes.CHANGE_PARTNER_STATUS}`,
  props<{
    payload: ICHANGE_PARTNER_STATUS;
  }>()
);

export const ChangeMultiplePartnerStatus = createAction(
  `${PartnerActionTypes.CHANGE_MULTIPLE_PARTNER_STATUS}`,
  props<{
    payload: IMULTIPLE_PARTNER_STATUS_UPDATE;
  }>()
);
