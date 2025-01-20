import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as GeneralLoaderActions from 'src/app/@core/stores/general/general.actions';
import * as DocumentCollectionAction from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';
import { PhasesEnum } from '../sale-overview/sale-overview.component';
import { fadeInDown } from 'src/app/@core/animations/animation';

@Component({
  selector: 'app-sale-documents',
  templateUrl: './sale-documents.component.html',
  styleUrls: ['./sale-documents.component.scss'],
  animations: [fadeInDown],
})
export class SaleDocumentsComponent implements OnDestroy {
  @Input() set extras(phase: any) {
    this.documentPhase = phase;
  }

  public activeSection:
    | 'currate'
    | 'family-details'
    | 'document-question'
    | 'family-folders' = 'currate';

  public documentPhase!: any;

  public phasesEnum = PhasesEnum;
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<fromApp.AppState>) {}

  saveApplicantFamilyMembers(familyRecord: any) {
    this.subscription.add(
      this.store
        .select(DocumentCollectionSelector.createdFamilyMemberDetailsSelector)
        .subscribe({
          next: (isCreated: boolean) => {
            this.store.dispatch(
              GeneralLoaderActions.IsLoading({ payload: true })
            );

            if (isCreated) {
              setTimeout(() => {
                this.store.dispatch(
                  GeneralLoaderActions.IsLoading({ payload: false })
                );
                this.activeSection = 'document-question';
              }, 3000);
            }
          },
        })
    );

    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentCollectionAction.saveApplicationFamilyMemberDetails({
        payload: { applicationPhaseId: this.documentPhase.id, ...familyRecord },
      })
    );
  }

  saveDocumentParameters(parameters: any) {
    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentCollectionAction.saveDocumentParameters({ payload: parameters })
    );
  }

  submitDocumentParameters(parameters: any) {
    this.subscription.add(
      this.store
        .select(DocumentCollectionSelector.createdDocumentParametersSelector)
        .subscribe({
          next: (isCreating: boolean) => {
            this.activeSection = 'family-folders';
          },
        })
    );

    this.store.dispatch(GeneralLoaderActions.IsLoading({ payload: true }));
    this.store.dispatch(
      DocumentCollectionAction.submitDocumentParameters({
        payload: { applicationPhaseId: this.documentPhase.id, ...parameters },
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
