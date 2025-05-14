import { Action, createReducer, on } from "@ngrx/store";
import * as MachineActions from "../actions/machines.actions";
import { Machine } from "../../../../models/Machine";
import { ActiveEntity } from "../../../../../global";

const initialState: Partial<ActiveEntity<Machine>> = {};

const activeMachineReducer = createReducer(
  initialState,
  on(MachineActions.getMachineSuccess, (state, { current }) => ({
    current: current
  })),
  on(MachineActions.machineActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(MachineActions.editMachineSuccess, (state, { machine }) => ({
    current: { ...machine }
  })),
  on(MachineActions.clearMachineActive, (state) => ({
    changes: undefined,
    current: undefined
  })),
  on(MachineActions.loadMachinesSuccess, (state) => ({
    changes: undefined,
    current: undefined
  })),
);

export function reducer(state: Partial<ActiveEntity<Machine>> | undefined, action: Action) {
  return activeMachineReducer(state, action)
}
