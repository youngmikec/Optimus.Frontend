import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// import {
//   RouteConfigLoadEnd,
//   RouteConfigLoadStart,
//   Router,
// } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { Observable } from 'rxjs';
//import { MatDialog } from '@angular/material/dialog';

import { HelperService } from 'src/app/@core/services/helper.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loadingRouteConfig: boolean = false;
  isLoading!: Observable<boolean>;
  emailControl: FormControl = new FormControl('', Validators.required);
  // getBearerTokenStatusSub!: Subscription;
  // year!: number;
  // routerEvents!: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    // public dialog: MatDialog,
    // private router: Router

    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));
  }

  onSubmit() {
    this.store.dispatch(AuthActions.IsLoading({ payload: true }));

    this.helperService.manageDeveloperTokenAndCallFunction(
      this.forgotPassword.bind(this)
    );
  }

  forgotPassword() {
    this.store.dispatch(
      AuthActions.ForgotPassword({
        payload: {
          email: this.emailControl.value,
        },
      })
    );
  }

  // ngOnDestroy() {
  //   if (this.getBearerTokenStatusSub) {
  //     this.getBearerTokenStatusSub.unsubscribe();
  //   }

  //   if (this.routerEvents) {
  //     this.routerEvents.unsubscribe();
  //   }
  // }
}
