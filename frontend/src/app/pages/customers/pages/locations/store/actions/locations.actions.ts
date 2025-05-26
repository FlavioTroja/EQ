import { createAction, props } from "@ngrx/store";
import { PartialLocation, Location } from "../../../../../../models/Location";
import { HttpError } from "../../../../../../models/Notification";
import { DefaultQueryParams, Query } from "../../../../../../../global";
import { PaginateDatasource } from "../../../../../../models/Table";

export const addLocation = createAction("[Locations] Add", props<{ customerId: string, location: PartialLocation }>());
export const addLocationSuccess = createAction("[Locations] Add location Success", props<{ location: Location }>());
export const addLocationFailed = createAction("[Locations] Add Failed", props<{ error: HttpError }>());

export const getLocation = createAction("[Locations] Get", props<{ locationId: string, customerId: string, params?: DefaultQueryParams }>());
export const getLocationSuccess = createAction("[Locations] Get location Success", props<{ current: Location }>());
export const getLocationFailed = createAction("[Locations] Get Failed", props<{ error: HttpError }>());

export const locationActiveChanges = createAction("[Locations] On location change prop", props<{ changes: PartialLocation }>());
export const clearLocationActive = createAction("[Locations] Clear Active changes");

export const editLocation = createAction("[Locations] Edit");
export const editLocationSuccess = createAction("[Locations] Edit location Success", props<{ location: Location }>());
export const editLocationFailed = createAction("[Locations] Edit Failed", props<{ error: HttpError }>());

export const deleteLocation = createAction("[Locations] Delete", props<{ id: string }>());
export const deleteLocationSuccess = createAction("[Locations] Delete location Success", props<{ location: Location }>());
export const deleteLocationFailed = createAction("[Locations] Delete Failed", props<{ error: HttpError }>());

export const loadLocations = createAction("[Locations] Load", props<{ query: Query<object> }>());
export const loadLocationsSuccess = createAction("[Locations] Load Success", props<{ locations: PaginateDatasource<Location> }>());
export const loadLocationsFailed = createAction("[Locations] Load Failed", props<{ error: HttpError }>());

export const clearLocationHttpError = createAction("[Locations] Clear Http Error");
