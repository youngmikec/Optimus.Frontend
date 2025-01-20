export interface QuoteTableInterface {
  applicant_name: string;
  country: string;
  route: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  lastModifiedBy: string;
  quoteStatus: 'Active' | 'Inactive';
  [key: string]: any;
}
// export interface QuoteTableInterface {
//   applicant_name: string;
//   country: string;
//   route: string;
//   created_date: Date;
//   created_by: string;
//   last_modified_date: Date;
//   last_modified_by: string;
//   invoice_status: 'Active' | 'Inactive';
//   [key: string]: any;
// }

export enum FormBuilderTypes {
  WELCOME = 'WELCOME',
  COUNTRY = 'COUNTRY',
  ROUTE = 'ROUTE',
  DROPDOWN = 'DROPDOWN',
  SELECT = 'SELECT',
  TrueOrFalse = 'TrueOrFalse',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  Number = 'Number',
  MultiSelection = 'MultiSelection',
  Confirm = 'Confirm',
  FamilyMemberType = 'FamilyMemberType',
  FreeText = 'FreeText',
  SingleSelection = 'SingleSelection',
  RealEstateInvestmentType = 'RealEstateInvestmentType',
}

export interface FormBuilderTypesInterface {
  [key: string]: string;
}

export interface StepInfoInterface {
  id?: number;
  type: FormBuilderTypes;
  tagline: string;
  question: string;
  label_highlight: string;
  options: any[];
  show_previous_question: boolean;
  previous_question_id?: string;
  value?: any;
  placeholder?: string;
  questionOptions: QuestionOption[];

  subQuestions?: StepInfoInterface[];
  questionTriggers?: QuestionTrigger[];
  finalQuestion?: boolean;
  answer?: AnswerInterface;
  answer2?: number;
  name?: string;
}

export interface AnswerInterface {
  answerId?: number;
  answer: string;
  questionId: number;
}

export interface QuestionOption {
  optionValue: string;
  routeQuestionId: number;
  sequenceNo: number;
  isDefault?: boolean;
  isDeleted?: boolean;
  recordKey: string;
  id?: number;
  name: string;
  description: string;
  status: number;
  statusDesc: string;
  questionOptionId?: number;
}

export interface QuestionTrigger {
  routeQuestionId: number;
  questionOptionId: number;
  recordKey: string;
  id: number;
  name: string;
  description: string;
  status: number;
  statusDesc: string;
}
