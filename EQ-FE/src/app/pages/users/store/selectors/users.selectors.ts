import { createSelector } from "@ngrx/store";
import { UserManagementState, selectUsersManager } from "../reducers";

export const getUsersPaginate = createSelector(
  selectUsersManager,
  (state?: UserManagementState) => state?.users
)

export const getCurrentUser = createSelector(
  selectUsersManager,
  (state?: UserManagementState) => state?.active?.current
)

export const getActiveUserChanges = createSelector(
  selectUsersManager,
  (state?: UserManagementState) => state?.active?.changes ?? {}
)

export const getUsersHttpError = createSelector(
  selectUsersManager,
  (state?: UserManagementState) => state?.httpError
)
