import { Action, createReducer, on } from "@ngrx/store";
import * as MachinesActions from "../actions/machines.actions";
import { Machine } from "../../../../models/Machine";
import { PaginateDatasource } from "../../../../models/Table";


const initialState: Partial<PaginateDatasource<Machine>> = {}

const machinesReducer = createReducer(
  initialState,
  on(MachinesActions.loadMachinesSuccess, (state, { machines }) => ({
    ...machines
  }))
);

export function reducer(state: Partial<PaginateDatasource<Machine>> | undefined, action: Action) {
  return machinesReducer(state, action)
}
