import { Action, createReducer, on } from "@ngrx/store";
import * as VerbalsActions from "../actions/verbals.actions";
import { Document } from "../../../../models/Document";
import { PaginateDatasource } from "../../../../models/Table";


const initialState: Partial<PaginateDatasource<Document>> = {}

const verbalsReducer = createReducer(
  initialState,
  on(VerbalsActions.loadVerbalsSuccess, (state, { verbals }) => ({
    ...verbals
  }))
);

export function reducer(state: Partial<PaginateDatasource<Document>> | undefined, action: Action) {
  return verbalsReducer(state, action)
}
