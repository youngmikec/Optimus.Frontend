import { NgModule } from '@angular/core';
import { PartnersManagementComponent } from './partners-management.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CreatePartnerComponent } from './create-partner/create-partner.component';
import { ViewPartnerModalComponent } from './view-partner-modal/view-partner-modal.component';
// import { CreateEditPartnerComponent } from './create-edit-partner/create-edit-partner.component';
import { PartnerInformationComponent } from './create-edit-partner/partner-information/partner-information.component';
import { EditPartnerComponent } from './edit-partner/edit-partner.component';
import { MobileAccessModalComponent } from './mobile-access-modal/mobile-access-modal.component';
import { ActivationModalComponent } from './activation-modal/activation-modal.component';

const routes: Routes = [
  {
    path: '',
    component: PartnersManagementComponent,
  },

  {
    path: 'create',
    component: CreatePartnerComponent,
    data: { breadcrumb: 'Create Partner', permission: 'Create Partner' },
    // canDeactivate: [CanDeactivateGuard],
  },

  {
    path: 'edit/:id',
    component: EditPartnerComponent,
    data: { breadcrumb: 'Edit Partner', permission: 'Edit Partner' },
    // canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [
    PartnersManagementComponent,
    CreatePartnerComponent,
    ViewPartnerModalComponent,
    // CreateEditPartnerComponent,
    PartnerInformationComponent,
    EditPartnerComponent,
    MobileAccessModalComponent,
    ActivationModalComponent,
  ],
  imports: [SharedModule, MatIconModule, RouterModule.forChild(routes)],
})
export class PartnersManagementModule {}
