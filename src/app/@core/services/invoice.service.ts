import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  IGET_INVOICE_RES,
  IINVOICE_DETAILS_RES,
  IMARK_AS_PAID_RES,
  ISEND_INVOICE_RES,
} from '../models/invoice';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  private optivaImmigrationUrl = environment.OptivaImmigrationUrl + '/Invoices';

  getAllInvoice(
    userid: string,
    skip: number,
    take: number,
    paymentStatus?: number
  ): Observable<IGET_INVOICE_RES> {
    const params: any = paymentStatus
      ? { PaymentStatus: paymentStatus ?? '' }
      : {};

    return this.http.get<IGET_INVOICE_RES>(
      `${this.optivaImmigrationUrl}/getinvoices/${userid}/${skip}/${take}`,
      { params }
    );
  }

  getAllInvoiceWithPaymentStatus(
    userid: string,
    skip: number,
    take: number,
    paymentStatus?: number
  ): Observable<IGET_INVOICE_RES> {
    const params: any = { PaymentStatus: paymentStatus ?? '' };

    return this.http.get<IGET_INVOICE_RES>(
      `${this.optivaImmigrationUrl}/getinvoices/${userid}/${skip}/${take}`,
      { params }
    );
  }

  searchInvoices(
    userid: string,
    skip: number,
    take: number,
    searchWord?: string,
    paymentStatus?: number
  ): Observable<IGET_INVOICE_RES> {
    const params: any = { PaymentStatus: paymentStatus ?? '' };

    return this.http.get<IGET_INVOICE_RES>(
      `${this.optivaImmigrationUrl}/getinvoices/${userid}/${skip}/${take}/${searchWord}`,
      { params }
    );
  }

  getAllApplicationInvoice(
    userid: string,
    skip: number,
    take: number,
    applicationQuoteId: number,
    paymentStatus?: number
  ): Observable<IGET_INVOICE_RES> {
    //Set params
    let params = new HttpParams();
    if (paymentStatus) {
      params = params.set('PaymentStatus', paymentStatus);
    }

    return this.http.get<IGET_INVOICE_RES>(
      `${this.optivaImmigrationUrl}/getinvoicebyapplicationquoteid/${userid}/${skip}/${take}/${applicationQuoteId}`,
      { params }
    );
  }

  getInvoiceById(
    userId: string,
    invoiceId: number
  ): Observable<IINVOICE_DETAILS_RES> {
    return this.http.get<IINVOICE_DETAILS_RES>(
      `${this.optivaImmigrationUrl}/getinvoicebyid/${userId}/${invoiceId}`
    );
  }

  markAsPaid(form: FormData): Observable<IMARK_AS_PAID_RES> {
    return this.http.post<IMARK_AS_PAID_RES>(
      `${environment.OptivaImmigrationUrl}/InvoicePaymentDetail/create`,
      form
    );
  }

  updateMarkAsPaid(payload: any): Observable<any> {
    return this.http.put<any>(
      `${environment.OptivaImmigrationUrl}/InvoicePaymentDetail/update`,
      payload
    );
  }

  sendInvoice(
    userid: string,
    id: number,
    attachment: string
  ): Observable<ISEND_INVOICE_RES> {
    const payload = {
      userid,
      id,
      attachment,
    };
    return this.http.post<ISEND_INVOICE_RES>(
      `${this.optivaImmigrationUrl}/dummy`,
      payload
    );
  }

  createInvoice(payload: any, userId: string) {
    return this.http.post<any>(`${this.optivaImmigrationUrl}/create`, {
      ...payload,
      userId,
    });
  }

  getInvoiceByApplicationQuoteId(
    id: number,
    userId: string,
    { skip, take }: { skip: number; take: number }
  ) {
    return this.http
      .get(
        `${this.optivaImmigrationUrl}/getinvoicebyApplicationQuoteid/${userId}/${skip}/${take}/${id}`
      )
      .pipe(
        map((response: any) => {
          response.entity.pageItems = response.entity.pageItems.map(
            (items: any) => {
              items.selectedInvoicePaymentDetails =
                items.inoicePaymentDetails[0];
              return items;
            }
          );

          return response;
        })
      );
  }

  getInvoiceStatisticsByApplicationQuoteId(
    applicationQuoteId: number,
    userId: string
  ) {
    return this.http.get(
      `${this.optivaImmigrationUrl}/getinvoicestatisticsbyapplicationquoteid/${userId}/${applicationQuoteId}`
    );
  }

  getInvoiceStatistics(
    userId: string,
    applicationQuoteId: number
  ): Observable<IINVOICE_DETAILS_RES> {
    return this.http.get<IINVOICE_DETAILS_RES>(
      `${this.optivaImmigrationUrl}/getinvoicestatisticsbyapplicationquoteid/${userId}/${applicationQuoteId}`
    );
  }
}
