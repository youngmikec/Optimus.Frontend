import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Pagination<T = any> {
  skip: number;
  take: number;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentConfigurationService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(private http: HttpClient) {}

  createDocumentConfiguration(userId: string, payload: any) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentConfiguration/create`,
      { ...payload, userId }
    );
  }

  getAllDocumentConfiguration(userId: string, pagination: Pagination) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentConfiguration/getalldocumentconfigurations/${pagination.skip}/${pagination.take}/${userId}`
    );
  }

  getAllActiveDocumentConfiguration(userId: string, pagination: Pagination) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentConfiguration/getallactivedocumentconfigurations/${pagination.skip}/${pagination.take}/${userId}`
    );
  }

  updateDocumentConfiguration(userId: string, payload: any) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentConfiguration/update`,
      { ...payload, userId }
    );
  }

  getDocumentConfigurationById(
    userId: string,
    documentConfigurationId: number
  ) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentConfiguration/getdocumentconfigurationbyid/${userId}/${documentConfigurationId}`
    );
  }
}
