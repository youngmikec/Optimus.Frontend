import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AllInvoiceComponent } from './all-invoice/all-invoice.component';
import { PaidInvoiceComponent } from './paid-invoice/paid-invoice.component';
import { OutstandingInvoiceComponent } from './outstanding-invoice/outstanding-invoice.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements AfterViewInit {
  public searchCtrl: FormControl = new FormControl('');
  public search!: string;

  @ViewChild('allInvoices') allInvoices: any = AllInvoiceComponent;
  @ViewChild('paidInvoices') paidInvoices: any = PaidInvoiceComponent;
  @ViewChild('outstandingInvoices') outstandingInvoices: any =
    OutstandingInvoiceComponent;

  constructor() {
    this.searchCtrl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe({
        next: (search: string) => (this.search = search),
      });
  }

  ngAfterViewInit(): void {
    this.allInvoices.ngOnInit();
  }

  onTabChange(event$: any) {
    if (event$.index === 0) {
      this.allInvoices.ngOnInit();
    } else if (event$.index === 1) {
      this.paidInvoices.ngOnInit();
    } else if (event$.index === 2) {
      this.outstandingInvoices.ngOnInit();
    }
  }
}
