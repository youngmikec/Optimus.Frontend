import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth/auth.reducer';
import * as fromUsers from './users/users.reducer';
import * as fromPartners from './partners/partners.reducer';
import * as fromFeatures from './features/features.reducer';
import * as fromDocumentConfigurations from './documentConfiguration/documentConfiguration.reducer';
import * as fromRoles from './roles/roles.reducer';
import * as fromGeneral from './general/general.reducer';
import * as fromCountries from './countries/countries.reducer';
import * as fromFamily from './familyMembers/familyMembers.reducer';
import * as fromFamilyTypeSettings from './familyMemberTypeSettings/familyMemberTypeSettings.reducer';
import * as fromCurrency from './currency/currency.reducer';
import * as fromDepartments from './department/departments.reducer';
import * as fromMigrationRoutes from './migrationRoutes/migrationRoutes.reducer';
import * as fromProducts from './product/product.reducer';
import * as fromProductCategory from './productCategory/productCategory.reducer';
import * as fromRouteQuestion from './routeQuestions/routeQuestions.reducer';
import * as fromRouteFees from './routeFees/routeFees.reducer';
import * as fromInvoiceCurrencies from './invoiceCurrencies/invoiceCurrencies.reducer';
import * as fromApplicants from './applicants/applicants.reducer';
import * as fromDashboard from './dashboard/dashboard.reducer';
import * as fromPaymentPlans from './paymentPlan/paymentPlan.reducer';
import * as fromApplicationQuotes from './applicationQuotes/applicationQuotes.reducer';
import * as fromApplicantsDashboard from './applicantsDashboard/applicantDashboard.reducer';
import * as fromNotes from './notes/notes.reducers';
import * as fromInvoiceItemConfiguration from './invoiceItemConfiguration/invoiceItemConfiguration.reducer';
import * as fromComments from './comments/comments.reducers';
import * as fromSalesService from './sale-service/sale-service.reducer';
import * as fromDocumentCollection from './document-collection/document-collection.reducer';
import * as fromInvoices from './invoices/invoices.reducers';
import * as fromPhases from './phases/phase.reducers';
import * as fromQuoteCalculator from './quoteCalculator/quoteCalculator.reducer';
import * as fromApplicationPhase from './applicationPhase/application-phase.reducers';
import * as fromDocumentProcessing from './document-processing/document-processing.reducers';
import * as fromSignature from './signature/signature.reducer';
import * as fromDocumentSupport from './document-support/document-support.reducers';
import * as fromDocumentAudit from './document-audit/document-audit.reducers';
import * as fromDiscounts from './discount/discount.reducer';
import * as fromTableView from './table-view/table-view.reducers';
import * as fromNotifications from './notifications/notifications.reducers';

export interface AppState {
  auth: fromAuth.State;
  users: fromUsers.State;
  partners: fromPartners.State;
  features: fromFeatures.State;
  documentConfigurations: fromDocumentConfigurations.State;
  roles: fromRoles.State;
  general: fromGeneral.State;
  countries: fromCountries.State;
  family: fromFamily.State;
  currency: fromCurrency.State;
  departments: fromDepartments.State;
  migrationRoutes: fromMigrationRoutes.State;
  products: fromProducts.State;
  productCategory: fromProductCategory.State;
  routeQuestion: fromRouteQuestion.State;
  routeFee: fromRouteFees.State;
  invoiceCurrencies: fromInvoiceCurrencies.State;
  applicants: fromApplicants.State;
  dashboard: fromDashboard.State;
  paymentPlans: fromPaymentPlans.State;
  familyMemberTypeSettings: fromFamilyTypeSettings.State;
  applicationQuotes: fromApplicationQuotes.State;
  applicantsDashboard: fromApplicantsDashboard.State;
  notes: fromNotes.State;
  invoiceItemConfiguration: fromInvoiceItemConfiguration.State;
  comments: fromComments.State;
  saleService: fromSalesService.State;
  documentCollection: fromDocumentCollection.State;
  invoices: fromInvoices.State;
  phases: fromPhases.State;
  quoteCalculator: fromQuoteCalculator.State;
  applicationPhase: fromApplicationPhase.State;
  documentProcessing: fromDocumentProcessing.State;
  signature: fromSignature.State;
  documentSupport: fromDocumentSupport.State;
  documentAudit: fromDocumentAudit.State;
  discounts: fromDiscounts.State;
  tableView: fromTableView.State;
  notifications: fromNotifications.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  users: fromUsers.usersReducer,
  partners: fromPartners.partnersReducer,
  features: fromFeatures.featuresReducer,
  documentConfigurations:
    fromDocumentConfigurations.documentConfigurationsReducer,
  roles: fromRoles.rolesReducer,
  general: fromGeneral.generalReducer,
  countries: fromCountries.countriesReducer,
  currency: fromCurrency.currencyReducer,
  family: fromFamily.familyMemberReducer,
  departments: fromDepartments.departmentsReducer,
  migrationRoutes: fromMigrationRoutes.migrationRouteReducer,
  products: fromProducts.productsReducer,
  productCategory: fromProductCategory.productsCategoryReducer,
  routeQuestion: fromRouteQuestion.routeQuestionReducer,
  routeFee: fromRouteFees.routeFeeReducer,
  invoiceCurrencies: fromInvoiceCurrencies.invoiceCurrenciesReducer,
  applicants: fromApplicants.applicantsReducer,
  dashboard: fromDashboard.DashboardReducer,
  paymentPlans: fromPaymentPlans.paymentPlansReducer,
  familyMemberTypeSettings:
    fromFamilyTypeSettings.familyMemberTypeSettingsReducer,
  applicationQuotes: fromApplicationQuotes.applicationQuotesReducer,
  applicantsDashboard: fromApplicantsDashboard.applicantsDashboardReducer,
  notes: fromNotes.noteReducer,
  invoiceItemConfiguration:
    fromInvoiceItemConfiguration.invoiceItemConfigurationReducer,
  comments: fromComments.commentsReducer,
  saleService: fromSalesService.SaleServiceReducer,
  documentCollection: fromDocumentCollection.documetCollectionReducer,
  invoices: fromInvoices.invoicesReducer,
  phases: fromPhases.phaseReducer,
  quoteCalculator: fromQuoteCalculator.QuoteCalculatorReducer,
  applicationPhase: fromApplicationPhase.applicationPhaseReducer,
  documentProcessing: fromDocumentProcessing.documetProcessingReducer,
  signature: fromSignature.signatureReducer,
  documentSupport: fromDocumentSupport.documetSupportReducer,
  documentAudit: fromDocumentAudit.documetAuditReducer,
  discounts: fromDiscounts.discountReducer,
  tableView: fromTableView.TableViewReducer,
  notifications: fromNotifications.notificationsReducer,
};
