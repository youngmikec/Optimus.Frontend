export interface ApplicantInterface {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

export interface IApplicant {
  address: string;
  city: string;
  country: string;
  countryCode: string;
  countryCode2: string;
  createdBy: string;
  createdDate: Date;
  description: string;
  email: string;
  firstName: string;
  fullName: string;
  gender: number;
  id: number;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  lastName: string;
  maritalStatus: number;
  mobileNo: string;
  mobileNo2: string;
  name: string;
  postalCode: string;
  recordKey: string;
  rmId: string;
  rmName: string;
  shortAddress: string;
  state: string;
  status: number;
  statusDesc: string;
  userId: string;
}

export interface ApplicantDashboardQueryInterface {
  applicationPerformance: ApplicationPerformanceInterface[];
  applicationByGender: ApplicationByGenderInterface[];
  applicantsByMonth: ApplicantsByMonthInterface[];
  applicationQuotesCount: number;
}

export interface ApplicationPerformanceInterface {
  quoteCount: number;
  quoteCountDescription: string;
  count: number;
}

export interface ApplicationByGenderInterface {
  gender: number;
  genderDescription: string;
  count: number;
}

interface ApplicantsByMonthInterface {
  month: number;
  monthName: string;
  count: number;
}
