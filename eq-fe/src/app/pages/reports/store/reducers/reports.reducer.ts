import { Action, createReducer, on } from "@ngrx/store";
import * as ReportsActions from "../actions/reports.actions";
import { Document } from "../../../../models/Document";
import { PaginateDatasource } from "../../../../models/Table";


const initialState: Partial<PaginateDatasource<Document>> = {}

const reportsReducer = createReducer(
  initialState,
  on(ReportsActions.loadReportsSuccess, (state, { reports }) => ({
    ...reports
  }))
);

export function reducer(state: Partial<PaginateDatasource<Document>> | undefined, action: Action) {
  return reportsReducer(state, action)
}
