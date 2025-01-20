import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromQuoteCalculator from './quoteCalculator.reducer';

const getQuoteCalculatorState = (state: fromApp.AppState) =>
  state.quoteCalculator;

export const getQuoteCalculatorIsLoading = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.isLoading
);

export const getAllQuoteQuestions = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.quoteQuestions
);

export const QuoteDocIsUploaded = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.docIsUploaded
);

export const QuoteLoans = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.loan
);

export const CreatedScheduledPaymentPlanData = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.createdScheduledPaymentPlanData
);
export const IsPaymentPlanDataCreated = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.isPaymentPlanCreated
);

export const PaymentsPlanSchedule = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.loanPaymentsSchedule
);

export const PaymentsScheduleHistory = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.paymentsScheduleHistory
);

export const GetFinancialStatement = createSelector(
  getQuoteCalculatorState,
  (state: fromQuoteCalculator.State) => state.financialStatementUrl
);
