import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentAuditActions from 'src/app/@core/stores/document-audit/document-audit.action';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import { partnersSelector } from 'src/app/@core/stores/document-audit/document-audit.selectors';

@Component({
  selector: 'app-partners-modal',
  templateUrl: './partners-modal.component.html',
  styleUrls: ['./partners-modal.component.scss'],
})
export class PartnersModalComponent implements OnInit {
  public partners$: Observable<any> = this.store.select(partnersSelector);
  private partnerUserIds: any[] = [];

  constructor(
    private store: Store<fromApp.AppState>,
    private dialogRef: MatDialogRef<PartnersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      DocumentAuditActions.getPartners({ skip: 0, take: 20 })
    );
  }

  togglePartnersCheck(event: MatCheckboxChange, partner: any) {
    if (event.checked) this.partnerUserIds.push(partner.partnerUserId);
    else {
      const index = this.partnerUserIds.findIndex(
        (partnerUserId) => partnerUserId === partner.partnerUserId
      );
      this.partnerUserIds.splice(index, 1);
    }
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    const familyMemberDocumentId: number[] = [];

    this.data.selectedDocuments.forEach((member: any) => {
      member.documents.forEach((document: any) => {
        familyMemberDocumentId.push(document?.familyMemberDocumentId);
      });
    });

    const payload = [
      {
        partnerId: this.partnerUserIds,
        familyMemberDocumentId,
      },
    ];

    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentAuditActions.sendToPartner({
        partnerDocuments: payload,
        applicationId: this.data.applicationId,
      })
    );
    this.close();
  }
}
