import { createAction, props } from "@ngrx/store";
import { Source, PartialSource } from "../../../../../../../../models/Source";
import { HttpError } from "../../../../../../../../models/Notification";
import { DefaultQueryParams } from "../../../../../../../../../global";

export const addSource = createAction("[Sources] Add", props<{ locationId: string, source: PartialSource }>());
export const addSourceSuccess = createAction("[Sources] Add source Success", props<{ source: Source }>());
export const addSourceFailed = createAction("[Sources] Add Failed", props<{ error: HttpError }>());

export const editSource = createAction("[Sources] Edit", props<{ locationId: string, source: PartialSource }>());
export const editSourceSuccess = createAction("[Sources] Edit source Success", props<{ source: Source }>());
export const editSourceFailed = createAction("[Sources] Edit Failed", props<{ error: HttpError }>());

export const getSource = createAction("[Sources] Get", props<{ SourceId: string, customerId: string, params?: DefaultQueryParams }>());
export const getSourceSuccess = createAction("[Sources] Get Source Success", props<{ current: Source }>());
export const getSourceFailed = createAction("[Sources] Get Failed", props<{ error: HttpError }>());

export const sourceActiveChanges = createAction("[Sources] On Source change prop", props<{ changes: PartialSource }>());
export const clearSourceActive = createAction("[Sources] Clear Active changes");

export const deleteSource = createAction("[Sources] Delete", props<{ locationId: string, id: string }>());
export const deleteSourceSuccess = createAction("[Sources] Delete source Success", props<{ source: Source }>());
export const deleteSourceFailed = createAction("[Sources] Delete Failed", props<{ error: HttpError }>());

export const clearSourceHttpError = createAction("[Sources] Clear Http Error");