import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { sortArrayWithCondition } from 'src/app/@core/utils/helpers';

@Component({
  selector: 'app-payment-schedule-document-dialog',
  templateUrl: './payment-schedule-document-dialog.component.html',
  styleUrls: ['./payment-schedule-document-dialog.component.scss'],
})
export class PaymentScheduleDocumentDialogComponent implements OnInit {
  dataSource: any[] = [];
  localDataSource: any[] = [];
  selectedApplicationQuote: any = {};
  totalCountryFee = 0;
  totalLocalFee = 12500;
  locationList: any[] = [
    {
      title: 'Head Office:',
      one: '11th - 14th Floor,',
      two: 'Churchgate Towers 2,',
      three: 'Churchgate street,',
      four: 'Victoria Island, Lagos Nigeria',
    },
    {
      title: 'Abuja Office:',
      one: '8th Floor, World Trade Center,',
      two: '1008, 1113 Constitutional Ave.,',
      three: 'Central Business District,',
      four: 'Abuja, Nigeria',
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

  localFeePercentage = 0.5;
  countryFeePercentage = 0.2;

  showLocalFee = true;
  showPaymentPlan = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PaymentScheduleDocumentDialogComponent>
  ) {}

  ngOnInit(): void {
    // console.log(this.data);
    this.selectedApplicationQuote = this.data?.selectedApplicationQuote;
    // console.log(this.selectedApplicationQuote)

    this.dataSource =
      this.selectedApplicationQuote?.applicationQuoteItems.filter(
        (item: any) => item.feeCategory !== 1
      );
    this.dataSource = sortArrayWithCondition(
      this.dataSource,
      'routeFeeSerialNumber'
    );
    this.totalCountryFee = 0;
    this.dataSource.forEach((fee) => {
      this.totalCountryFee = this.totalCountryFee + fee.amount;
    });

    this.localDataSource =
      this.selectedApplicationQuote?.applicationQuoteItems.filter(
        (item: any) => item.feeCategory === 1
      );

    this.totalLocalFee = 12500;
    this.localFeePercentage = 200 / 100 ?? 0.5;
    this.countryFeePercentage = 200 / 100 ?? 0.2;

    this.showLocalFee = true;
    this.showPaymentPlan = true;
  }

  roundDownNumber(number: number) {
    return Math.floor(number);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  sendPdfDoc(): void {
    //logic to send mail here.
  }
}
