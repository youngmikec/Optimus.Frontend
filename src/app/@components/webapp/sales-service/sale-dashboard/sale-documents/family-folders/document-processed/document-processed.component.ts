import { Component, Input, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { PhasesEnum } from '../../../sale-overview/sale-overview.component';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import { ActivatedRoute } from '@angular/router';
import { DocumentCollectionService } from 'src/app/@core/stores/document-collection/document-collection.service';
import { FamilyFolder } from '../document-collected/document-collected.component';
import * as DocumentProcessingActions from 'src/app/@core/stores/document-processing/document-processing.action';
import * as DocumentProcessingSelector from 'src/app/@core/stores/document-processing/document-processing.selectors';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as FamilyMemberActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { detailExpand } from 'src/app/@core/animations/animation';

export interface DocumentsElement {
  name: string;
  documents: Documents[];
}

export interface Documents {
  document: string;
  documentFolder: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  version: string;
  isChecked: boolean;
  comment?: string;
  nextActor?: string;
  status?: string;
}

@Component({
  selector: 'app-document-processed',
  templateUrl: './document-processed.component.html',
  styleUrls: ['./document-processed.component.scss'],
  animations: [detailExpand],
})
export class DocumentProcessedComponent implements OnInit {
  private TABLE_DATA: DocumentsElement[] = [
    {
      name: 'John Wale',
      documents: [
        {
          document: 'Deuterium',
          documentFolder: '2.014',
          lastModifiedDate: '2/22/12',
          lastModifiedBy: 'Sunday',
          version: '1',
          isChecked: false,
        },
        {
          document: 'Tritium',
          documentFolder: '3.016',
          lastModifiedDate: '2/22/12',
          lastModifiedBy: 'Sunday',
          version: '1',
          isChecked: false,
        },
      ],
    },
    {
      name: 'Ade Seun',
      documents: [
        {
          document: 'Helium-3',
          documentFolder: '3.016',
          lastModifiedDate: '2/22/12',
          lastModifiedBy: 'Sunday',
          version: '1',
          isChecked: false,
        },
        {
          document: 'Helium-4',
          documentFolder: '4.002',
          lastModifiedDate: '2/22/12',
          lastModifiedBy: 'Sunday',
          version: '1',
          isChecked: false,
        },
      ],
    },
  ];

  dataSource = this.TABLE_DATA;
  columnsToDisplay = ['name'];
  documentColumnsToDisplay = [
    'select',
    'document',
    'documentFolder',
    'lastModifiedDate',
    'lastModifiedBy',
    'version',
  ];
  selection = new SelectionModel<DocumentsElement>(true, []);
  expandAll: boolean = false;

  confirmDocumentList: DocumentsElement[] = [];

  public selectDocument: boolean = false;
  @Input() documentPhase!: any;
  public phasesEnum = PhasesEnum;

  public familyFolders: FamilyFolder[] = [];
  public viewFolderFiles: boolean = false;
  public selectedFolder: any;
  private applicationId = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );

  public documentAnalytics$: Observable<any> = this.store
    .select(DocumentProcessingSelector.documentAnalyticsSelector)
    .pipe(shareReplay());

  constructor(
    private store: Store<fromApp.AppState>,
    private docCollectionService: DocumentCollectionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getFamilyMembers();
    this.getDocumentAnalytics();
  }

  getDocumentAnalytics() {
    this.store.dispatch(
      DocumentProcessingActions.getDocumentAnalytics({
        applicationId: this.applicationId,
      })
    );
  }

  getFamilyMembers() {
    this.store.dispatch(
      FamilyMemberActions.getFamilyMembersByApplicationId({
        applicationId: this.applicationId,
      })
    );

    this.store
      .select(FamilyMemberSelector.getApplicationsFamilyMembersSelector)
      .subscribe({
        next: (result: any) => {
          this.familyFolders = result?.map((member: any) => ({
            name: `${member.firstName} ${member.lastName}`,
            familyMemberId: member.familyMemberId,
            folders: [],
          }));
        },
      });
  }

  getMemberFolders(familyMember: any) {
    if (familyMember.folders?.length > 0) return;

    this.docCollectionService
      .getFamilyMemberFolders(familyMember.familyMemberId)
      .subscribe({
        next: (result) => {
          const folder = result.entity;
          folder?.forEach(
            (member: any) => (member['name'] = familyMember.name)
          );
          familyMember.folders = folder;
        },
      });
  }

  getFolderFiles(folder: any) {
    this.store.dispatch(
      DocumentCollectionActions.getDocumentFolderFiles({
        folderId: folder.folderId,
      })
    );
    this.selectedFolder = folder;
    this.viewFolderFiles = true;
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
      tableData.documents?.forEach((docs) => (docs.isChecked = true));

      if (confirmList)
        this.confirmDocumentList?.splice(confirmListIndex, 1, tableData);
      else
        this.confirmDocumentList = [
          ...this.confirmDocumentList,
          this.dataSource[index],
        ];
    } else {
      tableData.documents.forEach((docs) => (docs.isChecked = false));
      this.confirmDocumentList.splice(confirmListIndex, 1);
    }
  }

  singleCheck(event: MatCheckboxChange, row: Documents, index: number) {
    const rowData = this.dataSource[index];
    const document = rowData.documents?.find(
      (doc) => doc.document === row.document
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
}
