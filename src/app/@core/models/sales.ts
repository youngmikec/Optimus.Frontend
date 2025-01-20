import { InvoiceInterface } from '../stores/invoices/invoices.actionTypes';
import { ILoan } from './quote-calculator.model';

export interface IGET_ALL_SALES {
  userId: string;
  applicationId: number;
}

export interface IGET_SALES_OVERVIEW_DATA {
  userid: number;
}

export interface IGET_TOTAL_PAID_INVOICES_RES {
  succeeded: boolean;
  entity: number;
  error: string | string[] | null;
  exceptionError: string | string[] | null;
  message: string;
}

export interface IGET_PHASES_RES {
  succeeded: boolean;
  entity: number;
  error: string | string[] | null;
  exceptionError: string | string[] | null;
  message: string;
}

export interface IGET_APPLICANT_BY_ID_RES {
  succeeded: boolean;
  entity: number;
  error: string | string[] | null;
  exceptionError: string | string[] | null;
  message: string;
}

export interface IGET_ASSIGNED_OFFICER_ACTIVITIES_RES {
  succeeded: boolean;
  entity: number;
  error: string | string[] | null;
  exceptionError: string | string[] | null;
  message: string;
}

export interface ISalesOverViewPartialPageData {
  totalApplicationFee: string;
  applicationStatusDesc: string;
  totalLoanAmount: string;
  activityStatus: number;
  phases: {
    onboarding: number;
    documentCollation: number;
    documentProcessing: number;
    documentSupport: number;
    documentAudit: number;
  };
  activities?: IActivities[];
  assignedOfficers?: IAssignedOfficer[];
}

export interface IActivities {
  title: string;
  document: string;
  done: boolean;
}

export interface IAssignedOfficer {
  dsoOne: string;
  dsoTwo: string;
}

export interface IGetActivities {
  id: number;
}

export interface IGET_ALL_ACTIVITIES_BY_ID_RES {
  succeeded: boolean;
  entity: IACTIVITIES_BY_ID;
  error: null;
  exceptionError: string;
  message: string;
}

export interface IACTIVITIES_BY_ID {
  progress: number;
  query: IALL_ACTIVITIES_DATA[];
}

export interface IALL_ACTIVITIES_DATA {
  documentActivity: string;
  id: number;
  status: number;
  name: string;
}

export interface IGET_ALL_OFFICERS_BY_ROLE_RES {
  succeeded: boolean;
  entity: IALL_OFFICERS_BY_ROLE[];
  permissions: null;
  message: string;
  messages: string | string[];
}

export interface IALL_OFFICERS_BY_ROLE {
  userId: string;
  subscriberId: number;
  subscribed: string | null;
  emailConfirmed: boolean;
  roleId: number;
  role: string;
  divisionId: number;
  departmentId: number;
  unitId: 0;
  firstName: null;
  middleName: null;
  lastName: null;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  addresss: string | null;
  userCode: string | null;
  jobTitle: string;
  signature: any;
  hasDocumentPin: boolean;
  dateOfBirth: string;
  employmentDate: string;
  createdById: string | null;
  createdByEmail: string | null;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  status: number;
  lastAccessedDate: string;
  country: string | null;
  state: string | null;
  latitude: string | null;
  longitude: string | null;
  currentLocationAddress: string | null;
  profilePicture: string | null;
  statusDesc: string | null;
  userCreationStatus: number;
  userCreationStatusDesc: string;
}

export interface IGET_ASSIGNED_OFFICERS {
  succeeded: boolean;
  entity: IASSIGNED_OFFICERS[];
  error: string;
  exceptionError: string;
  message: string;
}

export type OfficerType = 'CMA' | 'DMS' | 'DPO' | 'DSO' | 'DAO';

export interface IASSIGNED_OFFICERS {
  role: OfficerType;
  mainOfficer: IMAIN_OFFICER[];
  supportOfficer: ISUPPORTING_OFFICER[];
  // users: IUSERS[];
}

export interface IMAIN_OFFICER {
  approvalName: string;
  approvalRole: string;
  id: number;
}

export interface ISUPPORTING_OFFICER {
  supportOfficerName: string;
  supportOfficerRole: string;
  id: number;
}

export interface IUSERS {
  approvalName: string;
  id: number;
  userRole: string;
}

export interface IEDIT_ASSIGNED_OFFICERS {
  userId?: string;
  id: number;
  primaryOfficerId: string;
  supportOfficerId: string;
  message?: string;
  role: number | undefined;
  roleString?: string;
  applicationId?: number;
}

export interface IEDIT_ASSIGNED_OFFICERS_RES {
  succeeded: boolean | null;
  entity: string | null;
  error: string | null;
  exceptionError: string | null;
  message: string;
}

export interface IUploadDocQuoteCalc {
  ApplicationQuoteId: number;
  EngagementProfileDocument: string;
  UserId?: string;
  AccessToken?: string;
}

export interface ISaleLoanRequest {
  userId?: string;
  applicationQuoteId: number;
}

export interface ISaleLoanRequestRes {
  succeeded: boolean;
  entity: {
    pageCount: number;
    totalCount: number;
    pageItems: ILoan[];
  };
  error: string | null;
  exceptionError: string | null;
  message: string;
}

export interface InvoiceRequestRes {
  succeeded: boolean;
  entity: InvoiceInterface[];
  error: string | null;
  exceptionError: string | null;
  message: string;
}

export interface ILoanStatistics {
  totaloan: number;
  loanPaid: number;
  loanUnPaid: number;
  totalLoanAmount: string;
  loanPaidAmount: string;
  totalBalance: string;
  currencyCode?: string;
}

export interface ISaleLoanStatisticsResponse {
  succeeded: boolean;
  entity: ILoanStatistics;
  error: string | null;
  exceptionError: string | null;
  message: string;
}
