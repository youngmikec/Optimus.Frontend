export interface IDocumentParameters {
  applicationPhaseId: number;
  documentConfigurationId: number;
  configurationQuestion: string;
  familyMemberId: number;
}

interface IFamilyMemberDetails {
  familyMemberId: number;
  title: string;
  firstName: string;
  lastName: string;
}

export interface IFamilyMembers {
  applicationPhaseId: number;
  applicationId: number;
  applicationFamilyMemberDetails: IFamilyMemberDetails[];
}

export interface IFamilyRelation {
  country: any;
  countryId: number;
  createdBy: string;
  createdDate: string; // Consider using Date type if you plan to work with date objects
  description: string | null;
  familyGroup: number;
  familyGroupDesc: string;
  familyMemberType: number;
  familyMemberTypeDesc: string;
  hasChildren: boolean;
  id: number;
  isDefault: boolean;
  isMarried: boolean;
  isMentallyChallenged: boolean;
  isQualified: boolean;
  isSchooling: boolean;
  lastModifiedBy: string;
  lastModifiedDate: string; // Similarly, consider Date type for date manipulations
  maximumAge: number;
  maximumAllowed: number;
  minimumAge: number;
  name: string;
  recordKey: string;
  status: number;
  statusDesc: string;
  userId: string;
}
