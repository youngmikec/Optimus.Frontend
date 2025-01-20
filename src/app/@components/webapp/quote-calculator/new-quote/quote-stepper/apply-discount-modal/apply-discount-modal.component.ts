import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
// import { Store } from '@ngrx/store';
import { IDiscountDetails } from 'src/app/@core/models/discount-request.model';
// import { AppState } from 'src/app/@core/stores/app.reducer';
// import * as DiscountActions from 'src/app/@core/stores/discount/discount.actions';
// import * as DiscountSelectors from 'src/app/@core/stores/discount/discount.selectors';

@Component({
  selector: 'app-apply-discount-modal',
  templateUrl: './apply-discount-modal.component.html',
  styleUrls: ['./apply-discount-modal.component.scss'],
})
export class ApplyDiscountModalComponent implements OnInit {
  discount!: IDiscountDetails;
  selectedCountry!: any;
  selectedMigrationRoute!: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    // private store: Store<AppState>,
    public dialogRef: MatDialogRef<ApplyDiscountModalComponent>
  ) {}

  ngOnInit(): void {
    this.discount = this.data.discount;
    this.selectedCountry = this.data.country;
    this.selectedMigrationRoute = this.data.migrationRoute;
  }

  applyDiscount(answer: 'yes' | 'no'): void {
    // code for apply this count goes here
    this.dialogRef.close({
      shouldApplyDiscount: answer === 'yes' ? true : false,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
