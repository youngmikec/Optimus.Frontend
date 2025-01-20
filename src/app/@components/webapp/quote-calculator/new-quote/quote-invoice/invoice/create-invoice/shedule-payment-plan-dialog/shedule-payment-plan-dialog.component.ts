import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as InvoicesSelector from 'src/app/@core/stores/invoices/invoices.selectors';

@Component({
  selector: 'app-shedule-payment-plan-dialog',
  templateUrl: './shedule-payment-plan-dialog.component.html',
  styleUrls: ['./shedule-payment-plan-dialog.component.scss'],
})
export class ShedulePaymentPlanDialogComponent implements OnDestroy {
  isLoading = false;
  step = '1';
  isCreateSuccess$!: Observable<boolean>;
  createdSuccessInvoiceId!: number | undefined;

  unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShedulePaymentPlanDialogComponent>,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {
    this.isCreateSuccess$ = this.store.pipe(
      select(InvoicesSelector.isInvoiceCreateSuccessSelector)
    );
    this.isCreateSuccess$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isCreatedSuccess) => {
        if (!isCreatedSuccess) return;
        this.isLoading = false;
        this.step = '2';
      });

    this.store
      .pipe(
        takeUntil(this.unsubscribe$),
        select(InvoicesSelector.isInvoiceCreateSuccessInvoiceIdSelector)
      )
      .subscribe((createdSuccessInvoiceId) => {
        this.createdSuccessInvoiceId = createdSuccessInvoiceId;
      });
  }

  createInvoice() {
    this.isLoading = true;
    this.data.action();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  goToPaymentPlan() {
    this.dialogRef.close();
    if (this.createdSuccessInvoiceId) {
      const url =
        '/app/calculator/quote/quote-invoice/' +
        this.data.applicationQuoteId +
        '/loan/' +
        this.createdSuccessInvoiceId;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  goToInvoice() {
    this.dialogRef.close();
    this.router.navigate([
      `/app/calculator/quote/quote-invoice/${this.data.applicationQuoteId}/view`,
    ]);
  }

  goToInvoiceInNewTab() {
    const url =
      '/app/calculator/quote/quote-invoice/' +
      this.data.applicationQuoteId +
      '/view';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  ngOnDestroy() {
    this.isLoading = false;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
