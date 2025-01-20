import { createAction, props } from '@ngrx/store';

export const IsLoading = createAction(
  '[Notifications] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const IsTypesLoading = createAction(
  '[Notifications] Is Type Loading',
  props<{
    payload: boolean;
  }>()
);

export const GetAllNotifications = createAction(
  '[Notifications] Get All Notifications'
);

export const ReadAllNotifications = createAction(
  '[Notifications] Read All Notifications',
  props<{
    payload: {
      notificationIds: number[];
    };
  }>()
);

export const SaveGetAllNotifications = createAction(
  '[Notifications] Save Get All Notifications',
  props<{
    payload: {
      data: any;
    };
  }>()
);

export const NotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: string }>()
);

export const GetNotificationTypes = createAction(
  '[Notifications] Get Notification Types',
  props<{
    payload: {
      status?: number;
      id?: string;
      messageNotificationType?: number;
    };
  }>()
);

export const SaveGetNotificationTypes = createAction(
  '[Notifications] Save Get NotificationTypes',
  props<{
    payload: {
      data: any;
    };
  }>()
);

export const NotificationsTypesFailure = createAction(
  '[Notifications] Load Notifications Types Failure',
  props<{ error: string }>()
);

export const deleteNotification = createAction(
  '[Notifications] Delete Notifications',
  props<{ id: number }>()
);
