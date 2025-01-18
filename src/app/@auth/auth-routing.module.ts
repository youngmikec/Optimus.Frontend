import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InviteLinkLoginComponent } from './invite-link-login/invite-link-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordMessageComponent } from './reset-password-message/reset-password-message.component';
import { AuthMainComponent } from './auth-main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthMainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'invite-link-login',
        component: InviteLinkLoginComponent,
        children: [
          {
            path: '?email=email&token=token',
            component: InviteLinkLoginComponent,
          },
        ],
      },

      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },

      {
        path: 'reset-password-message',
        component: ResetPasswordMessageComponent,
      },

      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class AuthRoutingModule {}
