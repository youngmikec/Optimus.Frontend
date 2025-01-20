import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { MyProfileComponent } from './my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
  },
];

@NgModule({
  declarations: [
    MyProfileComponent,
    ChangePasswordComponent,
    ChangeProfilePictureComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileModule {}
