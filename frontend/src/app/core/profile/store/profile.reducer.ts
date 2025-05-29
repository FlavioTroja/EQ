import { Action, createReducer, on } from "@ngrx/store";
import { PartialUser } from "../../../models/User";
import * as AuthActions from "../../auth/store/auth.actions";
import * as ProfileActions from "./profile.actions";

export interface ProfileState {
    user: PartialUser,
  error: boolean
}
export const initialState: ProfileState = {
  user: {} as PartialUser,
  error: false
}

const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfileSuccess, (state, { user }) => ({
    user: { ...user },
    error: false
  })),
  on(ProfileActions.loadProfileFailed, (state) => ({
    ...state,
    error: true
  })),
  on(ProfileActions.editProfileSuccess, (state, { user }) => ({
    user: { ...user },
    error: false
  })),
  on(ProfileActions.editProfileFailed, (state) => ({
    ...state,
    error: false
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    user: {} as PartialUser,
    error: false
  }))
);

export function reducer(state: ProfileState | undefined, action: Action) {
  return profileReducer(state, action)
}
