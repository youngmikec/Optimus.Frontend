import { IMigrationRoute } from 'src/app/@core/models/migration-route.model';

export interface SalesTableInterface {
  applicationId: string;
  applicantName: string;
  country: string;
  route: string;
  invoiceAmount: string;
  amountPaid: string;
  applicationPhase: string;
}

export interface ISaleService {
  createdDate: string;
  lastModifiedDate: string;
  applicantName: string;
  migrationRoute: IMigrationRoute;
  country: string;
  amountPaid: number;
  invoiceAmount: number;
  applicationId: number;
  applicantId: number;
  applicationQuoteId: number;
  localProcessingAmount: number;
  countryProcessingAmount: number;
  countryProcessingPaid: number;
  localProcessingPaid: number;
}
