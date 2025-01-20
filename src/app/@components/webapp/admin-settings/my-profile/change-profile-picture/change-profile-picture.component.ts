import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { select, Store } from '@ngrx/store';
import * as userSelectors from 'src/app/@core/stores/users/users.selectors';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as UsersActions from 'src/app/@core/stores/users/users.actions';

@Component({
  selector: 'app-change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.scss'],
})
export class ChangeProfilePictureComponent implements OnInit {
  isLoading!: Observable<any>;
  logoPreview: any;
  profileForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeProfilePictureComponent>,
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.store.pipe(select(userSelectors.getUsersIsLoading));

    this.buildForm();

    this.patchProfilePicture();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      profilePicture: [''],
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

  onUploadLogo(event: Event) {
    const _event: any = event.target as HTMLInputElement;

    const file = _event.files[0];

    if (file && file.size <= 1000000) {
      const reader = new FileReader();

      reader.onload = () => {
        const fullBase64String = reader.result!.toString();
        const base64String = fullBase64String.split(',');

        this.profileForm.patchValue({
          profilePicture: base64String[1],
        });

        this.logoPreview = fullBase64String;
      };

      reader.readAsDataURL(file);
    } else {
      const notification: Notification = {
        state: 'warning',
        message: 'The maximum image size is 1MB',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
    }
  }

  patchProfilePicture() {
    if (this.data) {
      this.profileForm?.patchValue({
        profilePicture: this.data?.profile?.profilePicture,
      });

      this.logoPreview = this.data?.profile?.profilePicture;
    }
  }

  editProfilePicture() {
    this.store.dispatch(UsersActions.IsLoading({ payload: true }));
    this.store.dispatch(
      UsersActions.UpdateUserProfilePicture({
        payload: {
          profilePicture: this.profileForm.value.profilePicture,
        },
      })
    );
  }
}
