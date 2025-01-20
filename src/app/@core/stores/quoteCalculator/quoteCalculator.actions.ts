import { createAction, props } from '@ngrx/store';
import { QuoteQuestionInterface } from '../../interfaces/quoteCalculator.interface';
import { IUploadDocQuoteCalc } from '../../models/sales';
import {
  IGetLoanPaymentsSchedulePayload,
  IGetLoanPaymentsScheduleResponse,
  IInterestOverrideRequest,
  ILoanData,
  ILoanRequest,
  // ILoanRequestRes,
  ISchedulePaymentPlan,
  PaymentScheduleHistory,
} from '../../models/quote-calculator.model';

export const ResetStore = createAction('[QuoteCalculator] Reset Store');

export const IsLoading = createAction(
  '[QuoteCalculator] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllQuoteQuestions = createAction(
  '[QuoteCalculator] Get All Quote Calculator Questions'
);

export const SaveAllQuoteQuestions = createAction(
  '[QuoteCalculator] Save All Quote Calculator Questions',
  props<{
    payload: QuoteQuestionInterface[];
  }>()
);

export const AddQuestionToQuoteQuestion = createAction(
  '[QuoteCalculator] Add Question To Quote Calculator',
  props<{ question: QuoteQuestionInterface }>()
);

export const RemoveQuestionToQuoteQuestion = createAction(
  '[QuoteCalculator] Remove Question To Quote Calculator',
  props<{ question: QuoteQuestionInterface }>()
);

export const RemoveLastQuestionInQuoteQuestion = createAction(
  '[QuoteCalculator] Remove Last Question In Quote Calculator'
);

export const ClearQuoteQuestion = createAction(
  '[QuoteCalculator] Clear Quote Calculator'
);

export const SetQuestionsToQuoteQuestion = createAction(
  '[QuoteCalculator] Add Questions To Quote Calculator',
  props<{ questions: QuoteQuestionInterface[] }>()
);

export const UploadDocument = createAction(
  '[QuoteCalculator] Request Authorisation',
  props<{
    payload: IUploadDocQuoteCalc;
  }>()
);

export const UploadDocumentSuccess = createAction(
  '[QuoteCalculator] Request Authorisation Success',
  props<{
    isUploaded: boolean;
  }>()
);

export const UploadDocumentFailure = createAction(
  '[QuoteCalculator] Request Authorisation Failure',
  props<{
    error: string;
  }>()
);

export const getLoanRequest = createAction(
  '[Quote Calculator] Get Loan Request',
  props<{
    payload: ILoanRequest;
  }>()
);

export const getLoanRequestSuccess = createAction(
  '[Quote Calculator] Get Loan Request Success',
  props<{
    payload: ILoanData;
  }>()
);

export const getLoanRequestFailure = createAction(
  '[Quote Calculator] Get Loan Request Failure',
  props<{
    error: string;
  }>()
);

export const overrideIntrRequest = createAction(
  '[Quote Calculator] Request Interest Override',
  props<{
    payload: IInterestOverrideRequest;
  }>()
);

export const overrideIntrRequestSuccess = createAction(
  '[Quote Calculator] Request Interest Override Success'
);

export const overrideIntrRequestFailure = createAction(
  '[Quote Calculator] Request Interest Override Failure',
  props<{
    error: string;
  }>()
);

export const getPaymentsSchedule = createAction(
  '[Quote Calculator] Get Payment Plan Schedule',
  props<{
    payload: IGetLoanPaymentsSchedulePayload;
  }>()
);

export const getPaymentsScheduleSuccess = createAction(
  '[Quote Calculator] Get Payment Plan Schedule Success',
  props<{
    payload: IGetLoanPaymentsScheduleResponse['entity'];
  }>()
);

export const getPaymentsScheduleFailure = createAction(
  '[Quote Calculator] Get Payment Plan Schedule Failure'
);

export const getPaymentsScheduleHistory = createAction(
  '[Quote Calculator] Get Payment Schedule History',
  props<{
    payload: { userId: string; paymentscheduleId: number };
  }>()
);

export const getPaymentsScheduleHistorySuccess = createAction(
  '[Quote Calculator] Get Payment Plan Schedule History Success',
  props<{
    payload: PaymentScheduleHistory[] | null;
  }>()
);

export const getPaymentsScheduleHistoryFailure = createAction(
  '[Quote Calculator] Get Payment Plan Schedule History Failure'
);

export const updatePaymentsScheduleHistory = createAction(
  '[Quote Calculator] Update Payment Schedule History',
  props<{
    payload: {
      userId: string;
      id: number;
      paymentStatus: number;
      paymentSchdeuleId: number;
    };
  }>()
);

export const updatePaymentsScheduleHistorySuccess = createAction(
  '[Quote Calculator] Update Payment Plan Schedule History Success',
  props<{
    payload: any | null;
  }>()
);

export const updatePaymentsScheduleHistoryFailure = createAction(
  '[Quote Calculator] Update Payment Plan Schedule History Failure'
);

export const schedulePaymentPlan = createAction(
  '[Quote Calculator] Schedule Payment Plan',
  props<{
    payload: ISchedulePaymentPlan;
    invoiceId: number;
    applicationQuoteId?: number;
  }>()
);

export const schedulePaymentPlanSuccess = createAction(
  '[Quote Calculator] Schedule Payment Plan Success',
  props<{
    payload: any;
  }>()
);

export const schedulePaymentPlanFailure = createAction(
  '[Quote Calculator] Schedule Payment Plan Failure',
  props<{
    error: string;
  }>()
);

/** ENDPOINT **/

export const updatePaymentsPlan = createAction(
  '[Quote Calculator] Update Payment Plan',
  props<{
    payload: ISchedulePaymentPlan;
    invoiceId: number;
    applicationQuoteId?: number;
  }>()
);

export const updatePaymentsPlanSuccess = createAction(
  '[Quote Calculator] Update Payment Plan Success',
  props<{
    payload: any;
  }>()
);

export const updatePaymentsPlanFailure = createAction(
  '[Quote Calculator] Update Payment Plan Failure',
  props<{
    error: string;
  }>()
);

export const CreateLoanPaymentHistory = createAction(
  '[Quote Calculator] Create Loan Payment History',
  props<{
    payload: {
      userId: string;
      amountPaid: number;
      paymentScheduleId: number;
      document: File;
      // TelexNumber: string;
    };
  }>()
);

/** ENDPOINT **/

export const clearCreatedSchedulePaymentPlan = createAction(
  '[Quote Calculator] Clear Schedule Payment Plan Data'
);

export const GenerateFinancialStatement = createAction(
  '[Quote Calculator] Generate Financial Statement',
  props<{
    applicationQuoteId: number;
    invoiceLoanId?: number;
  }>()
);

export const GenerateFinancialStatementSuccess = createAction(
  '[Quote Calculator] Generate Financial Statement success',
  props<{
    pdfUrl: string | undefined;
  }>()
);
