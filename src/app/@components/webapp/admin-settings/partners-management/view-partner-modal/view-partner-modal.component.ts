import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as PartnerActions from 'src/app/@core/stores/partners/partners.actions';
// import * as UserSelectors from 'src/app/@core/stores/users/users.selectors';
import * as PartnerSelectors from 'src/app/@core/stores/partners/partners.selectors';
@Component({
  selector: 'app-view-partner-modal',
  templateUrl: './view-partner-modal.component.html',
  styleUrls: ['./view-partner-modal.component.scss'],
})
export class ViewPartnerModalComponent implements OnInit {
  userData!: any;
  isLoading!: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewPartnerModalComponent>,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(
      select(PartnerSelectors.getPartnersIsLoading)
    );
    this.userData = this.data?.userData;
    // eslint-disable-next-line no-console
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

  onToggle(partnerUserId: string, userId: string, status: number) {
    this.store.dispatch(
      PartnerActions.ChangePartnerStatus({
        payload: {
          partnerUserId,
          userId,
          status,
        },
      })
    );
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
