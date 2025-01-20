export interface MigrationRouteDocumentConfigurations {
  migrationRouteId: number;
  name: string;
  isDeleted?: boolean;
  countryId?: number;
}

export interface FamilyMemberDocumentConfigurations {
  familyMemberId: number;
  name: string;
  isDeleted?: boolean;
  countryId?: number;
}

export interface CountryConfigurationList {
  documentConfigurationId?: number;
  countryId: number;
  name: string;
  migrationRouteDocumentConfigurations?: MigrationRouteDocumentConfigurations[];
  familyMemberDocumentConfigurations?: FamilyMemberDocumentConfigurations[];
  isDeleted: boolean;
}

export interface QuestionResponseDocumentRequest {
  documentNames: string[];
  alternativeDocumentNames: string[];
  documentActivity: string;
  isYes?: boolean;
  isDeleted?: boolean;
}

export interface IMigrationRouteGroup {
  country: string;
  countryId: number;
  routes: IDocumentQuestionMultiSelect[];
}

export interface IFamilyMemberGroup {
  country: string;
  countryId: number;
  members: IDocumentQuestionMultiSelect[];
}

export interface IDocumentConfiguration {
  id?: number;
  configurationQuestion: string;
  questionResponseDocumentRequests: QuestionResponseDocumentRequest[];
  countryDocumentConfigurations: CountryConfigurationList[];
}

export interface IDocumentQuestionMultiSelect {
  id: number;
  name: string;
  countryId: number;
}
