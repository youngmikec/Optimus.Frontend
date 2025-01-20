import { createAction, props } from '@ngrx/store';
import SalesActionTypes from './sale-service.actionsTypes';
import { Guest } from '../../interfaces/meetingGuest.interface';
import {
  IACTIVITIES_BY_ID,
  IALL_OFFICERS_BY_ROLE,
  IEDIT_ASSIGNED_OFFICERS,
  IGET_SALES_OVERVIEW_DATA,
  IGetActivities,
  ILoanStatistics,
  ISaleLoanRequest,
  ISaleLoanRequestRes,
  ISalesOverViewPartialPageData,
} from '../../models/sales';
// import { IGET_ALL_SALES } from '../../models/sales';
// import { IGET_ALL_Sales-Service } from '../../models/Sales';

export const IsLoading = createAction(
  `${SalesActionTypes.IS_LOADING}`,
  props<{
    payload: boolean;
  }>()
);

/** Sale List */
export const GetSalesList = createAction(
  '[Sales-Service] Get Sales-Service List',
  props<{
    payload: {
      skip: number;
      take: number;
      startDate?: string;
      endDate?: string;
      countryId?: number;
      status?: string;
      assignmentStatus?: string;
    };
  }>()
);

export const SearchSalesList = createAction(
  '[Sales-Service] Get Searched Sales-Service List',
  props<{
    payload: {
      filter: string;
      skip: number;
      take: number;
    };
  }>()
);

export const SaveSaleList = createAction(
  '[Sales-Service] Save Sale List',
  props<{ payload: any }>()
);

export const SaveSearchedSaleList = createAction(
  '[Sales-Service] Save Searched Sale List',
  props<{ payload: any }>()
);

/** Sale Overview */
export const GetSaleOverview = createAction(
  '[Sales-Service] Get Sales Overview',
  props<any>()
);

export const GetSaleOverviewStatistics = createAction(
  '[Sales-Service] Get Sales Overview',
  props<{
    applicationQuoteId: number;
  }>()
);

export const GetSaleOverviewStatisticsSucess = createAction(
  '[Sales-Service] Get Sales Overview Successfully',
  props<{
    statistics: number;
  }>()
);

export const GetSaleOverviewStatisticsFailure = createAction(
  '[Sales-Service] Get Sales Overview Failed',
  props<{
    error: string;
  }>()
);

export const SaveSaleOverview = createAction(
  '[Sales-Service] Save Sale Overview',
  props<{ payload: any }>()
);

/** Sale Loans */
export const GetSaleLoans = createAction(
  '[Sales-Service] Get Sale Loans',
  props<{
    payload: {
      applicantId: number;
      applicationId: number;
      skip: number;
      take: number;
      startDate?: string | null;
      endDate?: string | null;
    };
  }>()
);

export const SaveSaleLoans = createAction(
  '[Sales-Service] Save Sale Loans',
  props<{ payload: any }>()
);

export const GetSaleLoanById = createAction(
  '[Sales-Service] Get Sale Loan By Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetInvoiceIdByQuoteId = createAction(
  '[Sales-Service] Get Invoice Id By Quote Id',
  props<{
    applicationQuoteId: number;
  }>()
);

export const GetInvoiceIdByQuoteIdSuccess = createAction(
  '[Sales-Service] Get Invoice Id By Quote Id Success',
  props<{
    payload: {
      invoiceId: number;
    };
  }>()
);

export const GetInvoiceIdByQuoteIdFailure = createAction(
  '[Sales-Service] Get Invoice Id By Quote Id Failure',
  props<{
    error: string;
  }>()
);

export const GetSaleLoanByApplicationQuoteId = createAction(
  '[Sales-Loan] Get Sale Loan By Application Quote Id',
  props<{
    payload: ISaleLoanRequest;
  }>()
);

export const GetSaleLoanByApplicationQuoteIdSuccess = createAction(
  '[Sales-Loan] Get Sale Loan By Application Quote Id Success',
  props<{
    payload: ISaleLoanRequestRes;
  }>()
);

export const GetSaleLoanByApplicationQuoteIdFailure = createAction(
  '[Sales-Loan] Get Sale Loan By Application Quote Id Failure',
  props<{
    error: string;
  }>()
);

