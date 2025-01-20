import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationPhaseService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;
  private optivaAfterSalesUrl = environment.OptivaAfterSalesUrl;

  constructor(private http: HttpClient) {}

  getApplicationPhaseByApplicationId(userId: string, applicationId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/ApplicationPhases/getapplicationphasesbyapplicationId/${userId}/${applicationId}`
    );
  }

  startApplicationPhase(userId: string, id: number) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/ApplicationPhases/startapplicationphase`,
      {
        userId,
        id,
      }
    );
  }

  updateApplicationPhase(payload: any) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/ApplicationPhases/update`,
      payload
    );
  }

  completeAppplicationPhase(userId: string, id: number) {
    return this.http.put<any>(
      `${this.optivaImmigrationUrl}/ApplicationPhases/completeapplicationphase`,
      {
        userId,
        id,
      }
    );
  }

  createCallApplicantTask(userId: string, applicationId: number) {
    return this.http.post<any>(
      `${this.optivaAfterSalesUrl}/salestask/createcallapplicant`,
      {
        userId,
        applicationId,
      }
    );
  }

  assignSMOfficer(userId: string, applicationId: number) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/ApplicationApproval/assignsm`,
      {
        userId,
        applicationId,
      }
    );
  }

  assignOtherOfficer(userId: string, applicationId: number) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/ApplicationApproval/assignfficers`,
      {
        userId,
        applicationId,
      }
    );
  }
}
