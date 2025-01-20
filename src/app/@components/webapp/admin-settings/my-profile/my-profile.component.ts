import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as userSelectors from 'src/app/@core/stores/users/users.selectors';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { Notification } from 'src/app/@core/interfaces/notification.interface';
//import { NotificationService } from 'src/app/@core/services/notification.service';
import * as UserActions from 'src/app/@core/stores/users/users.actions';
import * as authSelectors from 'src/app/@core/stores/auth/auth.selectors';
//import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import * as AuthActions from 'src/app/@core/stores/auth/auth.actions';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { SignatureModalComponent } from 'src/app/@core/shared/signature-modal/signature-modal.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  isLoading!: Observable<boolean>;
  logoPreview: any;
  //profileForm!: FormGroup;
  user: any;
  userSub!: Subscription;
  loggedInUser: any;
  firstName: any;
  isDisabled = true;

  changePasswordForm!: FormGroup;
  hideCurrentPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  changePasswordEffectSub!: Subscription;
  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog,
    private fb: FormBuilder // private notificationService: NotificationService ////
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(userSelectors.getUsersIsLoading));

    this.createChangePasswordForm();

    this.getUser();
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
        confirm_password: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        ],
      },
      {
        validator: this.matchPasswords('new_password', 'confirm_password'),
      }
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

  matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ passwordMismatch: true });
      }
    };
  }

  changePassword() {
    this.store.dispatch(AuthActions.IsLoading({ payload: true }));

    this.store.dispatch(
      AuthActions.ChangePassword({
        payload: {
          email: this.user.email,
          oldPassword: this.changePasswordForm.value.current_password,
          newPassword: this.changePasswordForm.value.new_password,
        },
      })
    );
  }

  onChangePassword() {
    this.dialog.open(ChangeProfilePictureComponent, {
      data: {
        profile: this.user,
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'opt-dialog',
      backdropClass: 'opt-dialog-backdrop',
    });
  }

  getUser() {
    this.store.pipe(select(authSelectors.getUser)).subscribe((res) => {
      if (res !== null) this.loggedInUser = res;

      this.store.dispatch(
        UserActions.GetUserById({
          payload: {
            userId: this.loggedInUser?.UserId,
            loggedInUser: this.loggedInUser?.UserId,
          },
        })
      );

      this.userSub = this.store
        .pipe(select(userSelectors.getUserById))
        .subscribe((res) => {
          if (res !== null) {
            this.user = res;
            this.logoPreview = this.user?.profilePicture;
          }
        });
    });
  }

  openSignatureModal() {
    this.dialog.open(SignatureModalComponent, {
      data: {
        type: 'profile',
        userId: '',
      },
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
