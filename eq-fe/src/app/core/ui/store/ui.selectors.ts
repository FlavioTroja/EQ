import { UIState } from "./ui.reducer";
import { AppState } from "../../../app.config";
import { createSelector } from "@ngrx/store";

export const uiState = (state: AppState) => state.ui;

export const selectUISidebarCollapsed = createSelector(
  uiState,
  (state: UIState) => state.sidebar.collapsed
);

export const selectUISidebarExpandedPath = createSelector(
  uiState,
  (state: UIState) => state.sidebar.expand?.path
);

export const selectCustomNavbar = createSelector(
  uiState,
  (state: UIState) => state.navbar
);

export const selectUINotification = createSelector(
  uiState,
  (state: UIState) => state.notifications
);

