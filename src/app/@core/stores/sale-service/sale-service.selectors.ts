import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as fromSalesService from './sale-service.reducer';

export const getSaleServiceState = (state: fromApp.AppState) =>
  state.saleService;

export const getSaleList = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.salesList
);

export const searchSaleList = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.searchedList
);

export const getSalesOverview = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.salesOverview
);

export const getSaleLoans = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.loans
);

export const getTasks = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.tasks
);

export const getActiveTasks = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.activeTask
);

export const getMeetings = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.upcomingMeetings
);

export const getSalesOverviewPartial = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.salesOverviewPartial
);

export const getActivities = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.activities
);

export const getLoanFilters = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.loanFilter
);

export const getOfficersByRole = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.allOfficersByRole
);

export const getLoadingState = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.loading
);
export const getSaleLoansByApplicationQuoteId = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.saleLoan
);
export const getInvoiceIdByQuoteId = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.invoiceId
);
export const getSaleStatistics = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.statistics
);
export const getSalesLoanStatistics = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.loanStatistics
);

export const getAllLoansStats = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.allLoansStatistics
);

export const getAllMeetingTypes = createSelector(
  getSaleServiceState,
  (state: fromSalesService.State) => state.meetingTypes
);
