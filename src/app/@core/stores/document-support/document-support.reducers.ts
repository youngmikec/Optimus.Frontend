import { Action, createReducer } from '@ngrx/store';

export interface State {}

export const initialState: State = {};

export const documentSupportReducerInternal = createReducer(initialState);

export function documetSupportReducer(
  state: State | undefined,
  action: Action
) {
  return documentSupportReducerInternal(state, action);
}
