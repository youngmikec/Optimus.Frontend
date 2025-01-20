import { NgModule } from '@angular/core';
import { FeaturesComponent } from './features.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
// import { CreateFeatureComponent } from './create-feature/create-feature.component';
import { AddEditFeatureComponent } from './add-edit-feature/add-edit-feature.component';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';

const routes: Routes = [
  {
    path: '',
    component: FeaturesComponent,
    // data: { permission: 'Documents' },
  },
];

@NgModule({
  declarations: [
    FeaturesComponent,
    PermissionsComponent,
    CreatePermissionComponent,
    // CreateFeatureComponent,
    AddEditFeatureComponent,
    AddEditPermissionComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class FeaturesModule {}
