import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { reducer as httpErrorReducer } from "./http-error.reducer";
import { reducer as activeReducer } from "./active.reducer";
import { HttpError } from "../../../../../../../../models/Notification";
import { Source } from "../../../../../../../../models/Source";
import { ActiveEntity } from "../../../../../../../../../global";

export interface SourceManagementState {
  active?: Partial<ActiveEntity<Source>>;
  httpError?: Partial<HttpError>;
}

export const reducers: ActionReducerMap<SourceManagementState> = {
  active: activeReducer,
  httpError: httpErrorReducer
}

export const selectSourcesManager = createFeatureSelector<SourceManagementState>("source-manager");
