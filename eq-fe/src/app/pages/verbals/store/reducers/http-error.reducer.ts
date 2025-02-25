import { Action, createReducer, on } from "@ngrx/store";
import * as VerbalActions from "../actions/verbals.actions";
import { HttpError } from "../../../../models/Notification";

const initialState: Partial<HttpError> = {};

const httpErrorReducer = createReducer(
  initialState,
  on(VerbalActions.clearVerbalHttpError, (state, { }) => ({})),

  on(VerbalActions.loadVerbalsFailed, (state, { error }) => ({
    ...error
  })),
  on(VerbalActions.getVerbalFailed, (state, { error }) => ({
    ...error
  })),
  on(VerbalActions.editVerbalFailed, (state, { error }) => ({
    ...error
  })),
  on(VerbalActions.deleteVerbalFailed, (state, { error }) => ({
    ...error
  }))
);

export function reducer(state: Partial<HttpError> | undefined, action: Action) {
  return httpErrorReducer(state, action)
}
