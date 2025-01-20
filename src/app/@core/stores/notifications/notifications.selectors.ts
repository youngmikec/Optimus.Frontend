import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as NotificationReducer from './notifications.reducers';

const selectNotifications = (state: fromApp.AppState) => state.notifications;

export const isLoading = createSelector(
  selectNotifications,
  (state: NotificationReducer.State) => state.isLoading
);

export const isTypesLoading = createSelector(
  selectNotifications,
  (state: NotificationReducer.State) => state.isTypesLoading
);

export const allNotifications = createSelector(
  selectNotifications,
  (state: NotificationReducer.State) => state.allNotifications
);

export const allMessageNotificationTypes = createSelector(
  selectNotifications,
  (state: NotificationReducer.State) => state.messageNotificationTypes
);
