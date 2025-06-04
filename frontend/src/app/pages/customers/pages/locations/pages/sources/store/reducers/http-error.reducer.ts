import { Action, createReducer, on } from "@ngrx/store";
import * as SourceActions from "../actions/sources.actions";
import { HttpError } from "../../../../../../../../models/Notification";

const initialState: Partial<HttpError> = {};

const httpErrorReducer = createReducer(
  initialState,
  on(SourceActions.clearSourceHttpError, (state, { }) => ({})),
  on(SourceActions.getSourceFailed, (state, { error }) => ({
    ...error
  })),
  on(SourceActions.editSourceFailed, (state, { error }) => ({
    ...error
  })),
  on(SourceActions.deleteSourceFailed, (state, { error }) => ({
    ...error
  }))
);

export function reducer(state: Partial<HttpError> | undefined, action: Action) {
  return httpErrorReducer(state, action)
}
