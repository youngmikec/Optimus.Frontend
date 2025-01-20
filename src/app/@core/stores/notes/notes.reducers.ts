import { Action, createReducer, on } from '@ngrx/store';
import * as NoteActions from './notes.actions';

export interface State {
  isLoading: boolean;
  isCreating: boolean;
  notes: [];
  error: string | null;
}

export const initialState: State = {
  isLoading: false,
  isCreating: false,
  notes: [],
  error: null,
};

export const noteReducerInternal = createReducer(
  initialState,
  on(NoteActions.loadNotes, (state) => ({
    ...state,
    isLoading: true,
    isCreating: false,
  })),
  on(NoteActions.createNoteLoading, (state) => ({
    ...state,
    isCreating: true,
  })),
  on(NoteActions.noteSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    notes: action.notes,
    error: null,
  })),
  on(NoteActions.noteFailure, (state, action) => ({
    ...state,
    isLoading: false,
    isCreating: false,
    error: action.error,
  }))
);

export function noteReducer(state: State | undefined, action: Action) {
  return noteReducerInternal(state, action);
}
