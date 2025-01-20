import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as QuoteLoanActions from 'src/app/@core/stores/quoteCalculator/quoteCalculator.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-repay-quote-loan',
  templateUrl: './repay-quote-loan.component.html',
  styleUrls: ['./repay-quote-loan.component.scss'],
})
export class RepayQuoteLoanComponent implements OnInit {
  isLoading!: Observable<boolean>;
  repayLoanForm!: FormGroup;

  amount!: number;
  // receiptNumber!: number;

  selectedFile!: File;
  fileInfo: { name: string | undefined; size: string | undefined } = {
    name: undefined,
    size: undefined,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RepayQuoteLoanComponent>
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
      // receiptNumber: [null, Validators.required],
      attachment: [null, Validators.required],
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
      QuoteLoanActions.CreateLoanPaymentHistory({
        payload: {
          amountPaid: parseInt(this.repayLoanForm.controls['amount'].value),
          // TelexNumber: this.repayLoanForm.controls['receiptNumber'].value,
          paymentScheduleId: this.data.id,
          document: this.selectedFile,
          userId: '',
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
