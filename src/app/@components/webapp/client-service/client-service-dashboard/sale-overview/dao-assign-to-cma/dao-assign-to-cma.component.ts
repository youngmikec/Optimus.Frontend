import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dao-assign-to-cma',
  templateUrl: './dao-assign-to-cma.component.html',
  styleUrls: ['./dao-assign-to-cma.component.scss'],
})
export class DaoAssignToCmaComponent {
  public reasonCtrl: FormControl = new FormControl('', Validators.required);

  constructor(private dialogRef: MatDialogRef<DaoAssignToCmaComponent>) {}

  close() {
    this.dialogRef.close();
  }

  assignCMA() {
    const ctrl = this.reasonCtrl;
    if (ctrl.invalid) return;
    this.dialogRef.close({ reason: ctrl.value });
  }
}
