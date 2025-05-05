import { Action, createReducer, on } from "@ngrx/store";
import * as LocationActions from "../actions/locations.actions";
import { HttpError } from "../../../../../../models/Notification";

const initialState: Partial<HttpError> = {};

const httpErrorReducer = createReducer(
  initialState,
  on(LocationActions.clearLocationHttpError, (state, { }) => ({})),

  on(LocationActions.loadLocationsFailed, (state, { error }) => ({
    ...error
  })),
  on(LocationActions.getLocationFailed, (state, { error }) => ({
    ...error
  })),
  on(LocationActions.editLocationFailed, (state, { error }) => ({
    ...error
  })),
  on(LocationActions.deleteLocationFailed, (state, { error }) => ({
    ...error
  }))
);

export function reducer(state: Partial<HttpError> | undefined, action: Action) {
  return httpErrorReducer(state, action)
}
