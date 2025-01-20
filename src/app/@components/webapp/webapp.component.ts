import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { Store } from '@ngrx/store';
import { routeAnimations } from 'src/app/@core/animations/route.animations';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { AuthService } from 'src/app/@core/services/auth.service';
import { NotificationService } from 'src/app/@core/services/notification.service';
// import * as fromApp from 'src/app/@core/stores/app.reducer';

@Component({
  selector: 'app-webapp',
  templateUrl: './webapp.component.html',
  styleUrls: ['./webapp.component.scss'],
  animations: [routeAnimations],
})
export class WebappComponent implements OnInit {
  @ViewChild('mainContent', { static: false }) mainContent!: ElementRef;

  constructor(
    // private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkExpiryStatusOfNg2Idle();
  }

  onRouteActivate(event: any) {
    (this.mainContent?.nativeElement as HTMLElement)?.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }

  checkExpiryStatusOfNg2Idle() {
    /**if a user is
     * logged in and leaves the browser window or
     * their device goes to sleep
     * and in that mean time,
     * 'ng2Idle.main.expiry' || 'Optiva' || 'Optiva_auth' expires
     * this function acts as a force logout feature
     */
    document.addEventListener('visibilitychange', () => {
      const OptivaData: {
        accessToken: string;
        userToken: string;
        exp: number;
      } = JSON.parse(localStorage.getItem('Optiva')!);

      const OptivaAuthData: {
        bearer_token: string;
        expiryDate: number;
      } = JSON.parse(localStorage.getItem('Optiva_auth')!);

      const ng2IdleMainExpiry = parseInt(
        localStorage.getItem('ng2Idle.main.expiry')!
      );

      if (
        (ng2IdleMainExpiry < new Date().getTime() ||
          (OptivaData?.exp < new Date().getTime() && ng2IdleMainExpiry) ||
          (OptivaAuthData?.expiryDate < new Date().getTime() &&
            ng2IdleMainExpiry)) &&
        document.visibilityState === 'visible'
      ) {
        const notification: Notification = {
          state: 'warning',
          message: `Welcome Back. Your session has expired. Logging you out now.`,
        };

        this.notificationService.openSnackBar(
          notification,
          'opt-notification-warning'
        );

        setTimeout(() => {
          this.authService.hasSessionLogoutBeenCalled = false;
          this.authService.stopActivityMonitor();
          localStorage.removeItem('Optiva');
          localStorage.removeItem('Optiva_auth');
          location.reload();
        }, 5000);
      }
    });
  }
}
