import { createAction, props } from "@ngrx/store";
import { PartialMachine, Machine } from "../../../../models/Machine";
import { HttpError } from "../../../../models/Notification";
import { DefaultQueryParams, Query } from "../../../../../global";
import { PaginateDatasource } from "../../../../models/Table";

export const addMachine = createAction("[Machines] Add", props<{ machine: PartialMachine }>());
export const addMachineSuccess = createAction("[Machines] Add machine Success", props<{ machine: Machine }>());
export const addMachineFailed = createAction("[Machines] Add Failed", props<{ error: HttpError }>());

export const getMachine = createAction("[Machines] Get", props<{ id: string, params?: DefaultQueryParams }>());
export const getMachineSuccess = createAction("[Machines] Get machine Success", props<{ current: Machine }>());
export const getMachineFailed = createAction("[Machines] Get Failed", props<{ error: HttpError }>());

export const machineActiveChanges = createAction("[Machines] On machine change prop", props<{ changes: PartialMachine }>());
export const clearMachineActive = createAction("[Machines] Clear Active changes");

export const editMachine = createAction("[Machines] Edit");
export const editMachineSuccess = createAction("[Machines] Edit machine Success", props<{ machine: Machine }>());
export const editMachineFailed = createAction("[Machines] Edit Failed", props<{ error: HttpError }>());

export const deleteMachine = createAction("[Machines] Delete", props<{ id: string }>());
export const deleteMachineSuccess = createAction("[Machines] Delete machine Success", props<{ machine: Machine }>());
export const deleteMachineFailed = createAction("[Machines] Delete Failed", props<{ error: HttpError }>());

export const loadMachines = createAction("[Machines] Load", props<{ query: Query<object> }>());
export const loadMachinesSuccess = createAction("[Machines] Load Success", props<{ machines: PaginateDatasource<Machine> }>());
export const loadMachinesFailed = createAction("[Machines] Load Failed", props<{ error: HttpError }>());

export const clearMachineHttpError = createAction("[Machines] Clear Http Error");