export const GetSaleLoanStatisticsByInvoiceId = createAction(
  '[Sales-Loan] Get Sale Loan Statistics By Invoice Id',
  props<{
    payload: ISaleLoanRequest;
  }>()
);

export const GetSalesLoanStatisticsByInvoiceIdSuccess = createAction(
  '[Sales-Loan] Get Sale Loan statistics By Invoice Id Success',
  props<{
    payload: ILoanStatistics;
  }>()
);

export const GetSalesLoanStatisticsByInvoiceIdFailure = createAction(
  '[Sales-Loan] Get Sale Loan statistics By Invoice Id Failure',
  props<{
    error: string;
  }>()
);

export const SaveSaleLoanLoan = createAction(
  '[Sales-Service] Save Sale Loans',
  props<{ payload: any }>()
);

export const GetTotalLoanFilter = createAction(
  '[Sales-Service] Get Total Loan Filter',
  props<{
    payload: {
      applicantId: number;
    };
  }>()
);

export const SaveTotalLoanFilter = createAction(
  '[Sales-Service] Save Total Loan Filter',
  props<{
    payload: any;
  }>()
);

export const RequestLoan = createAction(
  '[Sales-Service] Request Loan',
  props<{
    payload: {
      description: string;
      applicationId: number;
      amount: number;
      name: string;
    };
  }>()
);

export const UpdateLoan = createAction(
  '[Sales-Service] Update Loan',
  props<{
    payload: {
      id: number;
      description: string;
      applicantId: number;
      approvalStatus: number;
      amount: number;
    };
  }>()
);

export const ApproveLoan = createAction(
  '[Sales-Service] Approve Loan',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      applicantId: number;
      applicationId: number;
      skip: number;
      take: number;
    };
  }>()
);

export const RejectLoan = createAction(
  '[Sales-Service] Reject Loan',
  props<{
    payload: {
      id: number;
    };
    paginationData: {
      applicantId: number;
      applicationId: number;
      skip: number;
      take: number;
    };
  }>()
);

export const GetAllLoansStatistics = createAction(
  '[Sales-Service] Get All Loans Statistics',
  props<{
    payload: {
      skip: number;
      take: number;
      startDate: string | null;
      endDate: string | null;
    };
  }>()
);

export const SaveAllLoansStatistics = createAction(
  '[Sales-Service] Save All Loans Statistics',
  props<{
    payload: any;
  }>()
);

/** Loan Repayment */
export const CreateLoanRepayment = createAction(
  '[Sales-Service] Create Loan Repayment',
  props<{
    payload: {
      LoanId: number;
      AmountPaid: number;
      TelexNumber: string;
      ProofOfPayment: File;
    };
  }>()
);

