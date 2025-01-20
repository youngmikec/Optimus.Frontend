import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { IDiscountRequest } from 'src/app/@core/models/discount-request.model';

interface MatDataInterface {
  requestData: any;
}

@Component({
  selector: 'app-view-discount-request',
  templateUrl: './view-discount-request.component.html',
  styleUrls: ['./view-discount-request.component.scss'],
})
export class ViewDiscountRequestComponent implements OnInit {
  discountRequest!: IDiscountRequest;
  approvalForm: FormGroup;
  isStatusPending = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MatDataInterface,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewDiscountRequestComponent>,
    private fb: FormBuilder
  ) {
    this.approvalForm = this.fb.group({
      approvedDiscountAmount: [null],
      approvedDiscountPercentage: [null],
    });
  }

  ngOnInit(): void {
    this.discountRequest = this.data.requestData;
    if (this.discountRequest) {
      this.approvalForm.patchValue({
        approvedDiscountAmount: this.discountRequest.discount.flatAmount,
        approvedDiscountPercentage:
          this.discountRequest.discount.discountPercentage,
      });

      this.isStatusPending =
        this.discountRequest?.discountRequestStatusDesc?.toLowerCase() ===
        'Pending'.toLowerCase()
          ? true
          : false;

      if (!this.isStatusPending) {
        this.approvalForm.controls['approvedDiscountAmount'].disable();
        this.approvalForm.controls['approvedDiscountPercentage'].disable();
      }
    }
  }

  get approvalFormControls() {
    return this.approvalForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'percentageAmount' &&
      this.approvalFormControls['percentageAmount'].hasError('required')
    ) {
      return `Please Enter A Percentage or Amount`;
    } else {
      return;
    }
  }

  toggleAction(action: 'approve' | 'reject', record: IDiscountRequest): void {
    // close view modal and toggle approval modal with form data
    const data = {
      action,
      discountRequest: record,
      approvedDiscountAmount: this.approvalForm.value['approvedDiscountAmount'],
      approvedDiscountPercentage:
        this.approvalForm.value['approvedDiscountPercentage'],
    };
    this.dialogRef.close(data);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
