import { Action, createReducer, on } from "@ngrx/store";
import * as LocationActions from "../actions/locations.actions";
import { Location } from "../../../../models/Location";
import { ActiveEntity } from "../../../../../global";

const initialState: Partial<ActiveEntity<Location>> = {};

const activeLocationReducer = createReducer(
  initialState,
  on(LocationActions.getLocationSuccess, (state, { current }) => ({
    current: current
  })),
  on(LocationActions.locationActiveChanges, (state, { changes }) => ({
    ...state,
    changes: { ...changes }
  })),
  on(LocationActions.editLocationSuccess, (state, { location }) => ({
    current: { ...location }
  })),
  on(LocationActions.clearLocationActive, (state) => ({
    changes: undefined,
    current: undefined
  })),
  on(LocationActions.loadLocationsSuccess, (state) => ({
    changes: undefined,
    current: undefined
  })),
);

export function reducer(state: Partial<ActiveEntity<Location>> | undefined, action: Action) {
  return activeLocationReducer(state, action)
}
