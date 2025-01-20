import { createReducer, Action, on } from '@ngrx/store';
import * as NotificationActions from './notifications.action';

export interface State {
  allNotifications: {
    data: any[];
    totalCount: number;
  };
  messageNotificationTypes: {
    data: any[];
    totalCount: number;
  };
  isLoading: boolean;
  isTypesLoading: boolean;
  error: string | null;
}

export const initialState: State = {
  allNotifications: {
    data: [],
    totalCount: 0,
  },
  messageNotificationTypes: {
    data: [],
    totalCount: 0,
  },
  isLoading: false,
  isTypesLoading: false,
  error: null,
};

export const notificationsReducerInternal = createReducer(
  initialState,
  on(NotificationActions.IsLoading, (state, { payload }) => ({
    ...state,
    isLoading: payload,
  })),
  on(NotificationActions.IsTypesLoading, (state, { payload }) => ({
    ...state,
    isTypesLoading: payload,
  })),
  on(NotificationActions.SaveGetAllNotifications, (state, action) => ({
    ...state,
    isLoading: false,
    allNotifications: action.payload.data,
  })),
  on(NotificationActions.NotificationsFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(NotificationActions.NotificationsTypesFailure, (state, action) => ({
    ...state,
    isTypesLoading: false,
    error: action.error,
  })),
  on(NotificationActions.SaveGetNotificationTypes, (state, action) => ({
    ...state,
    isTypesLoading: false,
    messageNotificationTypes: action.payload.data,
  }))
);

export function notificationsReducer(state: State | undefined, action: Action) {
  return notificationsReducerInternal(state, action);
}
