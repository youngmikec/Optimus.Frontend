import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-loan-request',
  templateUrl: './edit-loan-request.component.html',
  styleUrls: ['./edit-loan-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditLoanRequestComponent implements OnInit {
  loanAmount = this.data.loan.amount;
  message: string = this.data.loan.description;

  isLoading!: Observable<boolean>;

  updateLoanForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditLoanRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);

    this.updateLoanForm = this.fb.group({
      loanAmount: [
        this.loanAmount,
        [
          Validators.required,
          Validators.pattern(/^[+]?([1-9][0-9]*(?:\.[0-9]+)?|\.[0-9]+)$/),
        ],
      ],
      message: [this.message],
    });
  }

  get updateLoanFormControl() {
    return this.updateLoanForm.controls;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onConfirm() {
    const requestData = {
      loanAmount: this.loanAmount,
      message: this.message,
    };
    this.dialogRef.close(requestData);
  }

  updateLoan() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      SaleServiceActions.UpdateLoan({
        payload: {
          id: this.data.loan.id,
          amount: this.updateLoanForm.controls['loanAmount'].value,
          applicantId: this.data.applicantId,
          description: this.updateLoanForm.controls['message'].value,
          approvalStatus: this.data.approvalStatus,
        },
      })
    );
  }
}
