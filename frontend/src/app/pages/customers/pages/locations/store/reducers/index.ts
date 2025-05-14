import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as locationReducer } from "./locations.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../../../models/Notification";
import { Location } from "../../../../../../models/Location";
import { PaginateDatasource } from "../../../../../../models/Table";
import { ActiveEntity } from "../../../../../../../global";

export interface LocationManagementState {
  locations?: Partial<PaginateDatasource<Location>>;
  active?: Partial<ActiveEntity<Location>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<LocationManagementState> = {
  locations: locationReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectLocationsManager = createFeatureSelector<LocationManagementState>("location-manager");
