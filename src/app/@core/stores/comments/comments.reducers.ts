import { Action, createReducer, on } from '@ngrx/store';
import * as CommentActions from './comments.actions';

export interface State {
  isLoading: boolean;
  isCreating: boolean;
  comments: [];
  replies: [];
  error: string | null;
}

export const initialState: State = {
  isLoading: false,
  isCreating: false,
  comments: [],
  replies: [],
  error: null,
};

export const commentReducerInternal = createReducer(
  initialState,
  on(CommentActions.loadComments, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(CommentActions.loadingCreateComments, (state) => ({
    ...state,
    isCreating: true,
  })),
  on(CommentActions.commentsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    comments: action.comments,
    error: null,
  })),
  on(CommentActions.commentsFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  })),
  on(CommentActions.repliesSuccess, (state, action) => ({
    ...state,
    replies: action.replies,
  }))
);

export function commentsReducer(state: State | undefined, action: Action) {
  return commentReducerInternal(state, action);
}
