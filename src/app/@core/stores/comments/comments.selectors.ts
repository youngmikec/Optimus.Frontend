import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as CommentsReducer from './comments.reducers';

const selectComments = (state: fromApp.AppState) => state.comments;

export const isCommentsLoadingSelector = createSelector(
  selectComments,
  (state: CommentsReducer.State) => state.isLoading
);

export const isCommentsCreatingSelector = createSelector(
  selectComments,
  (state: CommentsReducer.State) => state.isCreating
);

export const commentsSuccessSelector = createSelector(
  selectComments,
  (state: CommentsReducer.State) => state.comments
);

export const commentsFailureSelector = createSelector(
  selectComments,
  (state: CommentsReducer.State) => state.error
);

export const repliesSuccessSelector = createSelector(
  selectComments,
  (state: CommentsReducer.State) => state.replies
);
