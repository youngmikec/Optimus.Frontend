import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import { ActivatedRoute, Params } from '@angular/router';
//import { AuthFeedback } from 'src/app/@core/enums/auth-feedback.enum';

import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';

import { HelperService } from 'src/app/@core/services/helper.service';

@Component({
  selector: 'app-reset-password-message',
  templateUrl: './reset-password-message.component.html',
  styleUrls: ['./reset-password-message.component.scss'],
})
export class ResetPasswordMessageComponent implements OnInit {
  isLoading!: Observable<boolean>;
  email!: string;
  token!: string;

  activatedRouteSub!: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private helperService: HelperService
  ) {
    // this.currentAuthFeeback = +this.activatedRoute.snapshot.params.authFeedback;
    //this.email = this.activatedRoute.snapshot.params['email'];
  }

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));

    this.getUserInfoFromRoute();
  }

  getUserInfoFromRoute() {
    this.activatedRouteSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['email']) {
          this.email = params['email'];
        }

        if (params['token']) {
          this.token = params['token'];
        }
      }
    );
  }

  onSubmitForgotPassword() {
    this.store.dispatch(AuthActions.IsLoading({ payload: true }));

    this.helperService.manageDeveloperTokenAndCallFunction(
      this.forgotPassword.bind(this)
    );
  }

  forgotPassword() {
    this.store.dispatch(
      AuthActions.ForgotPassword({
        payload: {
          email: this.email,
        },
      })
    );
  }
}
