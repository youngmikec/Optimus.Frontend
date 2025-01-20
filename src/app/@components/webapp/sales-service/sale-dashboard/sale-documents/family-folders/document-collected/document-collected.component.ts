import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as FamilyMemberActions from 'src/app/@core/stores/familyMembers/familyMembers.actions';
import * as FamilyMemberSelector from 'src/app/@core/stores/familyMembers/familyMembers.selectors';
import { DocumentCollectionService } from 'src/app/@core/stores/document-collection/document-collection.service';
import { PhasesEnum } from '../../../sale-overview/sale-overview.component';
import { Observable, filter, shareReplay } from 'rxjs';
import * as DocumentProcessingActions from 'src/app/@core/stores/document-processing/document-processing.action';
import * as DocumentProcessingSelector from 'src/app/@core/stores/document-processing/document-processing.selectors';
import { ActivatedRoute } from '@angular/router';

export interface FamilyFolder {
  name: string;
  familyMemberId: number;
  folders: any[];
}

@Component({
  selector: 'app-document-collected',
  templateUrl: './document-collected.component.html',
  styleUrls: ['./document-collected.component.scss'],
  exportAs: 'documentCollected',
})
export class DocumentCollectedComponent implements OnInit {
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
      .pipe(filter((resp) => !!resp))
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
    if (familyMember?.folders.length > 0) return;

    this.docCollectionService
      .getFamilyMemberFolders(familyMember.familyMemberId)
      .subscribe({
        next: (result) => {
          if (result.succeeded) {
            const folder = result.entity;
            folder?.forEach(
              (member: any) => (member['name'] = familyMember.name)
            );
            familyMember.folders = folder;
          }
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
}
