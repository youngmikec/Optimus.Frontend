import { createAction, props } from '@ngrx/store';

export const loadNotes = createAction('[Notes] Load Notes');
export const noteSuccess = createAction(
  '[Notes] Load Notes Success',
  props<{ notes: [] }>()
);
export const noteFailure = createAction(
  '[Notes] Load Notes Failure',
  props<{ error: string }>()
);
export const createNoteLoading = createAction('[Notes] Loading created Notes');
export const createNotes = createAction(
  '[Notes] Create Notes',
  props<{ description: string }>()
);
export const updateNotes = createAction(
  '[Notes] Update Notes',
  props<{ description: string; noteId: number }>()
);
export const deleteNotes = createAction(
  '[Notes] Delete Notes',
  props<{ id: number }>()
);
