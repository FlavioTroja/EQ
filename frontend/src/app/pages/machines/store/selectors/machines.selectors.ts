import { createSelector } from "@ngrx/store";
import { selectMachinesManager, MachineManagementState } from "../reducers";

export const getMachinesPaginate = createSelector(
  selectMachinesManager,
  (state?: MachineManagementState) => state?.machines
)

export const getCurrentMachine = createSelector(
  selectMachinesManager,
  (state?: MachineManagementState) => state?.active?.current
)

export const getActiveMachineChanges = createSelector(
  selectMachinesManager,
  (state?: MachineManagementState) => state?.active?.changes ?? {}
)

export const getMachinesHttpError = createSelector(
  selectMachinesManager,
  (state?: MachineManagementState) => state?.httpError
)
