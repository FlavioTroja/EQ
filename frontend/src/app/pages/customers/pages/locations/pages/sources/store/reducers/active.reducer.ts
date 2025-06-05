import { Action, createReducer, on } from "@ngrx/store";
import * as SourceActions from "../actions/sources.actions";
import { Source } from "../../../../../../../../models/Source";
import { ActiveEntity } from "../../../../../../../../../global";

const initialState: Partial<ActiveEntity<Source>> = {};

const activeSourceReducer = createReducer(
  initialState,
  on(SourceActions.loadActiveSource, (state, { source }) => ({
    current: source
  })),
  on(SourceActions.sourceActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(SourceActions.editSourceSuccess, (state, { source }) => ({
    current: { ...source }
  })),
  on(SourceActions.clearSourceActive, (state) => ({
    changes: undefined,
    current: undefined
  })),
);

export function reducer(state: Partial<ActiveEntity<Source>> | undefined, action: Action) {
  return activeSourceReducer(state, action)
}
