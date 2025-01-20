import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUploadDocQuoteCalc } from '../models/sales';
import {
  GetPaymentScheduleHistoryeResponse,
  IGetLoanPaymentsSchedulePayload,
  IGetLoanPaymentsScheduleResponse,
  IInterestOverrideRequest,
  ILoanRequest,
  ISchedulePaymentPlan,
} from '../models/quote-calculator.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteCalculatorService {
  constructor(private http: HttpClient) {}

  private requestIntrOverride = new BehaviorSubject<boolean>(false);
  public requestIntrOverride$ = this.requestIntrOverride.asObservable();

  setOverrideFxn(): void {
    const status = this.requestIntrOverride.getValue();
    this.requestIntrOverride.next(!status);
  }

  uploadDoc(payload: IUploadDocQuoteCalc): Observable<any> {
    const formPayload = new FormData();
    formPayload.append('ApplicationQuoteId', `${payload.ApplicationQuoteId}`);
    formPayload.append(
      'EngagementProfileDocument',
      payload.EngagementProfileDocument
    );
    formPayload.append('UserId', `${payload.UserId}`);
    return this.http.post<any>(
      `${environment.OptivaImmigrationUrl}/ApplicationQuotes/authorization`,
      formPayload
    );
  }

  requestLoan(payload: ILoanRequest): Observable<any> {
    return this.http.get(
      `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanbyapplicationquoteid/${payload.userId}/${payload.applicationQuoteId}`
      // `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanbyinvoiceid/${payload.userId}/${payload.invoiceid}`
    );
  }

  requestInterestOverride(payload: IInterestOverrideRequest): Observable<any> {
    const formData = new FormData();

    formData.append('interest', `${payload.interest}`);
    formData.append('message', `${payload.message}`);
    formData.append('paymentScheduleId', `${payload.paymentScheduleId}`);
    // formData.append('paymentScheduleId', `${payload.paymentScheduleId}`);
    // formData.append('applicationId', `${payload.applicationId}`);
    // formData.append('interestRate', `${payload.interestRate}`);
    // formData.append('requestMessage', `${payload.requestMessage}`);
    formData.append('userId', `${payload.userId}`);

    return this.http.post(
      `${environment.OptivaImmigrationUrl}/PaymentSchedule/updateinterest`,
      payload
    );
  }

  schedulePaymentPlan(payload: ISchedulePaymentPlan): Observable<any> {
    return this.http.post(
      `${environment.OptivaImmigrationUrl}/PaymentSchedule/create`,
      payload
    );
  }

  updateSchedulePaymentPlan(payload: ISchedulePaymentPlan): Observable<any> {
    return this.http.put(
      `${environment.OptivaImmigrationUrl}/PaymentSchedule/update`,
      payload
    );
  }

  getLoanPaymentPlanSchedule(payload: IGetLoanPaymentsSchedulePayload) {
    const { userId, invoiceLoanId } = payload;
    this.http
      .get(
        `${environment.OptivaImmigrationUrl}/InvoiceLoan/getinvoiceloanstatistics/${userId}/${invoiceLoanId}`
      )
      .subscribe();
    return this.http.get<IGetLoanPaymentsScheduleResponse>(
      `${environment.OptivaImmigrationUrl}/PaymentSchedule/getpaymentschedule/${userId}/${invoiceLoanId}`
    );
  }

  getLoanPaymentPlanScheduleHistory(payload: {
    userId: string;
    paymentscheduleId: number;
  }) {
    const { userId, paymentscheduleId } = payload;
    return this.http.get<GetPaymentScheduleHistoryeResponse>(
      `${environment.OptivaImmigrationUrl}/PaymentHistory/getpaymenthistory/${userId}/${paymentscheduleId}`
    );
  }

  createLoanPaymentPlanScheduleHistory(payload: FormData) {
    return this.http.post<any>(
      `${environment.OptivaImmigrationUrl}/PaymentHistory/create`,
      payload
    );
  }

  updateLoanPaymentPlanScheduleHistory(payload: {
    userId: string;
    id: number;
    paymentStatus: number;
  }): Observable<any> {
    return this.http.patch(
      `${environment.OptivaImmigrationUrl}/PaymentHistory/updatepaymenthistorystatus`,
      payload
    );
  }

  generateFinancialStatement(payload: {
    userId: string;
    applicationQuoteId: number;
  }): Observable<any> {
    return this.http.post(
      `${environment.OptivaImmigrationUrl}/Applications/generate-financial-statement`,
      payload
    );
  }
}
