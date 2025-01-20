import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';

interface DeleteModalDataInterface {
  entityName: string;
  action: () => any;
}

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  isLoading!: Observable<boolean>;
  entityName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) private data: DeleteModalDataInterface
  ) {}

  ngOnInit(): void {
    this.entityName = this.data.entityName;
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);
  }

  deleteUser(): void {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.data.action();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
