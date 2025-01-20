import { createReducer, on, Action } from '@ngrx/store';
import * as QuoteCalculatorAction from './quoteCalculator.actions';
import { QuoteQuestionInterface } from '../../interfaces/quoteCalculator.interface';
import {
  IGetLoanPaymentsScheduleResponse,
  ILoanData,
  PaymentScheduleHistory,
} from '../../models/quote-calculator.model';

export interface State {
  isLoading: boolean;
  quoteQuestions: QuoteQuestionInterface[] | null;
  docIsUploaded: boolean;
  // loan: {
  //   totalLoan: number;
  //   outstandingLoan: number;
  //   repaidLoan: number;
  //   data: ILoanData;
  // } | null;
  loan: ILoanData | null;
  error: string | null;
  isPaymentPlanCreated: boolean;
  createdScheduledPaymentPlanData: any | null;
  loanPaymentsSchedule: IGetLoanPaymentsScheduleResponse['entity'] | null;
  paymentsScheduleHistory: PaymentScheduleHistory[] | null;
  financialStatementUrl: string | undefined;
}

const initialState: State = {
  isLoading: false,
  quoteQuestions: null,
  docIsUploaded: false,
  loan: null,
  error: null,
  isPaymentPlanCreated: false,
  createdScheduledPaymentPlanData: null,
  loanPaymentsSchedule: null,
  paymentsScheduleHistory: null,
  financialStatementUrl: '',
};

const QuoteCalculatorReducerInternal = createReducer(
  initialState,
  on(QuoteCalculatorAction.ResetStore, (state) => ({
    ...initialState,
  })),
  on(QuoteCalculatorAction.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(QuoteCalculatorAction.SaveAllQuoteQuestions, (state, { payload }) => ({
    ...state,
    quoteQuestions: payload,
  })),
  on(
    QuoteCalculatorAction.AddQuestionToQuoteQuestion,
    (state, { question }) => {
      let questions = [];
      if (state.quoteQuestions) {
        const prevQuestionIndex: number = state.quoteQuestions.findIndex(
          (value: QuoteQuestionInterface) =>
            value.question === question.question
        );
        if (prevQuestionIndex >= 0) {
          questions = [...state.quoteQuestions];
          questions[prevQuestionIndex] = question;
        } else {
          questions = [...state.quoteQuestions, question];
        }
      } else {
        questions = [question];
      }
      return {
        ...state,
        quoteQuestions: questions,
      };
    }
  ),
  // on(
  //   QuoteCalculatorAction.AddQuestionToQuoteQuestion,
  //   (state, { question }) => ({
  //     ...state,
  //     quoteQuestions: state.quoteQuestions
  //       ? [...state.quoteQuestions, question]
  //       : [question],
  //   })
  // ),
  on(
    QuoteCalculatorAction.RemoveQuestionToQuoteQuestion,
    (state, { question }) => ({
      ...state,
      quoteQuestions: state.quoteQuestions
        ? state.quoteQuestions?.filter(
            (quoteQuestion) => quoteQuestion.id !== question.id
          )
        : [],
    })
  ),
  on(QuoteCalculatorAction.RemoveLastQuestionInQuoteQuestion, (state) => ({
    ...state,
    quoteQuestions: state.quoteQuestions
      ? state.quoteQuestions.slice(0, -1)
      : [],
  })),
  on(
    QuoteCalculatorAction.SetQuestionsToQuoteQuestion,
    (state, { questions }) => ({
      ...state,
      quoteQuestions: questions,
    })
  ),
  on(QuoteCalculatorAction.ClearQuoteQuestion, (state) => ({
    ...state,
    quoteQuestions: null,
  })),
  on(QuoteCalculatorAction.getLoanRequestSuccess, (state, action) => ({
    ...state,
    loan: action.payload,
  })),
  on(QuoteCalculatorAction.UploadDocumentSuccess, (state, action) => ({
    ...state,
    docIsUploaded: action.isUploaded,
  })),
  on(QuoteCalculatorAction.UploadDocumentFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),

  on(QuoteCalculatorAction.schedulePaymentPlan, (state) => ({
    ...state,
    isLoading: true,
    createdScheduledPaymentPlanData: null,
  })),
  on(QuoteCalculatorAction.schedulePaymentPlanSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isPaymentPlanCreated: true,
    // createdScheduledPaymentPlanData: action.payload,
  })),
  on(QuoteCalculatorAction.schedulePaymentPlanFailure, (state) => ({
    ...state,
    isLoading: false,
    isPaymentPlanCreated: false,
    createdScheduledPaymentPlanData: null,
  })),
  on(QuoteCalculatorAction.clearCreatedSchedulePaymentPlan, (state) => ({
    ...state,
    isLoading: false,
    createdScheduledPaymentPlanData: null,
  })),
  //
  on(QuoteCalculatorAction.updatePaymentsPlan, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(QuoteCalculatorAction.updatePaymentsPlanSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(QuoteCalculatorAction.updatePaymentsPlanFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  //
  on(QuoteCalculatorAction.getPaymentsSchedule, (state) => ({
    ...state,
    isLoading: true,
    loanPaymentsSchedule: null,
  })),
  on(QuoteCalculatorAction.getPaymentsScheduleSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    loanPaymentsSchedule: action.payload,
  })),
  on(QuoteCalculatorAction.getPaymentsScheduleFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  //
  on(QuoteCalculatorAction.getPaymentsScheduleHistory, (state) => ({
    ...state,
    paymentsScheduleHistory: null,
  })),
  on(
    QuoteCalculatorAction.getPaymentsScheduleHistorySuccess,
    (state, action) => ({
      ...state,
      paymentsScheduleHistory: action.payload,
    })
  ),
  on(QuoteCalculatorAction.getPaymentsScheduleHistoryFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(QuoteCalculatorAction.GenerateFinancialStatement, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    QuoteCalculatorAction.GenerateFinancialStatementSuccess,
    (state, payload) => ({
      ...state,
      isLoading: false,
      financialStatementUrl: payload.pdfUrl,
    })
  )
);

export function QuoteCalculatorReducer(
  state: State | undefined,
  action: Action
) {
  return QuoteCalculatorReducerInternal(state, action);
}
