import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
//import { HelperService } from 'src/app/@core/services/helper.service';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthAction from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  showPassword = false;
  showConfirmPassword = false;
  resetPasswordForm!: FormGroup;

  isLoading!: Observable<boolean>;

  user$!: Observable<Params>;
  emailAddress!: string;
  //resetPasswordEffectSub!: Subscription;
  activatedRouteSub!: Subscription;
  token!: string;
  getBearerTokenStatusSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildresetPasswordForm();
    this.getUserInfoFromRoute();

    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));
  }

  getUserInfoFromRoute() {
    this.activatedRouteSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['email']) {
          this.emailAddress = params['email'];
          this.patchEmail();
        }

        if (params['token']) {
          this.token = params['token'];
        }
      }
    );
  }

  patchEmail() {
    this.resetPasswordForm?.patchValue({
      email: this.emailAddress,
    });
  }

  buildresetPasswordForm() {
    this.resetPasswordForm = this.fb.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],

        confirmPassword: [null, Validators.required],
      },
      {
        validator: this.checkIfPasswordMatches('password', 'confirmPassword'),
      }
    );
  }

  get resetPasswordFormControls(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }

  checkIfPasswordMatches(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];

      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  getErrorMessage(instance: string) {
    this.resetPasswordForm.get('email')?.updateValueAndValidity();
    if (
      instance === 'email' &&
      this.resetPasswordFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.resetPasswordFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'password' &&
      this.resetPasswordFormControls['password'].hasError('required')
    ) {
      return 'Please enter your password';
    } else if (
      instance === 'password' &&
      this.resetPasswordFormControls['password'].hasError('pattern')
    ) {
      return 'Your password must have at least 1 uppercase, digit (0-9), special character, and a minimum of 8 characters.';
    } else if (
      instance === 'confirmPassword' &&
      this.resetPasswordFormControls['confirmPassword'].hasError('required')
    ) {
      return 'This field is required';
    } else if (
      instance === 'confirmPassword' &&
      this.resetPasswordFormControls['confirmPassword'].hasError(
        'notEquivalent'
      )
    ) {
      return 'Sorry, this does not match your new password';
    } else {
      return;
    }
  }

  onSubmit() {
    this.store.dispatch(AuthAction.IsLoading({ payload: true }));

    if (localStorage.getItem('Optiva_auth') === null) {
      this.store.dispatch(AuthAction.InitializeApp_DeveloperToken());

      this.getBearerTokenStatusSub = this.store
        .pipe(select(authSelectors.getDeveloperTokenStatus))
        .subscribe((status) => {
          if (status && status === true) {
            this.login();
          }
        });
    } else {
      this.login();
    }
  }

  login() {
    this.store.dispatch(
      AuthAction.ResetPassword({
        payload: {
          email: this.resetPasswordForm.value.email,
          newPassword: this.resetPasswordForm.value.password,
        },
      })
    );
  }

  // listenToSignUpWithInviteEffects() {
  //   this.resetPasswordEffectSub =
  //     this.authEffects.authLoginWithInvite$.subscribe((resData) => {
  //       if (resData !== null) {
  //         if (resData.succeeded === true) {
  //           const email = resData?.entity?.user?.email;

  //           if (email) {
  //             this.router.navigate([`app/admin-settings/${email}`]);
  //           }
  //         }
  //       }
  //     });
  // }

  ngOnDestroy() {
    if (this.activatedRouteSub) {
      this.activatedRouteSub.unsubscribe();
    }

    if (this.getBearerTokenStatusSub) {
      this.getBearerTokenStatusSub.unsubscribe();
    }
  }
}
