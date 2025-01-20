import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(private http: HttpClient) {}

  getAllInvoices(userId: string) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/Invoices/getinvoices/${userId}`
    );
  }

  getAllApplicationInvoices(userId: string) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/Invoices/getinvoices/${userId}`
    );
  }

  // getInvoiceById(userId: string, invoiceId: number) {
  //   return this.http.get<any>(
  //     `${this.optivaImmigrationUrl}/Invoices/getinvoices/${userId}/${invoiceId}`
  //   );
  // }
}
