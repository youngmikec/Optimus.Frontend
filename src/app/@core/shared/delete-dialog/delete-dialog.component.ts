import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IDeleteData } from '../../interfaces/delete-data.interface';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';

// import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  dialogTitle: string = 'Delete Application Quote';
  entityName: string = 'Quote';
  submitAction!: any;
  isLoading!: Observable<boolean>;
  deleteRecord: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDeleteData,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    // private fb: FormBuilder,
    private store: Store<fromApp.AppState> // private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.dialogTitle = this.data.dialogTitle;
    this.entityName = this.data.entityName;
    this.submitAction = this.data.submitAction;

    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);
  }

  onDeleteAction(): void {
    if (!this.data.submitAction) {
      return;
    }
    this.data.submitAction(this.data.deleteRecord);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
