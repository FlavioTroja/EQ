import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as verbalReducer } from "./verbals.reducer";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../models/Notification";
import { Verbal } from "../../../../models/Verbal";
import { PaginateDatasource } from "../../../../models/Table";
import { ActiveEntity } from "../../../../../global";

export interface VerbalManagementState {
  verbals?: Partial<PaginateDatasource<Verbal>>;
  active?: Partial<ActiveEntity<Verbal>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<VerbalManagementState> = {
  verbals: verbalReducer,
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectVerbalsManager = createFeatureSelector<VerbalManagementState>("verbal-manager");
