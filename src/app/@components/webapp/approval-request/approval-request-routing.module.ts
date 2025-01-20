import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalRequestComponent } from './approval-request.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalRequestRoutingModule {}
