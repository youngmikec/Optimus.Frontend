import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';
import { Store } from '@ngrx/store';
import { slideInRight } from 'src/app/@core/animations/animation';
import { SalesTableInterface } from 'src/app/@components/webapp/sales-service/sales-service.interface';
import { PhasesEnum } from '../../../sale-overview/sale-overview.component';
import { PermissionService } from 'src/app/@core/services/permission.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  animations: [slideInRight],
})
export class FolderComponent implements OnInit {
  @Input() folderData: any;
  @Input() documentPhase!: any;
  public phasesEnum = PhasesEnum;

  @Output() back: EventEmitter<null> = new EventEmitter();
  viewFileData: boolean = false;
  fileData: any;
  fileExt!: string;

  totalRecords = 10;
  displayedColumns: string[] = [
    'familyMemberDocument',
    'createdDate',
    'createdBy',
    'lastModifiedDate',
    'documentVersion',
    'nextOfficer',
    'documentStatusDesc',
  ];

  dataSource!: MatTableDataSource<any[]>;
  selection = new SelectionModel<SalesTableInterface>(true, []);

  constructor(
    private store: Store<fromApp.AppState>,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.store
      .select(DocumentCollectionSelector.documentFolderFilesSelector)
      .subscribe({
        next: (result: any) => {
          this.dataSource = new MatTableDataSource(result);
        },
      });
  }

  goBack() {
    this.back.emit(null);
  }

  viewFileDetails(record: any) {
    this.fileData = record;
    this.fileExt = this.fileData.familyMemberDocument.documentName
      .split('.')
      .at(-1);
    this.viewFileData = true;
  }

  uploadDocument(ev: any) {
    const file = ev.target.files[0];

    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentCollectionActions.uploadFamilyMemberDocument({
        folderId: this.folderData.folderId,
        document: file,
      })
    );
  }
}
