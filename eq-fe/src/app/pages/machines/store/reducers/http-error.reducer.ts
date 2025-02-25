import { Action, createReducer, on } from "@ngrx/store";
import * as MachineActions from "../actions/machines.actions";
import { HttpError } from "../../../../models/Notification";

const initialState: Partial<HttpError> = {};

const httpErrorReducer = createReducer(
  initialState,
  on(MachineActions.clearMachineHttpError, (state, { }) => ({})),

  on(MachineActions.loadMachinesFailed, (state, { error }) => ({
    ...error
  })),
  on(MachineActions.getMachineFailed, (state, { error }) => ({
    ...error
  })),
  on(MachineActions.editMachineFailed, (state, { error }) => ({
    ...error
  })),
  on(MachineActions.deleteMachineFailed, (state, { error }) => ({
    ...error
  }))
);

export function reducer(state: Partial<HttpError> | undefined, action: Action) {
  return httpErrorReducer(state, action)
}
