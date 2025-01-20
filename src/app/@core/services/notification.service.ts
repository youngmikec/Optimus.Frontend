import { Injectable, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';
import { NotificationComponent } from '../shared/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarRefSub!: Subscription;

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: Notification, notificationClass: string) {
    const snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
      data: message,
      duration: 15000,
      panelClass: [notificationClass],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    this.snackBarRefSub = snackBarRef.afterDismissed().subscribe(() => {
      // this.store.dispatch(GeneralActions.ClearNotification());
    });
  }

  ngOnDestroy(): void {
    if (this.snackBarRefSub) {
      this.snackBarRefSub.unsubscribe();
    }
  }
}
