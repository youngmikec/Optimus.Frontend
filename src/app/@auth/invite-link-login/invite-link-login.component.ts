import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthAction from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { ActivatedRoute, Params } from '@angular/router';

import * as GeneralActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';

@Component({
  selector: 'app-invite-link-login',
  templateUrl: './invite-link-login.component.html',
  styleUrls: ['./invite-link-login.component.scss'],
})
export class InviteLinkLoginComponent implements OnInit, OnDestroy {
  showPassword = false;
  showConfirmPassword = false;
  inviteLinkForm!: FormGroup;

  isLoading!: Observable<boolean>;

  deviceId!: string;
  deviceType!: number;
  user$!: Observable<Params>;
  email!: string;
  registerWithInviteEffectSub!: Subscription;
  activatedRouteSub!: Subscription;
  token!: string;
  getBearerTokenStatusSub!: Subscription;
  getDeviceTypeSub!: Subscription;
  allDeviceType!: any;
  isDisabled = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,

    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));

    this.buildInviteLinkForm();

    this.getUserInfoFromRoute();

    this.getDeviceTypeSub = this.store
      .pipe(select(GeneralSelectors.getAllDeviceType))
      .subscribe((response) => {
        if (response !== null) {
          this.allDeviceType = response;

          if (this.allDeviceType !== null) {
            this.allDeviceType?.forEach((i: any) => {
              if (i.name === 'Web') {
                this.deviceType = i.value;
              }
            });
          }
        } else {
          this.store.dispatch(GeneralActions.GetAllDeviceType());
        }
      });
  }

  getUserInfoFromRoute() {
    this.activatedRouteSub = this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['email']) {
          this.email = params['email'];
          //console.log(this.email, 'emaillog');
          this.patchEmail();
        }

        if (params['token']) {
          this.token = params['token'];
        }
      }
    );
    //   return (this.user$ = this.route.queryParams.pipe(
    //     tap((params) => {
    //       this.email = params['email'];
    //       console.log(this.email, 'asd');
    //     })
    //   ));
  }

  patchEmail() {
    this.inviteLinkForm?.patchValue({
      email: this.email,
    });
  }

  buildInviteLinkForm() {
    this.inviteLinkForm = this.fb.group(
      {
        email: [
          { value: null, disabled: true },
          [Validators.required, Validators.email],
        ],
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

  get inviteLoginFormControls(): { [key: string]: AbstractControl } {
    return this.inviteLinkForm.controls;
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
    this.inviteLinkForm.get('email')?.updateValueAndValidity();
    if (
      instance === 'email' &&
      this.inviteLoginFormControls['email'].hasError('required')
    ) {
      return 'Please enter your email';
    } else if (
      instance === 'email' &&
      this.inviteLoginFormControls['email'].hasError('email')
    ) {
      return 'Sorry, this is not a valid email';
    } else if (
      instance === 'password' &&
      this.inviteLoginFormControls['password'].hasError('required')
    ) {
      return 'Please enter your password';
    } else if (
      instance === 'password' &&
      this.inviteLoginFormControls['password'].hasError('pattern')
    ) {
      return 'Your password must have at least 1 uppercase, digit (0-9), special character, and a minimum of 8 characters.';
    } else if (
      instance === 'confirmPassword' &&
      this.inviteLoginFormControls['confirmPassword'].hasError('required')
    ) {
      return 'This field is required';
    } else if (
      instance === 'confirmPassword' &&
      this.inviteLoginFormControls['confirmPassword'].hasError('notEquivalent')
    ) {
      return 'Sorry, this does not match your new password';
    } else {
      return;
    }
  }

  onSubmit() {
    this.store.dispatch(AuthAction.IsLoading({ payload: true }));

    // this.helperService.manageDeveloperTokenAndCallFunction(
    //   this.login.bind(this)
    // );

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
      AuthAction.InviteLinkLogin({
        payload: {
          email: this.email,
          password: this.inviteLinkForm.value.password,
          deviceId: this.deviceId,
          deviceType: this.deviceType,
        },
      })
    );
  }

  // listenToSignUpWithInviteEffects() {
  //   this.registerWithInviteEffectSub =
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

  ngOnDestroy(): void {
    if (this.registerWithInviteEffectSub) {
      this.registerWithInviteEffectSub.unsubscribe();
    }

    if (this.activatedRouteSub) {
      this.activatedRouteSub.unsubscribe();
    }

    if (this.getBearerTokenStatusSub) {
      this.getBearerTokenStatusSub.unsubscribe();
    }

    if (this.getDeviceTypeSub) {
      this.getDeviceTypeSub.unsubscribe();
    }
  }
}
