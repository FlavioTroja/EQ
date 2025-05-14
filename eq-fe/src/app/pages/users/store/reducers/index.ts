import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as userReducer } from "./users.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../models/Notification";
import { PaginateDatasource } from "../../../../models/Table";
import { ActiveEntity } from "../../../../../global";
import { User } from "../../../../models/User";

export interface UserManagementState {
  users?: Partial<PaginateDatasource<User>>;
  active?: Partial<ActiveEntity<User>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<UserManagementState> = {
  users: userReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectUsersManager = createFeatureSelector<UserManagementState>("user-manager");
