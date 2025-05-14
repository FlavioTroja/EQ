import { createSelector } from "@ngrx/store";
import { selectLocationsManager, LocationManagementState } from "../reducers";

export const getLocationsPaginate = createSelector(
  selectLocationsManager,
  (state?: LocationManagementState) => state?.locations
)

export const getCurrentLocation = createSelector(
  selectLocationsManager,
  (state?: LocationManagementState) => state?.active?.current
)

export const getActiveLocationChanges = createSelector(
  selectLocationsManager,
  (state?: LocationManagementState) => state?.active?.changes ?? {}
)

export const getLocationsHttpError = createSelector(
  selectLocationsManager,
  (state?: LocationManagementState) => state?.httpError
)
