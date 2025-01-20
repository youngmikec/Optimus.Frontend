import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import * as NoteReducer from './notes.reducers';

const selectNotes = (state: fromApp.AppState) => state.notes;

export const isNoteLoadingSelector = createSelector(
  selectNotes,
  (state: NoteReducer.State) => state.isLoading
);
export const isNoteCreatingSelector = createSelector(
  selectNotes,
  (state: NoteReducer.State) => state.isCreating
);
export const noteSuccessSelector = createSelector(
  selectNotes,
  (state: NoteReducer.State) => state.notes
);
export const noteFailureSelector = createSelector(
  selectNotes,
  (state: NoteReducer.State) => state.error
);
