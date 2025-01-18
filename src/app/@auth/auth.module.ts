import { NgModule } from '@angular/core';
// import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../@core/shared/shared.module';
// import { EmailTemplateComponent } from './email-template/email-template.component';
// import { InviteLinkLoginComponent } from './invite-link-login/invite-link-login.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
// import { ResetPasswordMessageComponent } from './reset-password-message/reset-password-message.component';
import { AuthMainComponent } from './auth-main.component';

@NgModule({
  declarations: [
    // LoginComponent,
    // EmailTemplateComponent,
    // InviteLinkLoginComponent,
    // ResetPasswordComponent,
    // ForgotPasswordComponent,
    // ResetPasswordMessageComponent,
    AuthMainComponent,
  ],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
