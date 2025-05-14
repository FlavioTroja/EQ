import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as reportReducer } from "./reports.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { customActiveReportState, reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../models/Notification";
import { Report } from "../../../../models/Report";
import { PaginateDatasource } from "../../../../models/Table";

export interface ReportManagementState {
  reports?: Partial<PaginateDatasource<Report>>;
  active?: Partial<customActiveReportState>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<ReportManagementState> = {
  reports: reportReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectReportsManager = createFeatureSelector<ReportManagementState>("report-manager");
