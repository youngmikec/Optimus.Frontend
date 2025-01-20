import { createAction, props } from '@ngrx/store';

export const loadComments = createAction(
  '[Comments] Load Comments',
  props<{ applicationId: number }>()
);
export const loadingCreateComments = createAction(
  '[Comments] Loading Creating Comments'
);
export const commentsSuccess = createAction(
  '[Comments] Load Comments Success',
  props<{ comments: [] }>()
);
export const commentsFailure = createAction(
  '[Comments] Load Comments Failure',
  props<{ error: string }>()
);
export const createComment = createAction(
  '[Comments] Create Comments',
  props<{
    text: string;
    applicationId: number;
    fromemail: string;
    commentReferences: { toEmail: string; recipientName: string }[];
  }>()
);

export const loadReplies = createAction(
  '[Replies] Load Replies',
  props<{ commentId: number }>()
);
export const repliesSuccess = createAction(
  '[Replies] Load Replies Success',
  props<{ replies: [] }>()
);
export const repliesFailure = createAction(
  '[Replies] Load Replies Failure',
  props<{ error: string }>()
);
export const replyComment = createAction(
  '[Replies] Reply Replies',
  props<{
    text: string;
    fromemail: string;
    commentId: number;
    replyMailRecipients: { toEmail: string; recipientName: string }[];
  }>()
);
