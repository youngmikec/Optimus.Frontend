import { IApplicant } from './applicant.interface';

export interface IApplication {
  applicant: IApplicant;
  applicantId: number;
  applicationNo: string;
  applicationProcessingStatus: number;
  applicationProcessingStatusDesc: string;
  applicationResponses: any[];
  applicationStatus: number;
  applicationStatusDesc: string;
  createdBy: string;
  createdDate: Date;
  description: string;
  endDate: Date;
  id: number;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  migrationRoute: any;
  migrationRouteId: number;
  name: string;
  recordKey: string;
  rmId: string;
  rmName: string;
  startDate: Date;
  status: number;
  statusDesc: string;
  userId: string;
}
