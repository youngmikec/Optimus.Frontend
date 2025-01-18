import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../styles/material/material.module';
import { QuillModule } from 'ngx-quill';
// import { ButtonLoaderComponent } from './loaders/button-loader/button-loader.component';
import { NotificationComponent } from './notification/notification.component';
import { GeneralLoaderComponent } from './loaders/general-loader/general-loader.component';
// import { FolderPanelLoaderComponent } from './loaders/folder-panel-loader/folder-panel-loader.component';
// import { TableLoaderComponent } from './loaders/table-loader/table-loader.component';
// import { QuoteSelectComponent } from './quote-inputs/quote-select/quote-select.component';
// import { SendToApplicantModalComponent } from './send-to-applicant-modal/send-to-applicant-modal.component';
// import { SignatureModalComponent } from './signature-modal/signature-modal.component';
// import { TableComponent } from './table/table.component';
// import { TableControlsComponent } from './table-controls/table-controls.component';
// import { TitleHeaderComponent } from './title-header/title-header.component';
// import { CommentInputComponent } from './comment-input/comment-input.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
// import { PopupModalComponent } from './popup-modal/popup-modal.component';
import { TruncatePipe } from '../pipes/truncate.pipe';
// import { MarkAsPaidModalComponent } from './mark-as-paid-modal/mark-as-paid-modal.component';
// import { ViewDocumentModalComponent } from './view-document-modal/view-document-modal.component';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { CreateInvestmentTierComponent } from './create-investment-tier/create-investment-tier.component';
import { OrdinalDatePipe } from '../pipes/ordinal-date.pipe';
// import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
// import { DeleteModalComponent } from './delete-modal/delete-modal.component';
// import { TableViewComponent } from './table-view/table-view.component';
// import { CreateTableViewComponent } from './table-view/create-table-view/create-table-view.component';
// import { NotificationDropdownComponent } from './notification-dropdown/notification-dropdown.component';
// import { FiltersComponent } from './filters/filters.component';
// import { CommaSeperatedDirective } from '../directives';

const modules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  MaterialModule,
  NgxMatTimepickerModule,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
];

const components = [
//   ButtonLoaderComponent,
  NotificationComponent,
//   TableLoaderComponent,
  GeneralLoaderComponent,
//   QuoteSelectComponent,
//   SendToApplicantModalComponent,
//   SignatureModalComponent,
//   FolderPanelLoaderComponent,
//   TableLoaderComponent,
//   TableComponent,
//   TableControlsComponent,
//   TitleHeaderComponent,
//   CommentInputComponent,
//   PopupModalComponent,
//   ViewDocumentModalComponent,
//   NotificationDropdownComponent,
];

const pipes = [TimeAgoPipe, TruncatePipe, OrdinalDatePipe];

@NgModule({
  declarations: [
    components,
    pipes,
    // CommaSeperatedDirective,
    // MarkAsPaidModalComponent,
    // CreateInvestmentTierComponent,
    // DeleteDialogComponent,
    // DeleteModalComponent,
    // TableViewComponent,
    // CreateTableViewComponent,
    // FiltersComponent,
  ],
  imports: [modules, QuillModule.forRoot(), MaterialModule],
  exports: [modules, components, pipes],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
