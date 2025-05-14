import { Action, createReducer, on } from "@ngrx/store";
import * as ReportActions from "../actions/reports.actions";
import { Report } from "../../../../models/Report";
import { Department } from "../../../../models/Department";
import { Source } from "../../../../models/Source";

export interface customActiveReportState {
  current: Partial<Report>;
  changes: Partial<Report>;
  ghostReport: Partial<Report>;
  activeDepartment: Partial<Department>;
  activeSource: Partial<Source>;
}

const initialState: Partial<customActiveReportState> = {};

const activeReportReducer = createReducer(
  initialState,
  on(ReportActions.getReportSuccess, (state, { current }) => ({
    current: current
  })),
  on(ReportActions.reportActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(ReportActions.updateCurrentReport, (state) => ({
    ...state,
    current: { ...state.changes }
  })),
  on(ReportActions.updateCurrentDepartment, (state, { departmentIndex }) => ({
    ...state,
    activeDepartment: state?.current?.location?.departments.at(departmentIndex),
  })),
  on(ReportActions.updateCurrentSource, (state, { sourceIndex }) => ({
    ...state,
    activeSource: state?.activeDepartment?.sources?.at(sourceIndex),
  })),
  on(ReportActions.editReportSuccess, (state, { report }) => ({
    current: { ...report }
  })),
  on(ReportActions.clearReportActive, (state) => ({
    changes: undefined,
    current: undefined,
    ghostReport: undefined,
    activeDepartment: undefined,
    activeSource: undefined,
  })),
  on(ReportActions.loadReportsSuccess, (state) => ({
    changes: undefined,
    current: undefined,
    ghostReport: undefined,
    activeDepartment: undefined,
    activeSource: undefined,
  })),
);

export function reducer(state: Partial<customActiveReportState> | undefined, action: Action) {
  return activeReportReducer(state, action)
}
