import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaleDashboardComponent } from './sale-dashboard.component';
import { SaleOverviewComponent } from './sale-overview/sale-overview.component';
import { SaleDocumentsComponent } from './sale-documents/sale-documents.component';
import { SaleNotesComponent } from './sale-notes/sale-notes.component';
import { QuillModule } from 'ngx-quill';
import { DeleteNoteModalComponent } from './sale-notes/delete-note-modal/delete-note-modal.component';
import { CreateMeetingModalComponent } from './sale-overview/create-meeting-modal/create-meeting-modal.component';
import { AssignOfficerModalComponent } from './sale-overview/assign-officer-modal/assign-officer-modal.component';
import { SaleLoansComponent } from './sale-loans/sale-loans.component';
import { EditLoanRequestComponent } from './sale-loans/edit-loan-request/edit-loan-request.component';
import { RequestLoanComponent } from './sale-loans/request-loan/request-loan.component';
import { EditTaskComponent } from './sale-overview/edit-task/edit-task.component';
import { CancelTaskComponent } from './sale-overview/cancel-task/cancel-task.component';
import { ViewTaskComponent } from './sale-overview/view-task/view-task.component';
import { AddTaskComponent } from './sale-overview/add-task/add-task.component';
import { CommentsComponent } from './comments/comments.component';
import { TrailComponent } from './trail/trail.component';
import { ActivitiesComponent } from './activities/activities.component';
import { FamilyFormComponent } from './sale-documents/family-form/family-form.component';
import { DocumentParametersComponent } from './sale-documents/document-parameters/document-parameters.component';
import { DocumentMainComponent } from './sale-documents/document-main/document-main.component';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentCollectedComponent } from './sale-documents/family-folders/document-collected/document-collected.component';
import { DocumentProcessedComponent } from './sale-documents/family-folders/document-processed/document-processed.component';
import { DocumentSentToPartnerComponent } from './sale-documents/family-folders/document-sent-to-partner/document-sent-to-partner.component';
import { FamilyFoldersComponent } from './sale-documents/family-folders/family-folders.component';
import { ApproveDocumentComponent } from './sale-documents/family-folders/folder/approve-document/approve-document.component';
import { DocumentCommentsComponent } from './sale-documents/family-folders/folder/document-comments/document-comments.component';
import { FileDetailsComponent } from './sale-documents/family-folders/folder/file-details/file-details.component';
import { FolderComponent } from './sale-documents/family-folders/folder/folder.component';
import { RejectDocumentComponent } from './sale-documents/family-folders/folder/reject-document/reject-document.component';
import { ReplaceDocumentComponent } from './sale-documents/family-folders/folder/replace-document/replace-document.component';
import { ViewFileComponent } from './sale-documents/family-folders/folder/view-file/view-file.component';
import { DocumentVersionHistoryComponent } from './sale-documents/family-folders/folder/document-version-history/document-version-history.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RepayLoanComponent } from './sale-loans/repay-loan/repay-loan.component';
import { ViewSaleLoansComponent } from './view-sale-loans/view-sale-loans.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfirmationModalComponent } from './sale-overview/confirmation-modal/confirmation-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivitiesFullscreenComponent } from './activities-fullscreen/activities-fullscreen.component';
import { MarkAsDoneComponent } from './mark-as-done/mark-as-done.component';
import { DaoAssignToCmaComponent } from './sale-overview/dao-assign-to-cma/dao-assign-to-cma.component';
import { OnboardingMeetingModalComponent } from './sale-overview/onboarding-meeting-modal/onboarding-meeting-modal.component';
import { PaymentPlanScheduleComponent } from './sale-overview/payment-plan-schedule/payment-plan-schedule.component';
import { PartnersModalComponent } from './sale-documents/family-folders/document-sent-to-partner/partners-modal/partners-modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { SaleInvoicesComponent } from './sale-invoices/sale-invoices.component';
import { AllInvoicesComponent } from './sale-invoices/all-invoices/all-invoices.component';
import { PaidInvoicesComponent } from './sale-invoices/paid-invoices/paid-invoices.component';
import { OutstandingInvoicesComponent } from './sale-invoices/outstanding-invoices/outstanding-invoices.component';
import { QuoteInvoiceModule } from '../../quote-calculator/new-quote/quote-invoice/quote-invoice.module';

const routes: Routes = [
  // {
  //   path: '',
  //   component: SaleDashboardComponent,
  // },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        data: { breadcrumb: 'Overview' },
        component: SaleOverviewComponent,
      },
      {
        path: 'documents',
        data: { breadcrumb: 'Documents' },
        component: SaleDocumentsComponent,
      },
      {
        path: 'loans',
        data: { breadcrumb: 'Loans' },
        component: SaleLoansComponent,
      },
      {
        path: 'notes',
        data: { breadcrumb: 'Notes' },
        component: SaleNotesComponent,
      },
      {
        path: 'activities',
        data: { breadcrumb: 'Activities' },
        component: ActivitiesFullscreenComponent,
      },

      // {
      //   path: 'familyMembers',
      //   data: { breadcrumb: 'Family Members' },
      //   component: FamilyMembersComponent,
      // },

      // {
      //   path: 'family-members-type-settings',
      //   data: { breadcrumb: 'Family Members Type Settings' },
      //   component: FamilyMemberTypeSettingComponent,
      // },

      // {
      //   path: 'migrationRoutes',
      //   data: { breadcrumb: 'Migration Routes' },
      //   loadChildren: () =>
      //     import(
      //       'src/app/@components/webapp/admin-settings/country-setup/country-dashboard/migration-routes/migration-route.module'
      //     ).then((m) => m.MigrationRouteModule),
      // },
    ],
  },
];
@NgModule({
  declarations: [
    SaleDashboardComponent,
    SaleOverviewComponent,
    SaleDocumentsComponent,
    SaleNotesComponent,
    DeleteNoteModalComponent,
    CreateMeetingModalComponent,
    AssignOfficerModalComponent,
    SaleLoansComponent,
    EditLoanRequestComponent,
    RequestLoanComponent,
    AddTaskComponent,
    EditTaskComponent,
    CancelTaskComponent,
    ViewTaskComponent,
    CommentsComponent,
    TrailComponent,
    ActivitiesComponent,

    // Documents
    DocumentMainComponent,
    FamilyFormComponent,
    DocumentParametersComponent,
    FamilyFoldersComponent,
    FolderComponent,
    DocumentCollectedComponent,
    DocumentProcessedComponent,
    DocumentSentToPartnerComponent,
    FileDetailsComponent,
    ViewFileComponent,
    ReplaceDocumentComponent,
    DocumentCommentsComponent,
    RepayLoanComponent,
    ViewSaleLoansComponent,
    ApproveDocumentComponent,
    RejectDocumentComponent,
    DocumentVersionHistoryComponent,
    ConfirmationModalComponent,
    // CompleteOnboardingComponent,
    ActivitiesFullscreenComponent,
    MarkAsDoneComponent,
    DaoAssignToCmaComponent,
    OnboardingMeetingModalComponent,
    PaymentPlanScheduleComponent,
    PartnersModalComponent,
    SaleInvoicesComponent,
    AllInvoicesComponent,
    PaidInvoicesComponent,
    OutstandingInvoicesComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    QuoteInvoiceModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterModule.forChild(routes),
    QuillModule.forRoot(),
    NgApexchartsModule,
    // PdfViewerModule,
    MatProgressBarModule,
  ],
  providers: [DatePipe],
})
export class SaleDashboardModule {}
