import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PhasesEnum } from '../../sale-overview/sale-overview.component';
import { DocumentCollectedComponent } from './document-collected/document-collected.component';

@Component({
  selector: 'app-family-folders',
  templateUrl: './family-folders.component.html',
  styleUrls: ['./family-folders.component.scss'],
})
export class FamilyFoldersComponent implements OnChanges {
  @Input() documentPhase!: any;

  @ViewChild('documentCollected')
  documentCollectedComponetRef!: DocumentCollectedComponent;

  activeSection: 'doc-collection' | 'doc-certified' | 'sent-to-partner' =
    'doc-collection';

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['documentPhase']?.currentValue?.phase ===
      PhasesEnum.DOCUMENT_SUPPORT
    )
      this.activeSection = 'doc-certified';

    if (
      changes['documentPhase']?.currentValue?.phase ===
      PhasesEnum.DOCUMENT_AUDIT
    )
      this.activeSection = 'sent-to-partner';
  }

  onClickDocumentTab(
    section: 'doc-collection' | 'doc-certified' | 'sent-to-partner'
  ) {
    this.activeSection = section;
  }
}
