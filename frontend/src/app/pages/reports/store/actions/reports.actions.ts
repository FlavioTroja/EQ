import { createAction, props } from "@ngrx/store";
import { PartialReport, Report } from "../../../../models/Report";
import { HttpError } from "../../../../models/Notification";
import { DefaultQueryParams, Query } from "../../../../../global";
import { PaginateDatasource } from "../../../../models/Table";

export const addReport = createAction("[Reports] Add", props<{ report: PartialReport }>());
export const addReportSuccess = createAction("[Reports] Add report Success", props<{ report: Report }>());
export const addReportFailed = createAction("[Reports] Add Failed", props<{ error: HttpError }>());

export const getReport = createAction("[Reports] Get", props<{ id: string, params?: DefaultQueryParams }>());
export const getReportSuccess = createAction("[Reports] Get report Success", props<{ current: Report }>());
export const getReportFailed = createAction("[Reports] Get Failed", props<{ error: HttpError }>());

export const reportActiveChanges = createAction("[Reports] On report change prop", props<{ changes: PartialReport }>());
export const updateCurrentReport = createAction("[Reports] Update current report");
export const updateCurrentDepartment = createAction("[Reports] Update current department", props<{ departmentIndex: number }>());
export const updateCurrentSource = createAction("[Reports] Update current source", props<{ sourceIndex: number }>());
export const clearReportActive = createAction("[Reports] Clear Active changes");

export const editReport = createAction("[Reports] Edit");
export const editReportSuccess = createAction("[Reports] Edit report Success", props<{ report: Report }>());
export const editReportFailed = createAction("[Reports] Edit Failed", props<{ error: HttpError }>());

export const deleteReport = createAction("[Reports] Delete", props<{ id: string }>());
export const deleteReportSuccess = createAction("[Reports] Delete report Success", props<{ report: Report }>());
export const deleteReportFailed = createAction("[Reports] Delete Failed", props<{ error: HttpError }>());

export const loadReports = createAction("[Reports] Load", props<{ query: Query<object> }>());
export const loadReportsSuccess = createAction("[Reports] Load Success", props<{ reports: PaginateDatasource<Report> }>());
export const loadReportsFailed = createAction("[Reports] Load Failed", props<{ error: HttpError }>());

export const clearReportHttpError = createAction("[Reports] Clear Http Error");
