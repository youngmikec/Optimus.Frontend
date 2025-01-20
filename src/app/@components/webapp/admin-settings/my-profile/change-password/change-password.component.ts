import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MyPasswordErrorStateMatcher } from 'src/app/@core/utils/error-state-matcher';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
import { AuthEffects } from 'src/app/@core/stores/auth/auth.effects';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  isLoading!: Observable<boolean>;
  changePasswordForm!: FormGroup;
  hideCurrentPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  //matcher = new MyPasswordErrorStateMatcher();
  changePasswordEffectSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<fromApp.AppState>,
    private changePasswordEffect: AuthEffects
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(authSelectors.getAuthIsLoading));

    this.createChangePasswordForm();

    this.onChangePasswordSuccess();
  }

  createChangePasswordForm() {
    return (this.changePasswordForm = this.fb.group(
      {
        current_password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],
        new_password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],
        confirm_password: [null],
      }
      //{ validator: this.matcher.confirmPasswordValidation }
    ));
  }

  get changePasswordFormControls() {
    return this.changePasswordForm.controls;
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'current_password' &&
      this.changePasswordFormControls['current_password'].hasError('required')
    ) {
      return 'Please enter your current password';
    } else if (
      instance === 'current_password' &&
      this.changePasswordFormControls['current_password'].hasError('pattern')
    ) {
      return 'Your password must have at least 1 uppercase, digit (0-9), special character, and a minimum of 8 characters.';
    } else if (
      instance === 'new_password' &&
      this.changePasswordFormControls['new_password'].hasError('required')
    ) {
      return 'Please enter your new password';
    } else if (
      instance === 'new_password' &&
      this.changePasswordFormControls['new_password'].hasError('pattern')
    ) {
      return 'Your password must have at least 1 uppercase, digit (0-9), special character, and a minimum of 8 characters.';
    } else if (
      instance === 'confirm_password' &&
      this.changePasswordForm.hasError('paswordNotSame')
    ) {
      return 'Passwords do not match';
    } else {
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changePassword() {
    this.store.dispatch(AuthActions.IsLoading({ payload: true }));

    this.store.dispatch(
      AuthActions.ChangePassword({
        payload: {
          email: this.data.email,
          oldPassword: this.changePasswordForm.value.current_password,
          newPassword: this.changePasswordForm.value.new_password,
        },
      })
    );
  }

  onChangePasswordSuccess() {
    this.changePasswordEffectSub =
      this.changePasswordEffect.changePassword$.subscribe((resData) => {
        if (resData.succeeded) {
          this.store.dispatch(AuthActions.IsLoading({ payload: false }));

          this.closeDialog();
        }
      });
  }

  ngOnDestroy() {
    if (this.changePasswordEffectSub) {
      this.changePasswordEffectSub.unsubscribe();
    }
  }
}
