import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as DocumentProcessingActions from 'src/app/@core/stores/document-processing/document-processing.action';
import * as DocumentSupportActions from 'src/app/@core/stores/document-support/document-support.action';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import * as GeneralSelectors from 'src/app/@core/stores/general/general.selectors';
import * as fromApp from 'src/app/@core/stores/app.reducer';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PhasesEnum } from '../../../../sale-overview/sale-overview.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reject-document',
  templateUrl: './reject-document.component.html',
  styleUrls: ['./reject-document.component.scss'],
})
export class RejectDocumentComponent {
  public buttonLoading: Observable<boolean> = this.store.select(
    GeneralSelectors.getGeneralIsLoading
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private dialogRef: MatDialogRef<RejectDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  reject() {
    const { phase, id } = this.data.documentPhase;

    switch (phase as PhasesEnum) {
      case PhasesEnum.DOCUMENT_PROCESSING:
      case PhasesEnum.DOCUMENT_COLLATION:
        this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
        this.store.dispatch(
          DocumentProcessingActions.cmaRejectDocument({
            folderId: this.data.folderId,
            documentId: this.data.documentId,
            applicationPhaseId: id,
          })
        );
        break;
      case PhasesEnum.DOCUMENT_SUPPORT:
        this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
        this.store.dispatch(
          DocumentSupportActions.hcmRejectDocument({
            folderId: this.data.folderId,
            documentId: this.data.documentId,
            applicationPhaseId: id,
          })
        );
        break;
    }

    this.cancel();
  }
}
