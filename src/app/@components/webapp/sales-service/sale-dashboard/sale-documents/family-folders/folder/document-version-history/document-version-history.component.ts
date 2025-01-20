import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';
import { ViewFileComponent } from '../view-file/view-file.component';

@Component({
  selector: 'app-document-version-history',
  templateUrl: './document-version-history.component.html',
  styleUrls: ['./document-version-history.component.scss'],
})
export class DocumentVersionHistoryComponent implements OnInit {
  @Input() documentId!: number;
  @Input() documentName!: string;
  @Output() closeDocComments: EventEmitter<null> = new EventEmitter();

  versionHistories$: Observable<any> = this.store.select(
    DocumentCollectionSelector.documentVersionHistorySelector
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDocumentVersionHistory();
  }

  close() {
    this.closeDocComments.emit(null);
  }

  getDocumentVersionHistory() {
    this.store.dispatch(
      DocumentCollectionActions.getDocumentVersionHistory({
        documentId: this.documentId,
      })
    );
  }

  viewDocument(documentHistory: any) {
    this.dialog.open(ViewFileComponent, {
      data: {
        fileName: documentHistory.documentName,
        documentUrl: documentHistory.documentUrl,
        extension: documentHistory.documentName.split('.').at(-1),
      },
      width: '50%',
      height: '100%',
      position: {
        right: '-10px',
      },
    });
  }
}
