import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentAuditService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;
  private optivaAuthUrl = environment.OptivaAuthUrl;

  constructor(private http: HttpClient) {}

  daoApproveDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentAudit/daoApproveDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }

  daoRejectDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentAudit/daoRejectDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }

  getPartners(userId: string, skip: number, take: number) {
    return this.http.get<any>(
      `${this.optivaAuthUrl}/Partner/getactivepartners/${userId}/${skip}/${take}`
    );
  }

  submitToHOD(userId: string, applicationId: number) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentProcessor/sendToHodDoa`,
      { userId, applicationId }
    );
  }

  sendToPartner(payload: { userId: string; partnerDocuments: any }) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/Partner/sendtopartner`,
      payload
    );
  }
}
