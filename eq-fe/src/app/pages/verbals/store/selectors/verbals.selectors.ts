import { createSelector } from "@ngrx/store";
import { selectVerbalsManager, VerbalManagementState } from "../reducers";

export const getVerbalsPaginate = createSelector(
  selectVerbalsManager,
  (state?: VerbalManagementState) => state?.verbals
)

export const getCurrentVerbal = createSelector(
  selectVerbalsManager,
  (state?: VerbalManagementState) => state?.active?.current
)

export const getActiveVerbalChanges = createSelector(
  selectVerbalsManager,
  (state?: VerbalManagementState) => state?.active?.changes ?? {}
)

export const getVerbalsHttpError = createSelector(
  selectVerbalsManager,
  (state?: VerbalManagementState) => state?.httpError
)
