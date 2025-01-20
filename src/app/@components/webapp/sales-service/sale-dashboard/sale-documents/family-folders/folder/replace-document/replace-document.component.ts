import { Component, Inject } from '@angular/core';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-replace-document',
  templateUrl: './replace-document.component.html',
  styleUrls: ['./replace-document.component.scss'],
})
export class ReplaceDocumentComponent {
  public replacedFile: File | null = null;
  public isFileUploaded: boolean = false;
  public fileSize: string = '';

  constructor(
    private store: Store<fromApp.AppState>,
    private dialogRef: MatDialogRef<ReplaceDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  uploadFile(ev: any) {
    const file = ev.target.files[0];
    this.replacedFile = file;
    this.isFileUploaded = !this.isFileUploaded;

    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    this.fileSize = (fileSizeInKB / 1024).toFixed(2);
  }

  removeFile() {
    this.replacedFile = null;
    this.isFileUploaded = !this.isFileUploaded;
    this.fileSize = '';
  }

  replaceDocument() {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentCollectionActions.replaceFamilyMemberDocument({
        folderId: this.data.folderId,
        documentId: this.data.documentId,
        document: this.replacedFile!,
      })
    );

    this.cancel();
  }
}
