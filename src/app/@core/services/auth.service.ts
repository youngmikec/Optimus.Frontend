import { Injectable } from '@angular/core';
import * as AuthActions from '../stores/auth/auth.actions';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../stores/app.reducer';
import { Notification } from '../interfaces/notification.interface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  idleState = 'Not started.';
  hasRefreshTokenBeenCalled: boolean = false;
  hasSessionLogoutBeenCalled: boolean = false;

  // private tokenExpirationTimer: any;

  constructor(
    private idle: Idle,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {
    // sets an idle timeout of 1 second.
    this.idle.setIdle(1);

    // sets a timeout period of 3600 seconds. after 3601 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(3600);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = `Timer = ${countdown}`;

      const OptivaData = JSON.parse(localStorage.getItem('Optiva')!);
      const OptivaAuthData = JSON.parse(localStorage.getItem('Optiva_auth')!);

      const OptivaSessionExpiryDateTime = OptivaData?.exp;
      const OptivaAuthSessionExpiryDateTime = OptivaAuthData?.expiryDate;

      const currentDateTime = new Date().getTime();

      const OptivaTimeLeft =
        (OptivaSessionExpiryDateTime - currentDateTime) / 60000; //Value in minutes from milliseconds
      const OptivaAuthTimeLeft =
        (OptivaAuthSessionExpiryDateTime - currentDateTime) / 60000; //Value in minutes from milliseconds

      //If time runs out i.e timeLeft <= 0, logout user
      if (OptivaTimeLeft <= 0 && this.hasSessionLogoutBeenCalled === false) {
        this.sessionLogout();
      }

      if (
        OptivaAuthTimeLeft <= 0 &&
        this.hasSessionLogoutBeenCalled === false
      ) {
        this.sessionLogout();
      }
    });

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = `You're now active`;

      const OptivaData = JSON.parse(localStorage.getItem('Optiva')!);
      const OptivaAuthData = JSON.parse(localStorage.getItem('Optiva_auth')!);

      const OptivaSessionExpiryDateTime = OptivaData.exp;
      const OptivaAuthSessionExpiryDateTime = OptivaAuthData.expiryDate;

      const refreshToken = OptivaData?.refreshToken;

      const currentDateTime = new Date().getTime();

      const OptivaTimeLeft =
        (OptivaSessionExpiryDateTime - currentDateTime) / 60000; //Value in minutes from milliseconds
      const OptivaAuthTimeLeft =
        (OptivaAuthSessionExpiryDateTime - currentDateTime) / 60000; //Value in minutes from milliseconds

      if (
        ((OptivaTimeLeft <= 5 /**5 minutes**/ && OptivaTimeLeft > 0) ||
          (OptivaAuthTimeLeft <= 5 /**5 minutes**/ &&
            OptivaAuthTimeLeft > 0)) &&
        this.hasRefreshTokenBeenCalled === false
      ) {
        this.store.dispatch(
          AuthActions.RefreshToken({
            payload: {
              refreshToken: refreshToken,
            },
          })
        );

        this.hasRefreshTokenBeenCalled = true;
      }

      if (OptivaTimeLeft <= 0 && this.hasSessionLogoutBeenCalled === false) {
        this.sessionLogout();
      }

      if (
        OptivaAuthTimeLeft <= 0 &&
        this.hasSessionLogoutBeenCalled === false
      ) {
        this.sessionLogout();
      }
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';

      /** As a last resort, if "this.idle.setTimeout(3600);" timesout
       *  and the both bearer tokens are still active,
       *  that means 3600 seconds (1 hour) has passed. So log the user out */
      this.sessionLogout();
    });
  }

  autoLogout() {
    const notification: Notification = {
      state: 'error',
      message: `Your session has expired. Logging you out now.`,
    };

    this.notificationService.openSnackBar(
      notification,
      'opt-notification-error'
    );

    setTimeout(() => {
      this.store.dispatch(AuthActions.Logout());
    }, 5000);
  }

  sessionLogout() {
    this.autoLogout();

    this.hasSessionLogoutBeenCalled = true;
  }

  startActivityMonitor() {
    this.idle.watch();
  }

  stopActivityMonitor() {
    if (this.idle) {
      this.idle.stop();
      // this.idle.onTimeout.unsubscribe();
    }
  }
}
