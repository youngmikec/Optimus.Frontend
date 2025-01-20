import { createAction, props } from '@ngrx/store';

export interface ApplicationResponseSchema {
  applicationId: number;
  routeQuestionId: number;
  responseValue: string;
  selectedOptions: Options[];
  isDeleted: boolean;
  id?: number;
  name: string;
  description: string;
  authorizationStatus?: number;
}

export interface CreateApplicationResponseSchema {
  applicationId: number;
  quoteNo: string;
  amount: number;
  requestDate: string;
  quoteStatus: number;
  quoteStatusDesc: string;
  application: string;
  quoteItems: any[] | null;
  recordKey: string;
  id: number;
  name: string;
  description: string;
  userId: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

interface Options {
  questionOptionId?: number;
  optionValue: string;
  isDeleted: boolean;
}

export const ResetStore = createAction('[ApplicationQuotes] Reset Store');

export const IsLoading = createAction(
  '[ApplicationQuotes] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const SuccessAction = createAction(
  '[ApplicationQuotes] Success Action',
  props<{
    payload: boolean;
  }>()
);

export const GetAllApplicationQuotes = createAction(
  '[ApplicationQuotes] Get All Application Quotes',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveAllApplicationQuotes = createAction(
  '[ApplicationQuotes] Save All Application Quotes',
  props<{
    payload: ApplicationResponseSchema[];
  }>()
);

export const GetApplicationQuoteById = createAction(
  '[ApplicationQuotes] Get Application Quote By id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveApplicationQuoteById = createAction(
  '[ApplicationQuotes] Save Application Quote By Id',
  props<{
    payload: ApplicationResponseSchema | null;
  }>()
);

export const GetAllApplicationQuotesByApplicantId = createAction(
  '[ApplicationQuotes] Get Application Quotes By Applicant Id',
  props<{
    applicantId: string;
  }>()
);

export const SaveAllApplicationQuotesByApplicantId = createAction(
  '[ApplicationQuotes] Save All Application Quotes By Applicant Id',
  props<{
    payload: ApplicationResponseSchema;
  }>()
);

export const CreateApplicationQuotes = createAction(
  '[ApplicationQuotes] Create Application Quotes',
  props<{
    payload: {
      requestId: string;
      applicationId: number;
      applicationResponses: ApplicationResponseSchema[];
      investmentTierId?: number;
      shouldApplyDiscount?: boolean;
    };
  }>()
);

export const UpdateApplicationQuotes = createAction(
  '[ApplicationQuotes] Update Application Quotes',
  props<{
    payload: {
      applicationId: number;
      applicationResponses: ApplicationResponseSchema[];
      investmentTierId?: number;
    };
  }>()
);

export const ActivateApplicationQuotes = createAction(
  '[ApplicationQuotes] Activate Application Quotes',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const DeactivateApplicationQuotes = createAction(
  '[ApplicationQuotes] Deactivate Application Quotes',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveApplicationQuotesCreateResponse = createAction(
  '[ApplicationQuotes] Save Application Quotes Create Response',
  props<{
    payload: CreateApplicationResponseSchema;
  }>()
);

export const CreateApplication = createAction(
  '[ApplicationQuotes] Create Application',
  props<{
    payload: {
      name: string;
      description: string;
      applicantId: number;
      migrationRouteId: number;
      rmId: string;
      applicationResponses: ApplicationResponseSchema[];
    };
  }>()
);

export const SaveCreatedApplication = createAction(
  '[Application] Save Created Application',
  props<{
    payload: any;
  }>()
);

export const DeleteApplicationQuote = createAction(
  '[Application] Delete Application Quote',
  props<{
    payload: {
      quoteId: number;
      skip?: number;
      take?: number;
    };
  }>()
);

export const ConfirmApplicationQuotes = createAction(
  '[ApplicationQuotes] Confirm Application Quote',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SendApplicationQuotesToEmail = createAction(
  '[ApplicationQuotes] Send Application Quotes To Email',
  props<{
    payload: {
      id: number;
      message?: string;
    };
  }>()
);

export const SaveApplicantsApplication = createAction(
  '[Application] Save Applicants Application',
  props<{
    payload: any;
  }>()
);

export const Clear = createAction(
  '[ApplicationQuotes] Clear Application Quotes'
);

export const GetApplicationQuotesAuthorizations = createAction(
  '[ApplicationQuotes] Get Application Quotes Authorizations',
  props<{
    payload: {
      skip: number;
      take: number;
    };
  }>()
);

export const SaveApplicationQuotesAuthorizations = createAction(
  '[ApplicationQuotes] Save Application Quotes Authorizations',
  props<{
    payload: any[];
  }>()
);

export const GetApplicationQuotesAuthorizationsSummary = createAction(
  '[ApplicationQuotes] Get Application Quotes Authorizations Summary'
);

export const SaveApplicationQuotesAuthorizationsSummary = createAction(
  '[ApplicationQuotes] Save Application Quotes Authorizations Summary',
  props<{
    payload: any | null;
  }>()
);

export const SaveApplicationQuotesAuthorizationsSummaryError = createAction(
  '[ApplicationQuotes] Save Application Quotes Authorizations Summary Error',
  props<{
    error: string;
  }>()
);

export const ApproveRejectRequest = createAction(
  '[ApplicationQuotes] Approve Reject Request',
  props<{
    payload: {
      authorizationRequestId: number;
      approvalStatus: 1 | 3; // Approved = 1 Declined = 3
      skip?: number;
      take?: number;
    };
  }>()
);

export const ClearApplicationQuoteById = createAction(
  '[ApplicationQuotes] Clear Application Quote By Id'
);
