import { Component, Input, OnInit } from '@angular/core';
import { detailExpand, slideInRight } from 'src/app/@core/animations/animation';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PhasesEnum } from '../../../sale-overview/sale-overview.component';
import { FamilyFolder } from '../document-collected/document-collected.component';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as FamilyMemberActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import * as DocumentAuditActions from 'src/app/@core/stores/document-audit/document-audit.action';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';

import { DocumentCollectionService } from 'src/app/@core/stores/document-collection/document-collection.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../../sale-overview/confirmation-modal/confirmation-modal.component';
import { PartnersModalComponent } from './partners-modal/partners-modal.component';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { PermissionService } from 'src/app/@core/services/permission.service';

@Component({
  selector: 'app-document-sent-to-partner',
  templateUrl: './document-sent-to-partner.component.html',
  styleUrls: ['./document-sent-to-partner.component.scss'],
  animations: [detailExpand, slideInRight],
})
export class DocumentSentToPartnerComponent implements OnInit {
  @Input() documentPhase!: any;
  public phasesEnum = PhasesEnum;

  public dataSource: any[] = [];
  public documentColumnsToDisplay = [
    'select',
    'documentName',
    'folderName',
    'lastModifiedDate',
    'lastModifiedBy',
    'documentVersion',
    'comment',
    'nextOfficer',
    'documentStatusDesc',
  ];

  public confirmDocumentList: any[] = [];

  public viewFileData: boolean = false;
  public fileData: any;
  public fileExt!: string;

