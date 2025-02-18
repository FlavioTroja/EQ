import { createAction, props } from "@ngrx/store";
import { PartialUser } from "../../../models/User";

export const loadProfile = createAction("[Profile] load");

export const loadProfileSuccess = createAction("[Profile] load success", props<{user: PartialUser}>());

export const loadProfileFailed = createAction("[Profile] load failed");

export const editProfile = createAction("[Profile] edit", props<{user: PartialUser}>());

export const editProfileSuccess = createAction("[Profile] edit success", props<{user: PartialUser}>());

export const editProfileFailed = createAction("[Profile] edit failed");
