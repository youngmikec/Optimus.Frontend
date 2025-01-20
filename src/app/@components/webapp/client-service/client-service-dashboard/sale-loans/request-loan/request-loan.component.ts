import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';

@Component({
  selector: 'app-request-loan',
  templateUrl: './request-loan.component.html',
  styleUrls: ['./request-loan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RequestLoanComponent implements OnInit {
  loanAmount!: number;
  message: string = '';

  requestLoanForm!: FormGroup;

  isLoading!: Observable<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RequestLoanComponent>,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);

    this.requestLoanForm = this.fb.group({
      loanAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[+]?([1-9][0-9]*(?:\.[0-9]+)?|\.[0-9]+)$/),
        ],
      ],
      message: [null],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get requestLoanFormControl() {
    return this.requestLoanForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.requestLoanFormControl['name'].hasError('pattern')
    ) {
      return 'Invalid currency format. Please enter a positive currency value.';
    } else if (
      instance === 'name' &&
      this.requestLoanFormControl['name'].hasError('required')
    ) {
      return 'Pls input Amount';
    } else {
      return;
    }
  }

  onConfirm() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      SaleServiceActions.RequestLoan({
        payload: {
          amount: this.requestLoanFormControl['loanAmount'].value,
          description: this.requestLoanFormControl['message'].value,
          applicationId: this.data.applicationId,
          name: this.data.applicantName,
        },
      })
    );

    // const requestData = {
    //   loanAmount: this.loanAmount,
    //   message: this.message,
    // };
    // this.dialogRef.close(requestData);
  }
}
