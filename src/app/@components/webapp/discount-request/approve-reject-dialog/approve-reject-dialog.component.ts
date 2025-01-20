import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/@core/stores/app.reducer';
import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
import * as DiscountSelectors from 'src/app/@core/stores/discount/discount.selectors';

@Component({
  selector: 'app-approve-reject-dialog',
  templateUrl: './approve-reject-dialog.component.html',
  styleUrls: ['./approve-reject-dialog.component.scss'],
})
export class ApproveRejectDialogComponent implements OnInit {
  isLoading!: Observable<boolean>;
  title: string = '';
  approvalQuestion: string = '';
  rejectionQuestion: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ApproveRejectDialogComponent>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(DiscountSelectors.getApprovalIsLoading);
    if (this.data && this.data.type === 'approve') {
      this.title = 'Approve Discount';
    } else {
      this.title = `Reject Discount`;
    }

    this.setApprovalAndRejectionQuestions();
  }

  setApprovalAndRejectionQuestions(): void {
    const country = this.data?.discountRequest.discount.countryName;
    const migrationRoute =
      this.data?.discountRequest.discount.migrationRouteName;

    this.approvalQuestion = `You are about to accept discount request for ${country} ${migrationRoute} route. Would you like to accept?`;
    this.rejectionQuestion = `You are about to reject discount request for ${country} ${migrationRoute} route. Would you like to reject?`;
  }

  approveRejectAction(action: 'approve' | 'reject'): void {
    // close view modal and toggle approval modal with form data
    action === 'approve'
      ? this.approveDiscountRequest()
      : this.rejectDiscountRequest();
  }

  approveDiscountRequest(): void {
    this.store.dispatch(DiscountActions.ApprovalIsLoading({ payload: true }));
    this.store.dispatch(
      DiscountActions.ApproveDiscountRequest({
        payload: {
          id: this.data.discountRequest.id,
          discountId: this.data.discountRequest.discountId,
          status: this.data.discountRequest.discountRequestStatus,
          approvedDiscountAmount: this.data.approvedDiscountAmount,
          approvedDiscountPercentage: this.data.approvedDiscountPercentage,
        },
      })
    );
  }

  rejectDiscountRequest(): void {
    this.store.dispatch(DiscountActions.ApprovalIsLoading({ payload: true }));
    this.store.dispatch(
      DiscountActions.RejectDiscountRequest({
        payload: {
          id: this.data.discountRequest.id,
          discountId: this.data.discountRequest.discountId,
          status: this.data.discountRequest.discountRequestStatus,
          approvedDiscountAmount: this.data.approvedDiscountAmount,
          approvedDiscountPercentage: this.data.approvedDiscountPercentage,
        },
      })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
