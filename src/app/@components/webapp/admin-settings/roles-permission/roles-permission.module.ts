import { NgModule } from '@angular/core';
import { RolesPermissionComponent } from './roles-permission.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AllRolesComponent } from './all-roles/all-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { AppGuard } from 'src/app/@core/guards/app.guard';

const routes: Routes = [
  {
    path: '',
    component: RolesPermissionComponent,
  },

  {
    path: 'create',
    component: CreateRoleComponent,
    data: { breadcrumb: 'Create Role', permission: 'Create Role' }, // does not exit on individual permssion
    // canDeactivate: [CanDeactivateGuard],
    canActivateChild: [AppGuard],
  },

  {
    path: 'edit/:id',
    component: EditRoleComponent,
    data: { breadcrumb: 'Edit Role', permission: 'Edit Role' },
    // canDeactivate: [CanDeactivateGuard],
    canActivateChild: [AppGuard],
  },
];

@NgModule({
  declarations: [
    RolesPermissionComponent,
    AllRolesComponent,
    CreateRoleComponent,
    EditRoleComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class RolesPermissionModule {}
