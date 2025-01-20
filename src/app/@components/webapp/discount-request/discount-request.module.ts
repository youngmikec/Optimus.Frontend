import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRequestRoutingModule } from './discount-request-routing.module';
import { DiscountRequestComponent } from './discount-request.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { ViewDiscountRequestComponent } from './view-discount-request/view-discount-request.component';
import { ApproveRejectDialogComponent } from './approve-reject-dialog/approve-reject-dialog.component';
import { AllDiscountRequestsComponent } from './all-discount-requests/all-discount-requests.component';
import { ApprovedDiscountRequestsComponent } from './approved-discount-requests/approved-discount-requests.component';
import { PendingDiscountRequestsComponent } from './pending-discount-requests/pending-discount-requests.component';
import { DeclinedDiscountRequestsComponent } from './declined-discount-requests/declined-discount-requests.component';

@NgModule({
  declarations: [
    DiscountRequestComponent,
    ViewDiscountRequestComponent,
    ApproveRejectDialogComponent,
    AllDiscountRequestsComponent,
    ApprovedDiscountRequestsComponent,
    PendingDiscountRequestsComponent,
    DeclinedDiscountRequestsComponent,
  ],
  imports: [CommonModule, DiscountRequestRoutingModule, SharedModule],
})
export class DiscountRequestModule {}
