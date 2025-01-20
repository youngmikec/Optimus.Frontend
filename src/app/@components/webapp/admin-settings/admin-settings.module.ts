import { NgModule } from '@angular/core';
import { AdminSettingsRoutingModule } from './admin-settings-routing.module';
import { AdminSettingsComponent } from './admin-settings.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
//import { MyProfileComponent } from './my-profile/my-profile.component';

@NgModule({
  declarations: [AdminSettingsComponent],
  imports: [AdminSettingsRoutingModule, SharedModule],
})
export class AdminSettingsModule {}
