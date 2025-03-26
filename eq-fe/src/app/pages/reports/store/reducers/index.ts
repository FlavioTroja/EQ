import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as reportReducer } from "./reports.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../models/Notification";
import { Document } from "../../../../models/Document";
import { PaginateDatasource } from "../../../../models/Table";
import { ActiveEntity } from "../../../../../global";

export interface ReportManagementState {
  reports?: Partial<PaginateDatasource<Document>>;
  active?: Partial<ActiveEntity<Document>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<ReportManagementState> = {
  reports: reportReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectReportsManager = createFeatureSelector<ReportManagementState>("report-manager");
