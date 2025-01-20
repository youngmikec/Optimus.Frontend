import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalRequestRoutingModule } from './approval-request-routing.module';
import { ApprovalRequestComponent } from './approval-request.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';

@NgModule({
  declarations: [ApprovalRequestComponent],
  imports: [ApprovalRequestRoutingModule, CommonModule, SharedModule],
})
export class ApprovalRequestModule {}
