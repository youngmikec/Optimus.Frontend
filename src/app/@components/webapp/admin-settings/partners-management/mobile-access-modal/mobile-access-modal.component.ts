import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as AuthSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobile-access-modal',
  templateUrl: './mobile-access-modal.component.html',
  styleUrls: ['./mobile-access-modal.component.scss'],
})
export class MobileAccessModalComponent implements OnInit {
  isLoading!: Observable<boolean>;

  constructor(
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MobileAccessModalComponent>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(AuthSelectors.getAuthIsLoading));
  }

  toggleUserStatus(status: boolean) {
    this.store.dispatch(AuthActions.IsLoading({ payload: true }));
    this.store.dispatch(
      AuthActions.AuthorizeUserLogin({
        payload: {
          authorize: status,
          deviceId: this.data?.submitData?.deviceId,
          deviceName: this.data?.submitData?.deviceName,
          userEmail: this.data?.submitData?.userEmail,
        },
      })
    );
  }

  closeDialog() {
    // this.data?.editData;
    this.dialogRef.close();
  }
}
