import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as QuoteCalculatorActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as QuoteLoanActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import * as QuoteSelectors from 'src/app/@core/stores/quoteCalculator/quoteCalculator.selectors';
// import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPaymentSchedule } from 'src/app/@core/interfaces/paymentSchedule';

@Component({
  selector: 'app-repay-loan',
  templateUrl: './repay-loan.component.html',
  styleUrls: ['./repay-loan.component.scss'],
})
export class RepayLoanComponent implements OnInit {
  isLoading!: Observable<boolean>;
  repayLoanForm!: FormGroup;

  amount!: number;
  receiptNumber!: number;
  paymentSchedule!: IPaymentSchedule;
  paymentScheduleId!: number;

  selectedFile!: File;
  fileInfo: { name: string | undefined; size: string | undefined } = {
    name: undefined,
    size: undefined,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RepayLoanComponent>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);

    this.repayLoanForm = this.fb.group({
      amount: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[+]?([1-9][0-9]*(?:\.[0-9]+)?|\.[0-9]+)$/),
        ],
      ],
      receiptNumber: [null, Validators.required],
      attachment: [null, Validators.required],
    });

    if (this.data.paymentSchedule) {
      this.paymentScheduleId = this.data.paymentSchedule.id;
    }

    if (!this.data.paymentSchedule && this.data.loan) {
      this.getPaymentsScheduleByLoanId(this.data.loan.id);
    }
  }

  getPaymentsScheduleByLoanId(loanId: number): void {
    this.store.dispatch(
      QuoteLoanActions.getPaymentsSchedule({
        payload: {
          invoiceLoanId: loanId,
          userId: '',
        },
      })
    );
    this.store
      .pipe(select(QuoteSelectors.PaymentsPlanSchedule))
      .subscribe((res: any) => {
        if (res) {
          this.paymentSchedule = res;
          this.paymentScheduleId = res.id;
        }
      });
  }

  get repayLoanFormControl() {
    return this.repayLoanForm.controls;
  }

  /** Uploading Files */
  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileInfo = {
        name: file.name,
        size: this.formatFileSize(file.size),
      };

      this.selectedFile = file;

      // Assign the file directly to the form control
      this.repayLoanForm.patchValue({
        attachment: file.name,
      });
    } else {
      this.fileInfo = { name: undefined, size: undefined };
    }
  }

  clearFile() {
    this.fileInfo = { name: undefined, size: undefined };
    // this.selectedFile = null;
    this.repayLoanForm.patchValue({
      attachment: null,
    });
  }

  createLoanPayment() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      QuoteCalculatorActions.CreateLoanPaymentHistory({
        payload: {
          userId: '',
          amountPaid: parseInt(this.repayLoanForm.controls['amount'].value),
          paymentScheduleId: this.data.paymentSchedule
            ? parseInt(this.data.paymentSchedule.id)
            : this.paymentScheduleId,
          document: this.selectedFile,
        },
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private formatFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
