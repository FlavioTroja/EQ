import { Action, createReducer, on } from "@ngrx/store";
import * as VerbalsActions from "../actions/verbals.actions";
import { Verbal } from "../../../../models/Verbal";
import { PaginateDatasource } from "../../../../models/Table";


const initialState: Partial<PaginateDatasource<Verbal>> = {}

const verbalsReducer = createReducer(
  initialState,
  on(VerbalsActions.loadVerbalsSuccess, (state, { verbals }) => ({
    ...verbals
  }))
);

export function reducer(state: Partial<PaginateDatasource<Verbal>> | undefined, action: Action) {
  return verbalsReducer(state, action)
}
