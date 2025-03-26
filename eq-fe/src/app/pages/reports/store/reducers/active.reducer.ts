import { Action, createReducer, on } from "@ngrx/store";
import * as ReportActions from "../actions/reports.actions";
import { Document } from "../../../../models/Document";
import { ActiveEntity } from "../../../../../global";

const initialState: Partial<ActiveEntity<Document>> = {};

const activeReportReducer = createReducer(
  initialState,
  on(ReportActions.getReportSuccess, (state, { current }) => ({
    current: current
  })),
  on(ReportActions.reportActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(ReportActions.editReportSuccess, (state, { report }) => ({
    current: { ...report }
  })),
  on(ReportActions.clearReportActive, (state) => ({
    changes: undefined,
    current: undefined
  })),
  on(ReportActions.loadReportsSuccess, (state) => ({
    changes: undefined,
    current: undefined
  })),
);

export function reducer(state: Partial<ActiveEntity<Document>> | undefined, action: Action) {
  return activeReportReducer(state, action)
}
