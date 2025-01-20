import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as UserSelectors from 'src/app/@core/stores/users/users.selectors';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
})
export class ViewUserModalComponent implements OnInit {
  userData!: any;
  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewUserModalComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(UserSelectors.getUsersIsLoading));
    this.userData = this.data?.userData;
  }

  toggleUserStatus(status: boolean, user: any, device: any) {
    this.store.dispatch(
      AuthActions.AuthorizeUserLogin({
        payload: {
          authorize: status,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          userEmail: user.email,
        },
      })
    );
  }

  onToggle(user: any) {
    this.store.dispatch(
      UserActions.ChangeUserStatus({
        payload: { userId: user.userId, status: user.status },
      })
    );
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
