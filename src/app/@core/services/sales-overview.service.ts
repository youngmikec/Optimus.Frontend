import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IEDIT_ASSIGNED_OFFICERS,
  IEDIT_ASSIGNED_OFFICERS_RES,
  IGET_ALL_ACTIVITIES_BY_ID_RES,
  IGET_ALL_OFFICERS_BY_ROLE_RES,
  IGET_APPLICANT_BY_ID_RES,
  IGET_ASSIGNED_OFFICER_ACTIVITIES_RES,
  IGET_PHASES_RES,
  IGET_TOTAL_PAID_INVOICES_RES,
} from '../models/sales';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class SalesOverviewService {
  constructor(private http: HttpClient) {}

  getTotalPaidInvoice(
    userid: number
  ): Observable<IGET_TOTAL_PAID_INVOICES_RES> {
    return this.http.get<IGET_TOTAL_PAID_INVOICES_RES>(
      `${environment.OptivaImmigrationUrl}/InvoiceItems/gettotalpaidinvoice/${userid}`
    );
  }

  getPhases(userid: number): Observable<IGET_PHASES_RES> {
    return this.http.get<IGET_PHASES_RES>(
      `${environment.OptivaImmigrationUrl}/Phases/getphases/${userid}`
    );
  }

  getApplicantById(
    userid: string,
    id: number
  ): Observable<IGET_APPLICANT_BY_ID_RES> {
    return this.http.get<IGET_APPLICANT_BY_ID_RES>(
      `${environment.OptivaImmigrationUrl}/Applications/getapplicationbyid/${userid}/${id}`
    );
  }

  getActivitiesByApplicationId(
    userId: string,
    applicationid: number
  ): Observable<IGET_ALL_ACTIVITIES_BY_ID_RES | any> {
    return this.http.get(
      `${environment.OptivaAfterSalesUrl}/useractivity/getuseractivitiesbyapplicationid/${userId}/${applicationid}`
    );
  }

  getActivitiesById(
    userId: string,
    id: number
  ): Observable<IGET_ALL_ACTIVITIES_BY_ID_RES> {
    return this.http.get<IGET_ALL_ACTIVITIES_BY_ID_RES>(
      `${environment.OptivaImmigrationUrl}/DocumentCollection/getdocumentactivities/${userId}/${id}`
    );
  }

  markActivityAsDone(
    userId: string,
    id: number,
    status: number
  ): Observable<IGET_ALL_ACTIVITIES_BY_ID_RES> {
    const payload = {
      userId,
      id,
      status,
    };

    return this.http.post<IGET_ALL_ACTIVITIES_BY_ID_RES>(
      `${environment.OptivaImmigrationUrl}/DocumentCollection/updatedocumentactivitystatusbyid`,
      payload
    );
  }

  getAssignedOfficersID(
    userid: string,
    id: number
  ): Observable<IGET_ASSIGNED_OFFICER_ACTIVITIES_RES> {
    return this.http.get<IGET_ASSIGNED_OFFICER_ACTIVITIES_RES>(
      `${environment.OptivaImmigrationUrl}/dummy`
    );
  }

  editAssignedOfficers(
    data: IEDIT_ASSIGNED_OFFICERS
  ): Observable<IEDIT_ASSIGNED_OFFICERS_RES> {
    return this.http.post<IEDIT_ASSIGNED_OFFICERS_RES>(
      `${environment.OptivaImmigrationUrl}/ApplicationApproval/updateapplicationapproval`,
      data
    );
  }

  getOfficersByRole(
    userId: string,
    jobTitle: string
  ): Observable<IGET_ALL_OFFICERS_BY_ROLE_RES> {
    return this.http.get<IGET_ALL_OFFICERS_BY_ROLE_RES>(
      `${environment.OptivaAuthUrl}/Users/getbyjobtitle/${userId}/${jobTitle}`
    );
  }

  getSalesStatistics(userId: string, applicationQuoteId: number) {
    return this.http.get(
      `${environment.OptivaImmigrationUrl}/Sales/getsales/overview/${userId}/${applicationQuoteId}`
    );
  }

  getSalesLoanStatistics(userId: string, invoiceId: number) {
    return this.http.get(
      `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanstatistics/${userId}/${invoiceId}`
    );
  }
}
