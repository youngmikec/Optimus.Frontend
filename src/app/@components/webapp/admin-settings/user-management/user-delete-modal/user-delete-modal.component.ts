import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as generalSelectors from 'src/app/@core/stores/general/general.selectors';
import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
// import * as UserSelectors from 'src/app/@core/stores/users/users.selectors';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.scss'],
})
export class UserDeleteModalComponent implements OnInit {
  isLoading!: Observable<boolean>;
  userId: number = 0;

  constructor(
    public dialogRef: MatDialogRef<UserDeleteModalComponent>,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      userId: number;
      skip?: number;
      take?: number;
    }
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.select(generalSelectors.getGeneralIsLoading);
    this.userId = this.data.userId;
  }

  deleteUser(): void {
    this.store.dispatch(GeneralActions.IsLoading({ payload: true }));

    this.store.dispatch(
      UserActions.DeleteUser({
        payload: {
          userId: this.userId,
          skip: this.data.skip,
          take: this.data.take,
        },
      })
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
