import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../@core/stores/app.reducer';
import * as SalesActions from 'src/app/@core/stores/sale-service/sale-service.actions';

@Component({
  selector: 'app-mark-as-done',
  templateUrl: './mark-as-done.component.html',
  styleUrls: ['./mark-as-done.component.scss'],
})
export class MarkAsDoneComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MarkAsDoneComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  markAsDone(): void {
    this.dialogRef.close();

    this.store.dispatch(
      SalesActions.MarkActivityAsDone({
        payload: {
          id: this.data.id,
          status: 1,
          applicationId: this.data.applicationId,
        },
      })
    );
  }
}
