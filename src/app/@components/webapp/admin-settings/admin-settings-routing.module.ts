import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminSettingsComponent } from './admin-settings.component';
import { AppGuard } from 'src/app/@core/guards/app.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminSettingsComponent,
  },

  // {
  //   path: 'application',
  //   data: { breadcrumb: 'Application' },
  //   loadChildren: () =>
  //     import(
  //       'src/app/@components/webapp/admin-settings/applications/applications.module'
  //     ).then((m) => m.ApplicationsModule),
  //   // canActivateChild: [AppGuard],
  // },

  {
    path: 'roles-permission',
    data: { breadcrumb: 'Role Management', permission: 'View Role' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/roles-permission/roles-permission.module'
      ).then((m) => m.RolesPermissionModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'features',
    data: { breadcrumb: 'Features', permission: 'View Features' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/features/features.module'
      ).then((m) => m.FeaturesModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'currency-config',
    data: { breadcrumb: 'Currency Configuration', permission: 'View Currency' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/currency-config/currency-config.module'
      ).then((m) => m.CurrencyConfigModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'user-management',
    data: { breadcrumb: 'User Management', permission: 'View User' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/user-management/user-management.module'
      ).then((m) => m.UserManagementModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'partner-management',
    data: { breadcrumb: 'Partners', permission: 'View Partner' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/partners-management/partners-management.module'
      ).then((m) => m.PartnersManagementModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'country-setup',
    data: { breadcrumb: 'Country', permission: 'View Country' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/country-setup/country-setup.module'
      ).then((m) => m.CountrySetupModule),
    canActivateChild: [AppGuard],
  },

  {
    path: 'org-settings',
    data: {
      breadcrumb: 'Organization Settings',
      permission: 'View Organization',
    },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/org-settings/org-settings.module'
      ).then((m) => m.OrgSettingsModule),
    //canActivateChild: [AppGuard],
  },

  {
    path: 'profile',
    data: { breadcrumb: 'My Profile' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/my-profile/my-profile.module'
      ).then((m) => m.MyProfileModule),
    canActivateChild: [AppGuard],
  },
  {
    path: 'phase-config',
    data: { breadcrumb: 'Phase', permission: 'View PhaseConfig' },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/phase-config/phase-config.module'
      ).then((m) => m.PhaseConfigModule),
    canActivateChild: [AppGuard],
  },
  {
    path: 'document-config',
    data: {
      breadcrumb: 'Document Configuration',
      permission: 'View DocumentConfig',
    },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/document-configuration/document-configuration.module'
      ).then((m) => m.DocumentConfigurationModule),
    canActivateChild: [AppGuard],
  },
  {
    path: 'invoice-item-config',
    data: {
      breadcrumb: 'Invoice Item Configuration',
      permission: 'View Invoice Item',
    },
    loadChildren: () =>
      import(
        'src/app/@components/webapp/admin-settings/invoice-item-config/invoice-item-config.module'
      ).then((m) => m.InvoiceItemConfigModule),
    canActivateChild: [AppGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminSettingsRoutingModule {}
