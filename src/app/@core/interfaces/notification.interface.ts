export interface Notification {
  state: 'success' | 'warning' | 'error';
  title?: string;
  message: string;
}
