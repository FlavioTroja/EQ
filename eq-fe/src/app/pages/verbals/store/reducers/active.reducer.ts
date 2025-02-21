import { Action, createReducer, on } from "@ngrx/store";
import * as VerbalActions from "../actions/verbals.actions";
import { Verbal } from "../../../../models/Verbal";
import { ActiveEntity } from "../../../../../global";

const initialState: Partial<ActiveEntity<Verbal>> = {};

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

export function reducer(state: Partial<ActiveEntity<Verbal>> | undefined, action: Action) {
  return activeVerbalReducer(state, action)
}