export const GetSaleLoanRepaymentById = createAction(
  '[Sales-Service] Get Sale Loan Repayment By Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

/** Sale Tasks */

export const GetAllTask = createAction(
  '[Sales-Service] Get All Task',
  props<{
    payload: {
      applicationId: number;
    };
  }>()
);

export const SaveTasks = createAction(
  '[Sales-Service] Save All Task',
  props<{ payload: any }>()
);

export const tasks = createAction(
  '[Sales-Service] Get All Active Task',
  props<{
    payload: {
      applicationId: number;
    };
  }>()
);

export const GetAllActiveTask = createAction(
  '[Sales-Service] Get All Active Task',
  props<{
    payload: {
      applicationId: number;
    };
  }>()
);

export const SaveActiveTasks = createAction(
  '[Sales-Service] Save All Task',
  props<{ payload: any }>()
);

export const AddTask = createAction(
  '[Sales-Service] Add task',
  props<{
    payload: {
      applicationId: number;
      assignedTo: string;
      title: string;
      dueDate: string;
      closeOnSuccess: boolean;
    };
  }>()
);

export const UpdateTask = createAction(
  '[Sales-Service] Update task',
  props<{
    payload: {
      assignedTo: string;
      title: string;
      dueDate: string;
      id: number;
      applicationId: number;
    };
  }>()
);

export const CancelTask = createAction(
  '[Sales-Service] Cancel Task',
  props<{
    payload: {
      id: number;
      applicationId: number;
    };
  }>()
);

export const MarkTaskAsDone = createAction(
  '[Sales-Service] Mark Task As Done',
  props<{
    payload: {
      id: number;
      applicationId: number;
    };
  }>()
);

/** Meetings */

export const GetAllMeetings = createAction('[Sales-Service] Get All Meetings');

export const GetAllMeetingsByApplicationId = createAction(
  '[Sales-Service] Get All Meetings',
  props<{ payload: { applicationId: number } }>()
);

export const SaveMeetings = createAction(
  '[Sales-Service] Save All Upcoming Meetings',
  props<{ payload: any }>()
);

export const CreateMeeting = createAction(
  '[Sales-Service] Create Meeting',
  props<{
    payload: {
      applicationId: string;
      title: string;
      startDate: string;
      endDate: string;
      location: string;
      fileAttachment?: File;
      meetingGuestRequests: Guest[] | string[];
      message?: string;
    };
  }>()
);

export const UpdateMeeting = createAction(
  '[Sales-Service] Update Meeting',
  props<{
    payload: {
      meetingId: number;
      title: string;
      startDate: string;
      endDate: string;
      location: string;
      fileAttachment?: File;
      meetingGuestRequests: Guest[];
      message?: string;
    };
  }>()
);

export const CancelMeeting = createAction(
  '[Sales-Service] Cancel Meeting',
  props<{
    payload: {
      meetingId: number;
      userId?: string;
    };
  }>()
);

export const GetSalesOverviewPartiaData = createAction(
  `${SalesActionTypes.GET_SALES_OVERVIEW_DATA}`,
  props<{
    payload: IGET_SALES_OVERVIEW_DATA;
  }>()
);

export const SaveSalesOverviewPartialData = createAction(
  `${SalesActionTypes.SAVE_OVERVIEW_PARTIAL_DATA}`,
  props<{
    payload: ISalesOverViewPartialPageData;
  }>()
);

export const GetActivities = createAction(
  `${SalesActionTypes.GET_ACTIVITIES}`,
  props<{
    payload: IGetActivities;
  }>()
);

export const GetActivitiesByApplicationId = createAction(
  `${SalesActionTypes.GET_ACTIVITIES}`,
  props<{
    payload: { id: number };
  }>()
);

export const GetActivitesSuccess = createAction(
  `${SalesActionTypes.GET_ACTIVITIES_SUCCESS}`,
  props<{
    activities: IACTIVITIES_BY_ID;
  }>()
);

export const GetActivitiesFailure = createAction(
  `${SalesActionTypes.GET_ACTIVITIES_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const MarkActivityAsDone = createAction(
  `${SalesActionTypes.MARK_ACTIVITY_AS_DONE}`,
  props<{
    payload: {
      id: number;
      status: number;
      applicationId: number;
    };
  }>()
);

export const MarkActivityAsDoneSuccess = createAction(
  `${SalesActionTypes.MARK_ACTIVITY_AS_DONE_SUCCESS}`
);

export const MarkActivityAsDoneFailure = createAction(
  `${SalesActionTypes.MARK_ACTIVITY_AS_DONE_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const GetAssignedOfficersByRole = createAction(
  `${SalesActionTypes.GET_OFFICERS_BY_ROLE}`,
  props<{
    officerRole: string;
  }>()
);

export const GetAssignedOfficersByRoleSuccess = createAction(
  `${SalesActionTypes.GET_OFFICERS_BY_ROLE_SUCCESS}`,
  props<{
    payload: IALL_OFFICERS_BY_ROLE[];
  }>()
);

export const GetAssignedOfficersByRoleFailure = createAction(
  `${SalesActionTypes.GET_OFFICERS_BY_ROLE_FAILURE}`,
  props<{
    error: string;
  }>()
);

export const EditAssignedOfficer = createAction(
  `${SalesActionTypes.EDIT_ASSIGNED_OFFICER}`,
  props<IEDIT_ASSIGNED_OFFICERS>()
);

export const EditAssignedOfficerSuccess = createAction(
  `${SalesActionTypes.EDIT_ASSIGNED_OFFICER_SUCCESS}`,
  props<{ message: string }>()
);

export const EditAssignedOfficerFailure = createAction(
  `${SalesActionTypes.EDIT_ASSIGNED_OFFICER_FAILURE}`,
  props<{ error: string }>()
);

export const GetMeetingTypes = createAction(
  '[Sales Service] Get Meeting types'
);

export const SaveMeetingTypes = createAction(
  '[Sales Service] Get Meeting types',
  props<{ payload: any }>()
);
