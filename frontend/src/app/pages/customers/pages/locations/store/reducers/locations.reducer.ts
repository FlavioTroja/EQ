import { Action, createReducer, on } from "@ngrx/store";
import * as LocationsActions from "../actions/locations.actions";
import { Location } from "../../../../../../models/Location";
import { PaginateDatasource } from "../../../../../../models/Table";


const initialState: Partial<PaginateDatasource<Location>> = {}

const locationsReducer = createReducer(
  initialState,
  on(LocationsActions.loadLocationsSuccess, (state, { locations }) => ({
    ...locations
  }))
);

export function reducer(state: Partial<PaginateDatasource<Location>> | undefined, action: Action) {
  return locationsReducer(state, action)
}
