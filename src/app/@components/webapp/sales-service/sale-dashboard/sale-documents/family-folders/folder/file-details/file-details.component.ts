import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewFileComponent } from '../view-file/view-file.component';
import { ReplaceDocumentComponent } from '../replace-document/replace-document.component';
import { slideInOutFromRight } from 'src/app/@core/animations/animation';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { PhasesEnum } from '../../../../sale-overview/sale-overview.component';
import { ApproveDocumentComponent } from '../approve-document/approve-document.component';
import { RejectDocumentComponent } from '../reject-document/reject-document.component';
import { PermissionService } from 'src/app/@core/services/permission.service';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  animations: [slideInOutFromRight],
})
export class FileDetailsComponent {
  @Input() fileData: any;
  @Input() documentPhase!: any;
  @Input() fileExtension!: string;
  @Output() collapse: EventEmitter<null> = new EventEmitter();

  public phasesEnum = PhasesEnum;
  viewDocComments: boolean = false;
  viewDocVersionHistory: boolean = false;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public permissionService: PermissionService
  ) {}

  closeDetails() {
    this.collapse.emit(null);
  }

  viewDocument() {
    this.dialog.open(ViewFileComponent, {
      data: {
        fileName: this.fileData.familyMemberDocument.documentName,
        documentUrl: this.fileData.familyMemberDocument.documentUrl,
        extension: this.fileExtension,
      },
      width: '50%',
      height: '100%',
      position: {
        right: '-10px',
      },
    });
  }

  replaceDocument() {
    const { familyMemberDocumentId, familyMemberDocument } = this.fileData;

    this.dialog.open(ReplaceDocumentComponent, {
      data: {
        folderId: familyMemberDocument.folderId,
        documentId: familyMemberDocumentId,
      },
      width: '550px',
      height: '280px',
      position: {
        top: '25px',
      },
    });
  }

  async sendDocument() {
    const shareData = {
      title: this.fileData.familyMemberDocument.documentName,
      url: this.fileData.familyMemberDocument.documentUrl,
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

  rejectionReason() {}

  approve() {
    const { familyMemberDocumentId, familyMemberDocument } = this.fileData;

    this.dialog.open(ApproveDocumentComponent, {
      data: {
        folderId: familyMemberDocument.folderId,
        documentId: familyMemberDocumentId,
        documentPhase: this.documentPhase,
      },
      width: '450px',
      height: '230px',
      position: {
        top: '25px',
      },
    });
  }

  reject() {
    const { familyMemberDocumentId, familyMemberDocument } = this.fileData;

    this.dialog.open(RejectDocumentComponent, {
      data: {
        folderId: familyMemberDocument.folderId,
        documentId: familyMemberDocumentId,
        documentPhase: this.documentPhase,
      },
      width: '500px',
      height: '350px',
      position: {
        top: '25px',
      },
    });
  }
}
