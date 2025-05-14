import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as machineReducer } from "./machines.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../models/Notification";
import { Machine } from "../../../../models/Machine";
import { PaginateDatasource } from "../../../../models/Table";
import { ActiveEntity } from "../../../../../global";

export interface MachineManagementState {
  machines?: Partial<PaginateDatasource<Machine>>;
  active?: Partial<ActiveEntity<Machine>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<MachineManagementState> = {
  machines: machineReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectMachinesManager = createFeatureSelector<MachineManagementState>("machine-manager");
