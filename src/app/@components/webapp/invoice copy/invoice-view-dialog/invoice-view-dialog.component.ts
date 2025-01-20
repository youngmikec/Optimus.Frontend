import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-view-dialog',
  templateUrl: './invoice-view-dialog.component.html',
  styleUrls: ['./invoice-view-dialog.component.scss'],
})
export class InvoiceViewDialogComponent {
  locationList: any[] = [
    {
      title: 'Head Office:',
      one: '11th - 14th Floor,',
      two: 'Churchgate Towers 2,',
      three: 'Churchgate street,',
      four: 'Victoria Island,',
      five: 'Lagos Nigeria',
    },
    {
      title: 'Abuja Office:',
      one: '7,',
      two: 'Lake Chad Crescent,',
      three: 'Maitama,',
      four: 'Abuja,',
      five: 'Nigeria.',
    },
    {
      title: 'Lekki Office:',
      one: '3rd Floor, CAPPA House 1,',
      two: 'Udeco Medical Road,',
      three: 'Off Chevron Drive,',
      four: 'Lekki, Lagos Nigeria.',
    },
    {
      title: 'Enugu Office:',
      one: 'Centers 57 & 59,',
      two: 'Palms Polo Park Mall,',
      three: 'Abakaliki Road,',
      four: 'Enugu, Nigeria.',
    },
    {
      title: 'East Africa Regional Office:',
      one: 'Pearle Heaven, House B7,',
      two: 'Westlands Avenue, Off',
      three: 'Rhapta Road, Westlands,',
      four: 'Nairobi Kenya.',
    },
  ];

  invoiceTableList: any[] = [
    {
      description: 'Part-Payment for processing',
      amount: '82,446.81',
    },
    {
      description: 'Full-Payment for adption',
      amount: '2,061.86',
    },
  ];

  paymentTableList: any[] = [
    {
      header: 'Bank name',
      dollar: 'Bank of America',
      euro: 'Commertzbank AG',
    },
    {
      header: 'Bank address',
      dollar: 'Bank of America',
      euro: 'Commertzbank AG',
    },
    {
      header: 'Beneficiary',
      dollar: 'Bank of America',
      euro: 'Commertzbank AG',
    },
    {
      header: 'Account number',
      dollar: 'Bank of America',
      euro: 'Commertzbank AG',
    },
    {
      header: 'Swift Code',
      dollar: 'Bank of America',
      euro: 'Commertzbank AG',
    },
    {
      header: 'Bank Number',
      dollar: '1112000111',
      euro: '1212333222',
    },
    {
      header: 'Transit Numer',
      dollar: '0255663322',
      euro: 'N/A',
    },
  ];
  isLoaded: boolean = false;

  @ViewChild('dialogContent', { static: false }) dialogContent!: ElementRef;
  @ViewChild('excludeDiv', { static: false }) excludeDiv!: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InvoiceViewDialogComponent>,
    private router: Router
  ) {}

  viewInvoice(): void {
    this.closeDialog();
    this.router.navigate([
      `app/calculator/quote/quote-invoice/${this.data?.invoice?.applicationQuoteId}/view`,
    ]);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
