import { createSelector } from "@ngrx/store";
import { selectSourcesManager, SourceManagementState } from "../reducers";

export const getCurrentSource = createSelector(
  selectSourcesManager,
  (state?: SourceManagementState) => state?.active?.current
)

export const getActiveSourceChanges = createSelector(
  selectSourcesManager,
  (state?: SourceManagementState) => state?.active?.changes ?? {}
)

export const getSourcesHttpError = createSelector(
  selectSourcesManager,
  (state?: SourceManagementState) => state?.httpError
)
