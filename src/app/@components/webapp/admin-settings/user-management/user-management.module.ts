import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { UserMgmtTableComponent } from './user-mgmt-table/user-mgmt-table.component';
import { NewUserComponent } from './new-user/new-user.component';

import { UserInformationComponent } from './create-edit-user/user-information/user-information.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal.component';
import { MobileAccessModalComponent } from './mobile-access-modal/mobile-access-modal.component';
import { UserDeleteModalComponent } from './user-delete-modal/user-delete-modal.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    // data: { permission: 'Documents' },
  },

  {
    path: 'create',
    component: CreateUserComponent,
    data: { breadcrumb: 'Create User', permission: 'Create User' },
    // canDeactivate: [CanDeactivateGuard],
  },

  {
    path: 'edit/:id',
    component: EditUserComponent,
    data: { breadcrumb: 'Edit User', permission: 'Edit User' },
    // canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [
    UserManagementComponent,
    UserMgmtTableComponent,
    NewUserComponent,
    UserInformationComponent,
    CreateUserComponent,
    EditUserComponent,
    ViewUserModalComponent,
    MobileAccessModalComponent,
    UserDeleteModalComponent,
  ],
  imports: [SharedModule, MatIconModule, RouterModule.forChild(routes)],
})
export class UserManagementModule {}
