import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { OrgSettingsComponent } from './org-settings.component';
import { DepartmentComponent } from './department/department.component';
import { DivisionComponent } from './division/division.component';
import { UnitsComponent } from './units/units.component';
import { CreateEditComponent } from './department/create-edit/create-edit.component';
import { CreateEditDivisionComponent } from './division/create-edit-division/create-edit-division.component';
import { CreateEditUnitsComponent } from './units/create-edit-units/create-edit-units.component';
import { BranchComponent } from './branch/branch.component';
import { CreateEditBranchComponent } from './branch/create-edit-branch/create-edit-branch.component';
import { CreateCompanyProfileComponent } from './branch/create-company-profile/create-company-profile.component';
import { CreateEditBankAccountComponent } from './branch/create-edit-bank-account/create-edit-bank-account.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { CreateEditJobTitleComponent } from './job-title/create-edit-job-title/create-edit-job-title.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
  {
    path: '',
    component: OrgSettingsComponent,
  },

  {
    path: 'department',
    component: DepartmentComponent,
    data: { breadcrumb: 'Department' },
    // canDeactivate: [CanDeactivateGuard],
  },

  {
    path: 'division',
    component: DivisionComponent,
    data: { breadcrumb: 'Division' },
    // canDeactivate: [CanDeactivateGuard],
  },

  {
    path: 'units',
    component: UnitsComponent,
    data: { breadcrumb: 'Units' },
    // canDeactivate: [CanDeactivateGuard],
  },

  {
    path: 'branch',
    component: BranchComponent,
    data: { breadcrumb: 'Company Profile' },
    // canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'job-title',
    component: JobTitleComponent,
    data: { breadcrumb: 'Job Title' },
    // canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  declarations: [
    OrgSettingsComponent,
    DepartmentComponent,
    DivisionComponent,
    UnitsComponent,
    CreateEditComponent,
    CreateEditDivisionComponent,
    CreateEditUnitsComponent,
    BranchComponent,
    CreateEditBranchComponent,
    CreateCompanyProfileComponent,
    CreateEditBankAccountComponent,
    JobTitleComponent,
    CreateEditJobTitleComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgxMatSelectSearchModule,
  ],
})
export class OrgSettingsModule {}
