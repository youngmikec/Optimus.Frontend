import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
})
export class UserInformationComponent {
  constructor(public dialogRef: MatDialogRef<UserInformationComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
