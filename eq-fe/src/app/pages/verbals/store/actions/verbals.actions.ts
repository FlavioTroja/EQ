import { createAction, props } from "@ngrx/store";
import { PartialVerbal, Document } from "../../../../models/Document";
import { HttpError } from "../../../../models/Notification";
import { DefaultQueryParams, Query } from "../../../../../global";
import { PaginateDatasource } from "../../../../models/Table";

export const addVerbal = createAction("[Verbals] Add", props<{ verbal: PartialVerbal }>());

export const addVerbalSuccess = createAction("[Verbals] Add verbal Success", props<{ verbal: Document }>());

export const addVerbalFailed = createAction("[Verbals] Add Failed", props<{ error: HttpError }>());

export const getVerbal = createAction("[Verbals] Get", props<{ id: number, params?: DefaultQueryParams }>());

export const getVerbalSuccess = createAction("[Verbals] Get verbal Success", props<{ current: Document }>());

export const getVerbalFailed = createAction("[Verbals] Get Failed", props<{ error: HttpError }>());

export const verbalActiveChanges = createAction("[Verbals] On verbal change prop", props<{ changes: PartialVerbal }>());

export const clearVerbalActive = createAction("[Verbals] Clear Active changes");

export const editVerbal = createAction("[Verbals] Edit");

export const editVerbalSuccess = createAction("[Verbals] Edit verbal Success", props<{ verbal: Document }>());

export const editVerbalFailed = createAction("[Verbals] Edit Failed", props<{ error: HttpError }>());

export const deleteVerbal = createAction("[Verbals] Delete", props<{ id: number }>());

export const deleteVerbalSuccess = createAction("[Verbals] Delete verbal Success", props<{ verbal: Document }>());

export const deleteVerbalFailed = createAction("[Verbals] Delete Failed", props<{ error: HttpError }>());

export const loadVerbals = createAction("[Verbals] Load", props<{ query: Query<object> }>());

export const loadVerbalsSuccess = createAction("[Verbals] Load Success", props<{ verbals: PaginateDatasource<Document> }>());

export const loadVerbalsFailed = createAction("[Verbals] Load Failed", props<{ error: HttpError }>());

export const clearVerbalHttpError = createAction("[Verbals] Clear Http Error");
