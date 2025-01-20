import { NgModule } from '@angular/core';
import { ApplicationsComponent } from './applications.component';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CreateApplicationsComponent } from './create-applications/create-applications.component';
import { AllApplicationsComponent } from './all-applications/all-applications.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
  },

  {
    path: 'create',
    component: CreateApplicationsComponent,
    data: {
      breadcrumb: 'Create Application',
      permission: 'Create Application',
    }, // does not exit on individual permssion
    // canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [
    ApplicationsComponent,
    AllApplicationsComponent,
    CreateApplicationsComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ApplicationsModule {}
