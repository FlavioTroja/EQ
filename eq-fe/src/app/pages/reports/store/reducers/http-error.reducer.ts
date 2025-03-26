import { Action, createReducer, on } from "@ngrx/store";
import * as ReportActions from "../actions/reports.actions";
import { HttpError } from "../../../../models/Notification";

const initialState: Partial<HttpError> = {};

const httpErrorReducer = createReducer(
  initialState,
  on(ReportActions.clearReportHttpError, (state, { }) => ({})),

  on(ReportActions.loadReportsFailed, (state, { error }) => ({
    ...error
  })),
  on(ReportActions.getReportFailed, (state, { error }) => ({
    ...error
  })),
  on(ReportActions.editReportFailed, (state, { error }) => ({
    ...error
  })),
  on(ReportActions.deleteReportFailed, (state, { error }) => ({
    ...error
  }))
);

export function reducer(state: Partial<HttpError> | undefined, action: Action) {
  return httpErrorReducer(state, action)
}
