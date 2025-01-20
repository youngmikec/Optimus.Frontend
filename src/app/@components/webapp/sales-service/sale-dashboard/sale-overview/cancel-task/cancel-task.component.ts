import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as SaleServiceActions from 'src/app/@core/stores/sale-service/sale-service.actions';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cancel-task',
  templateUrl: './cancel-task.component.html',
  styleUrls: ['./cancel-task.component.scss'],
})
export class CancelTaskComponent implements OnInit {
  buttonLoading!: Observable<boolean>;
  constructor(
    // private router: Router,
    @Inject(MAT_DIALOG_DATA) public task: any,
    private store: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<CancelTaskComponent>
  ) {}

  ngOnInit(): void {
    this.buttonLoading = this.store.select(
      GeneralSelectors.getGeneralIsLoading
    );
  }

  goToCreateNewInvoice() {
    this.dialogRef.close();
    // this.router.navigate(['/app/calculator/quote/quote-invoice/view']);
  }

  cancelTask() {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));
    this.store.dispatch(
      SaleServiceActions.CancelTask({
        payload: { id: this.task.id, applicationId: this.task.applicationId },
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
