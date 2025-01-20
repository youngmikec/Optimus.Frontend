import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhaseService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(private http: HttpClient) {}

  getPhases(userId: string) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/Phases/getphases/${userId}`
    );
  }

  getPhaseById(userId: string, phaseId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/Phases/getphases/${userId}/${phaseId}`
    );
  }

  updatePhase(userId: string, payload: any) {
    return this.http.put<any>(`${this.optivaImmigrationUrl}/Phases/update`, {
      userId,
      ...payload,
    });
  }
}
