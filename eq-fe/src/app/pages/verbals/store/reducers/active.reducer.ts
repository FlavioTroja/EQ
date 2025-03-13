import { Action, createReducer, on } from "@ngrx/store";
import * as VerbalActions from "../actions/verbals.actions";
import { Document } from "../../../../models/Document";
import { ActiveEntity } from "../../../../../global";

const initialState: Partial<ActiveEntity<Document>> = {};

const activeVerbalReducer = createReducer(
  initialState,
  on(VerbalActions.getVerbalSuccess, (state, { current }) => ({
    current: current
  })),
  on(VerbalActions.verbalActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(VerbalActions.editVerbalSuccess, (state, { verbal }) => ({
    current: { ...verbal }
  })),
  on(VerbalActions.clearVerbalActive, (state) => ({
    changes: undefined,
    current: undefined
  })),
  on(VerbalActions.loadVerbalsSuccess, (state) => ({
    changes: undefined,
    current: undefined
  })),
);

export function reducer(state: Partial<ActiveEntity<Document>> | undefined, action: Action) {
  return activeVerbalReducer(state, action)
}
