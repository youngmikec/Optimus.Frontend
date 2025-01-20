import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentSupportService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(private http: HttpClient) {}

  hcmApproveDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentSupport/hcmApproveDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }

  hcmRejectDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentSupport/hcmRejectDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }
}
