import { Guest } from './meetingGuest.interface';

export enum MeetingTypeEnum {
  Virtual = 1,
  Physical = 2,
}

export interface Meeting {
  meetingId: number;
  title: string;
  meetingType?: MeetingTypeEnum;
  startDate: string;
  endDate: string;
  location: string;
  fileAttachment?: any;
  guests: Guest[];
}
