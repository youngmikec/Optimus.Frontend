import { createReducer, on, Action } from '@ngrx/store';
import * as SaleServiceActions from './sale-service.actions';
import {
  IACTIVITIES_BY_ID,
  IALL_OFFICERS_BY_ROLE,
  ILoanStatistics,
  ISalesOverViewPartialPageData,
} from '../../models/sales';

export interface State {
  loading: boolean;
  loans: any | null;
  loanFilter: any | null;
  saleLoan: any | null;
  loanStatistics: ILoanStatistics | null;
  invoiceId: number;
  allLoansStatistics: {
    totaloan: number;
    loanPaid: number;
    loanUnPaid: number;
    partiallyPaid: number;
    currentLoan: number;
  } | null;
  tasks: any | null;
  activeTask: any[] | null;
  salesList: any | null;
  searchedList: any | null;
  statistics: any;
  salesOverview: any | null;
  upcomingMeetings: any | null;
  activities: IACTIVITIES_BY_ID | null;
  allOfficersByRole: IALL_OFFICERS_BY_ROLE[] | null;
  editAssignedOfficer: string | null;
  salesOverviewPartial: ISalesOverViewPartialPageData | null;
  error: string | null;
  meetingTypes: any;
}

const initialState: State = {
  loading: false,
  loans: null,
  loanFilter: null,
  tasks: null,
  saleLoan: null,
  invoiceId: 0,
  loanStatistics: null,
  allLoansStatistics: null,
  activeTask: [],
  salesList: null,
  searchedList: null,
  statistics: {},
  salesOverview: null,
  upcomingMeetings: null,
  activities: null,
  allOfficersByRole: null,
  salesOverviewPartial: null,
  editAssignedOfficer: null,
  error: null,
  meetingTypes: null,
};

const saleServiceReducerInternal = createReducer(
  initialState,
  on(SaleServiceActions.IsLoading, (state, { payload }) => ({
    ...state,
    loading: payload,
  })),
  on(SaleServiceActions.SaveSaleList, (state, { payload }) => ({
    ...state,
    salesList: payload,
  })),
  on(SaleServiceActions.SaveSearchedSaleList, (state, { payload }) => ({
    ...state,
    searchedList: payload,
  })),
  on(SaleServiceActions.SaveSaleOverview, (state, { payload }) => ({
    ...state,
    salesOverview: payload,
  })),
  on(SaleServiceActions.SaveSaleLoans, (state, { payload }) => ({
    ...state,
    loans: payload,
  })),
  on(SaleServiceActions.SaveTasks, (state, { payload }) => ({
    ...state,
    tasks: payload,
  })),
  on(SaleServiceActions.SaveActiveTasks, (state, { payload }) => ({
    ...state,
    activeTask: payload,
  })),
  on(SaleServiceActions.SaveMeetings, (state, { payload }) => ({
    ...state,
    upcomingMeetings: payload,
  })),
  on(SaleServiceActions.SaveSalesOverviewPartialData, (state, { payload }) => ({
    ...state,
    salesOverviewPartial: payload,
  })),
  on(SaleServiceActions.GetActivitesSuccess, (state, action) => ({
    ...state,
    activities: action.activities,
  })),
  on(SaleServiceActions.GetActivitiesFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
  on(SaleServiceActions.SaveTotalLoanFilter, (state, { payload }) => ({
    ...state,
    loanFilter: payload,
  })),
  on(
    SaleServiceActions.GetAssignedOfficersByRoleSuccess,
    (state, { payload }) => ({
      ...state,
      allOfficersByRole: payload,
    })
  ),
  on(SaleServiceActions.EditAssignedOfficerSuccess, (state, action) => ({
    ...state,
    editAssignedOfficer: action.message,
  })),
  on(SaleServiceActions.EditAssignedOfficerFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
  on(SaleServiceActions.GetSaleLoanByApplicationQuoteId, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(
    SaleServiceActions.GetSaleLoanByApplicationQuoteIdSuccess,
    (state, action) => ({
      ...state,
      loading: false,
      saleLoan: action.payload.entity,
    })
  ),
  on(
    SaleServiceActions.GetSaleLoanByApplicationQuoteIdFailure,
    (state, action) => ({
      ...state,
      loading: false,
      error: action.error,
    })
  ),
  on(SaleServiceActions.GetInvoiceIdByQuoteId, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(SaleServiceActions.GetInvoiceIdByQuoteIdSuccess, (state, action) => ({
    ...state,
    loading: false,
    invoiceId: action.payload.invoiceId,
  })),
  on(SaleServiceActions.GetInvoiceIdByQuoteIdFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),
  on(SaleServiceActions.GetSaleOverviewStatisticsSucess, (state, action) => ({
    ...state,
    statistics: action.statistics,
  })),
  on(SaleServiceActions.GetSaleOverviewStatisticsFailure, (state, action) => ({
    ...state,
    statistics: {},
    error: action.error,
  })),
  on(SaleServiceActions.GetSaleLoanStatisticsByInvoiceId, (state, action) => ({
    ...state,
    loading: false,
  })),
  on(
    SaleServiceActions.GetSalesLoanStatisticsByInvoiceIdSuccess,
    (state, action) => ({
      ...state,
      loanStatistics: action.payload,
    })
  ),
  on(
    SaleServiceActions.GetSalesLoanStatisticsByInvoiceIdFailure,
    (state, action) => ({
      ...state,
      statistics: {},
      error: action.error,
    })
  ),
  on(SaleServiceActions.GetSaleLoans, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(SaleServiceActions.GetAllLoansStatistics, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(SaleServiceActions.SaveAllLoansStatistics, (state, action) => ({
    ...state,
    loading: false,
    allLoansStatistics: action.payload,
  })),
  on(SaleServiceActions.SaveMeetingTypes, (state, { payload }) => ({
    ...state,
    meetingTypes: payload,
  }))
);

export function SaleServiceReducer(state: State | undefined, action: Action) {
  return saleServiceReducerInternal(state, action);
}
