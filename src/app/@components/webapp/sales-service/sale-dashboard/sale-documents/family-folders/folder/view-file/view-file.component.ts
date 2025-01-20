import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss'],
})
export class ViewFileComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService
  ) {}

  download(fileUrl: string, fileName: string) {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      })
      .catch(() => {
        const notification: Notification = {
          state: 'error',
          message: 'Error while downloading file',
        };
        this.notificationService.openSnackBar(
          notification,
          'opt-notification-error'
        );
      });
  }

  print() {
    window.print();
  }

  async send() {
    const shareData = {
      title: this.data.fileName,
      url: this.data.documentUrl,
    };

    try {
      await navigator.share(shareData);
      const notification: Notification = {
        state: 'success',
        message: 'File sent successfully',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-success'
      );
    } catch (err) {
      const notification: Notification = {
        state: 'error',
        message: 'An error occured sending file',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
