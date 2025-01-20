import { createAction, props } from '@ngrx/store';

export const ResetStore = createAction('[RouteQuestion] Reset Store');

export const IsLoading = createAction(
  '[RouteQuestion] Is Loading',
  props<{
    payload: boolean;
  }>()
);

export const SuccessAction = createAction(
  '[RouteQuestion] Success Action',
  props<{
    payload: boolean;
  }>()
);

export const GetAllRouteQuestions = createAction(
  '[RouteQuestion] Get All Route Question'
);

export const GetAllRouteQuestionsByMigrationId = createAction(
  '[RouteQuestion] Get All Route Question By Migration Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const GetActiveRouteQuestionsByMigrationId = createAction(
  '[RouteQuestion] Get Active Route Question By Migration Id',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveAllRouteQuestions = createAction(
  '[RouteQuestion] Save All Route Question',
  props<{
    payload: any;
  }>()
);

export const SaveAllRouteQuestionsByMigrationId = createAction(
  '[RouteQuestion] Save All Route Question By Migration Id',
  props<{
    payload: any;
  }>()
);

export const SaveActiveRouteQuestionsByMigrationId = createAction(
  '[RouteQuestion] Save Active Route Question By Migration Id',
  props<{
    payload: any;
  }>()
);

export const GetRouteQuestionById = createAction(
  '[RouteQuestion] Get Route Question By ID',
  props<{
    payload: {
      id: number;
    };
  }>()
);

export const SaveGetRouteQuestionById = createAction(
  '[RouteQuestion] Save Get Route Question By ID',
  props<{
    payload: any;
  }>()
);

export const CreateRouteQuestion = createAction(
  '[RouteQuestion] Create Route Question',
  props<{
    payload: {
      migrationRouteId: number;
      familyMemberId: number;
      parentId: number;
      sequenceNo: number;
      question: string;
      questionResponseType: number;
      questionOptions: any[];
      subQuestions: any;
      isDeleted: boolean;
      name: string;
      description: string;
      // questionTriggers inside subquestions
    };
  }>()
);

export const EditRouteQuestion = createAction(
  '[RouteQuestion] Edit RouteQuestion',
  props<{
    payload: {
      id: number;
      migrationRouteId: number;
      familyMemberId: number;
      parentId: number;
      sequenceNo: number;
      question: string;
      questionResponseType: number;
      questionOptions: any[];
      subQuestions: any;
      isDeleted: boolean;
      name: string;
      description: string;
    };
  }>()
);

export const EditMultipleRouteQuestion = createAction(
  '[RouteQuestion] Edit Multiple RouteQuestion',
  props<{
    payload: {
      migrationRouteId: number;
      countryId: number;
      routeQuestions: any[];
    };
  }>()
);

export const DeleteRouteQuestion = createAction(
  '[RouteQuestion] Delete Route Question',
  props<{
    payload: {
      id: number;
      migrationRouteId: number;
    };
  }>()
);

export const ActivateRouteQuestion = createAction(
  '[RouteQuestion] Activate Route Question',
  props<{
    payload: {
      id: number;
      migrationId: number;
    };
  }>()
);

export const DeactivateRouteQuestion = createAction(
  '[RouteQuestion] Deactivate Route Question',
  props<{
    payload: {
      id: number;
      migrationId: number;
    };
  }>()
);

export const ClearActiveRouteQuestionsByMigrationId = createAction(
  '[RouteQuestion] Clear Active Route Question By Migration Id'
);
