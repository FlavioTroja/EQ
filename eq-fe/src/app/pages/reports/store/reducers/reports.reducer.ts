import { Action, createReducer, on } from "@ngrx/store";
import * as ReportsActions from "../actions/reports.actions";
import { Report } from "../../../../models/Report";
import { PaginateDatasource } from "../../../../models/Table";


const initialState: Partial<PaginateDatasource<Report>> = {}

const reportsReducer = createReducer(
  initialState,
  on(ReportsActions.loadReportsSuccess, (state, { reports }) => ({
    ...reports
  }))
);

export function reducer(state: Partial<PaginateDatasource<Report>> | undefined, action: Action) {
  return reportsReducer(state, action)
}
