import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partner-information',
  templateUrl: './partner-information.component.html',
  styleUrls: ['./partner-information.component.scss'],
})
export class PartnerInformationComponent {
  constructor(public dialogRef: MatDialogRef<PartnerInformationComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
