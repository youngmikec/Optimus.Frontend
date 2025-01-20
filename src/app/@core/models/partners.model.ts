export interface IGET_ALL_PARTNERS {
  skip: number;
  take: number;
}

export interface IALL_PARTNERS {
  partnerUserId: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  companyName: string;
  countryCode: string;
  email: string;
  isPartner: boolean;
  branchId: string;
  branch: IBranchPartners;
  userId: string;
  userCreationStatus: number;
  userCreationStatusDesc: string;
}

export interface IBranchPartners {
  companyLogo: string | null;
  address_Country: string;
  address_State: string;
  address_Area: string;
  address_Building: string;
  address_Street: string;
  address_ZipCode: string;
  description: string;
  isHeadOffice: boolean;
  isPartner: boolean;
  website: string;
  email: string;
  contactNumber: string;
  contactNumberCountryCode: string;
  id: number;
  name: string;
  createdByEmail: string;
  createdById: string;
  createdDate: string;
  lastModifiedById: string;
  lastModifiedByEmail: string;
  lastModifiedDate: string;
  status: number;
  statusDesc: string;
}

export interface IGET_ALL_PARTNERS_RESPONSE {
  succeeded: boolean;
  entity: IPARTNER_PAGE_ITEMS | null;
  permissions: null;
  message: string;
  messages: null;
}

export interface IPARTNER_PAGE_ITEMS {
  pageItems: IALL_PARTNERS[];
  pageCount: number;
  totalCount: number;
}

export interface ICREATE_PARTNER {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  companyName: string;
  country: string;
  countryCode: string;
  state: string;
  city: string;
  streetNumber: string;
  building: string;
  zipCode: string;
  userId?: string;
}

export interface IEDIT_PARTNER {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  companyName?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  streetNumber?: string;
  building?: string;
  zipCode?: string;
  userId?: string;
  partnerUserId: string;
}

export interface IEDIT_PARTNER_PAYLOAD {
  loggedInUserId: string;
  partnerUserId: string;
}

export interface ICHANGE_PARTNER_STATUS {
  partnerUserId: string;
  userId: string;
  status?: number | string;
}

export interface IMULTIPLE_PARTNER_STATUS_UPDATE {
  partnerUserIds: string[];
  userId: string;
  action?: number;
}

export interface IACTIVATION_MODAL_DATA {
  headerText: string;
  actionType: string;
  partnersForUpdate: IMULTIPLE_PARTNER_STATUS_UPDATE;
}

export interface IMULTIPLE_UPDATE_PARTNER_STATUS_RES {
  succeeded: boolean;
  entity: {
    partnerUserIds: string[];
    userId: string;
  };
  permissions: null;
  message: string;
  messages: string | string[] | null;
}