  public familyFolders: FamilyFolder[] = [];
  public viewFolderFiles: boolean = false;
  public selectedFolder: any;
  private applicationId = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private docCollectionService: DocumentCollectionService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.getFamilyMembers();
  }

  // TODO: Refactor how record its being fectched here
  getFamilyMembers() {
    this.store.dispatch(
      FamilyMemberActions.getFamilyMembersByApplicationId({
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(FamilyMemberSelector.getApplicationsFamilyMembersSelector)
      .subscribe({
        next: async (result: any) => {
          if (result) {
            const mappedResponse = await Promise.all(
              result?.map(async (member: any) => {
                return {
                  name: `${member.firstName} ${member.lastName}`,
                  documents: await this.getFamilyMemberFolderDocuments(
                    member.familyMemberId
                  ),
                };
              })
            );

            this.dataSource = mappedResponse;
            this.confirmDocumentList = mappedResponse;
          }
        },
      });
  }

  extractName(jsonString: string) {
    try {
      const parsedArray = JSON.parse(jsonString);
      if (Array.isArray(parsedArray) && parsedArray.length > 0) {
        return parsedArray[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getFamilyMemberFolderDocuments(familymemberId: number): Promise<any[]> {
    const folderDocuments: any[] = [];

    try {
      // Get list of folders for a family member
      const folders = await firstValueFrom(
        this.docCollectionService.getFamilyMemberFolders(familymemberId).pipe(
          map((resp: any) => {
            return resp.entity;
          })
        )
      );

      // Resolves all documents existing to a folder, which returns an array of arrays
      const documents: any = await firstValueFrom(
        forkJoin(
          folders?.map((folder: any) =>
            this.docCollectionService
              .getDocumentFolderFiles({ folderId: folder?.folderId })
              .pipe(
                map((resp: any) => {
                  return resp.entity;
                })
              )
          )
        )
      );

      // Filter out only documents with the latest version
      folders?.forEach((folder: any, index: number) => {
        let latestVersion = 0;

        const documentWithLatestVersion = documents[index]?.find(
          (document: any) => {
            const version = document?.familyMemberDocument?.documentVersion;
            if (version > latestVersion) latestVersion = version;
            return version === latestVersion;
          }
        );

        if (documentWithLatestVersion) {
          if (
            documentWithLatestVersion['folderName'] == null ||
            documentWithLatestVersion['folderName'] == undefined
          ) {
            documentWithLatestVersion['folderName'] = this.extractName(
              folder?.folderName
            );
          }
          if (
            documentWithLatestVersion['isChecked'] == null ||
            documentWithLatestVersion['isChecked'] == undefined
          ) {
            documentWithLatestVersion['isChecked'] = false;
          }

          folderDocuments.push(documentWithLatestVersion);
        }
      });
    } catch (error: any) {
      const notification: Notification = {
        state: 'error',
        message: error?.message,
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
    }

    return folderDocuments;
  }

  masterCheck(event: MatCheckboxChange, index: number) {
    const tableData = this.dataSource[index];

    const confirmList = this.confirmDocumentList?.find(
      (doc) => doc.name === tableData.name
    );

    const confirmListIndex = this.confirmDocumentList?.findIndex(
      (doc) => doc.name === tableData.name
    );

    if (event.checked) {
      tableData.documents?.forEach((docs: any) => (docs.isChecked = true));

      if (confirmList)
        this.confirmDocumentList?.splice(confirmListIndex, 1, tableData);
      else
        this.confirmDocumentList = [
          ...this.confirmDocumentList,
          this.dataSource[index],
        ];
    } else {
      tableData.documents?.forEach((docs: any) => (docs.isChecked = false));
      this.confirmDocumentList.splice(confirmListIndex, 1);
    }
  }

  singleCheck(event: MatCheckboxChange, row: any, index: number) {
    const rowData = this.dataSource[index];
    const document = rowData.documents?.find(
      (doc: any) => doc.document === row.document
    );

    const docLists = this.confirmDocumentList?.find(
      (docList) => docList.name === rowData.name
    );

    if (event.checked) {
      document && (document.isChecked = true);

      if (docLists) docLists.documents = rowData.documents;
      else this.confirmDocumentList.push(rowData);
    } else {
      document && (document.isChecked = false);
      if (docLists) docLists.documents = rowData.documents;
    }
  }

  cancelSelections() {
    this.confirmDocumentList = [];
  }

  viewFileDetails(record: any) {
    this.fileData = record;
    this.fileExt = this.fileData?.familyMemberDocument.documentName
      .split('.')
      .at(-1);
    this.viewFileData = true;
  }

  downloadSelected() {
    this.confirmDocumentList?.forEach(({ documents }) => {
      const fileUrl = documents?.familyMemberDocument?.documentUrl;
      const documentName = documents?.familyMemberDocument?.documentName;
      this.download(fileUrl, documentName);
    });
  }

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
          message: 'Error downloading file',
        };
        this.notificationService.openSnackBar(
          notification,
          'opt-notification-error'
        );
      });
  }

  rejectSelected() {
    this.confirmDocumentList?.forEach(({ documents }) => {
      documents?.forEach(({ familyMemberDocumentId }: any) => {
        const { id } = this.documentPhase;

        this.store.dispatch(
          DocumentAuditActions.daoRejectDocument({
            documentId: familyMemberDocumentId,
            applicationPhaseId: id,
          })
        );
      });
    });
  }

  approveSelected() {
    this.confirmDocumentList.forEach(({ documents }) => {
      documents.forEach(({ familyMemberDocumentId }: any) => {
        const { id } = this.documentPhase;

        this.store.dispatch(
          DocumentAuditActions.daoApproveDocument({
            documentId: familyMemberDocumentId,
            applicationPhaseId: id,
          })
        );
      });
    });
  }

  submit(submitTo: 'hod' | 'partner') {
    let title, subTitle: string;

    switch (submitTo) {
      case 'hod':
        title = 'Ready for Submission?';
        subTitle =
          'Are you sure these documents are ready to be sent for submission to be reviewed by HOD?';
        this.confirm(title, subTitle, submitTo);
        break;

      case 'partner':
        title = 'Send to Partner';
        subTitle =
          'Are you sure these documents are ready to be sent to partner?';
        this.confirm(title, subTitle, submitTo);
        break;
    }
  }

  confirm(title: string, subTitle: string, submitTo: 'hod' | 'partner') {
    const dialog = this.dialog.open(ConfirmationModalComponent, {
      data: {
        iconType: 'warning',
        title,
        subTitle,
      },
      width: '450px',
      position: {
        top: '25px',
      },
    });

    dialog.afterClosed().subscribe({
      next: (value: boolean) => {
        if (submitTo === 'hod') this.submitToHODDAO();
        if (submitTo === 'partner') this.sendToPartner();
      },
    });
  }

  submitToHODDAO() {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentAuditActions.submitToHOD({ applicationId: this.applicationId })
    );
  }

  sendToPartner() {
    this.dialog.open(PartnersModalComponent, {
      width: '550px',
      data: {
        selectedDocuments: this.confirmDocumentList,
        applicationId: this.applicationId,
      },
    });
  }
}
