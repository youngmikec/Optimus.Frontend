import { createAction, props } from '@ngrx/store';

export const IsLoading = createAction(
  '[Auth] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const ResetStore = createAction('[Auth] Reset Store');

export const OptimusDocAuth = createAction('[Auth] Optimus Doc Auth');

export const LoginStart = createAction(
  '[Auth] Login Start',
  props<{
    payload: {
      email: string;
      password: string;
    };
  }>()
);

export const RefreshToken = createAction(
  '[Auth] Refresh Token',
  props<{
    payload: {
      refreshToken: string;
    };
  }>()
);

export const RefreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{
    payload: {
      user: any;
      permissionsArray?: string[] | null;
    };
  }>()
);

export const UpdateDeveloperTokenStatus = createAction(
  '[Auth] Update Developer Token Status',
  props<{
    payload: {
      status: boolean;
    };
  }>()
);

export const UpdateAccessTokenStatus = createAction(
  '[Auth] Update AccessToken Status',
  props<{
    payload: {
      status: boolean;
    };
  }>()
);

export const AuthorizeUserLogin = createAction(
  '[Auth] authorize user login',
  props<{
    payload: {
      authorize: boolean;
      deviceId: string;
      deviceName: string;
      userEmail: string;
    };
  }>()
);

export const AuthenticateSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{
    payload: {
      user: any;
      permissionsArray?: string[] | null;
    };
  }>()
);

export const InitializeApp_DeveloperToken = createAction(
  '[Auth] Initialize App - Developer Token'
);

export const InitializeApp_AccessToken = createAction(
  '[Auth] Initialize App - Access Token'
);

export const AutoLogin = createAction('[Auth] Auto Login');

export const Logout = createAction('[Auth] Logout');

export const ClearUser = createAction('[Auth] Clear User');

export const InviteLinkLogin = createAction(
  '[Auth] Invite Link Login',
  props<{
    payload: {
      email: string;
      password: string;
      deviceId: string;
      deviceType: number;
    };
  }>()
);

export const ForgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{
    payload: {
      email: string;
    };
  }>()
);

export const ResetPassword = createAction(
  '[Auth] Reset Password',
  props<{
    payload: {
      email: string;
      newPassword: string;
    };
  }>()
);

export const ChangePassword = createAction(
  '[Auth] Change Password',
  props<{
    payload: {
      email: string;
      oldPassword: string;
      newPassword: string;
    };
  }>()
);
