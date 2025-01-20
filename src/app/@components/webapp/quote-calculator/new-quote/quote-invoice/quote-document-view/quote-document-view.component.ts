import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';

@Component({
  selector: 'app-quote-document-view',
  templateUrl: './quote-document-view.component.html',
  styleUrls: ['./quote-document-view.component.scss'],
})
export class QuoteDocumentViewComponent {
  @Input() data!: {
    fileName: string;
    extension: string;
    documentUrl: string;
  };
  @Output() closeDocumentModal: EventEmitter<any> = new EventEmitter();
  // documentUrl =
  //   'https://flowmonostorage.blob.core.windows.net/uploads/638515332370993869_smart%20att%20pdf.pdf';
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  // closeTray() {
  //   console.log(this.documentUrl);
  // }
  constructor(
    // private dialogRef: MatDialogRef<QuoteDocumentViewComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // public data: {
    //   fileName: string;
    //   extension: string;
    //   documentUrl: string;
    // },
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
    this.closeDocumentModal.emit();
  }
}
