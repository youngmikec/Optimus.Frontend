import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-delete-note-modal',
  templateUrl: './delete-note-modal.component.html',
  styleUrls: ['./delete-note-modal.component.scss'],
})
export class DeleteNoteModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteNoteModalComponent>) {
    this.undoListener();
  }

  undoListener() {
    fromEvent(window, 'keydown').subscribe({
      next: (keyEvent: any) => {
        const isCtrlKey = keyEvent.ctrlKey || keyEvent.metaKey; // Checks if the Ctrl key or the Command key is held down
        if (isCtrlKey && (keyEvent.key === 'z' || keyEvent.code === 'KeyZ'))
          this.closeDialog(false);
      },
    });
  }

  closeDialog(action: boolean) {
    this.dialogRef.close(action);
  }
}
