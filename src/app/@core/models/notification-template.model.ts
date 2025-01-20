export interface NotificationMessageTemplate {
  createdBy: string | null;
  createdDate: string; // ISO date string
  description: string | null;
  deviceId: string | null;
  deviceType: number; // Assuming this is an enum or numeric identifier
  deviceTypeDesc: string | null;
  id: number;
  isArchived: boolean;
  lastModifiedBy: string | null;
  lastModifiedDate: string; // ISO date string
  link: string | null;
  message: string;
  name: string | null;
  notificationStatus: number; // Assuming this is an enum or numeric identifier
  receipient: string;
  status: number; // Assuming this is an enum or numeric identifier
  statusDesc: string; // Description of the status
  uniqueName: string | null;
  userActivityType: number; // Assuming this is an enum or numeric identifier
  userActivityTypeDesc: string | null;
  userId: string;
}
