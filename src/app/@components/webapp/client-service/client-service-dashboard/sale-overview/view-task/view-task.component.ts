import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss'],
})
export class ViewTaskComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public task: any,
    public dialogRef: MatDialogRef<ViewTaskComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
