import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentProcessingService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(private http: HttpClient) {}

  getDocumentAnalytics(userId: string, applicationId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/getdocumentstatistics/${userId}/${applicationId}`
    );
  }

  cmaApproveDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentProcessor/cmaApproveDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }

  cmaRejectDocument(
    userId: string,
    documentId: number,
    applicationPhaseId: number
  ) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/DocumentProcessor/cmaRejectDocument`,
      { userId, documentId, applicationPhaseId }
    );
  }

  // dpocompleteDocumentProcessing(
  //   userId: string,
  //   applicationId: number,
  //   documentId: number
  // ) {
  //   return this.http.put<any>(
  //     `${this.optivaImmigrationUrl}/DocumentProcessor/completedoocumentprocessing`,
  //     { userId, applicationId, documentId }
  //   );
  // }
}
