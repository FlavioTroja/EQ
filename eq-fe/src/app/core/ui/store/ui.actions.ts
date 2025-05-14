import { createAction, props } from "@ngrx/store";
import { Notification } from "../../../models/Notification";
import { NavbarState } from "./ui.reducer";

// sidebar
export const uiToggleSidebarCollapsed = createAction("[UI] Sidebar toggle");
export const uiSetSidebarCollapseState = createAction("[UI] Set sidebar collapsed", props<{ value: boolean }>());
export const uiToggleSidebarExpandRoute = createAction("[UI] Sidebar toggle expand route", props<{ expand?: { path: string } }>());

// navbar
export const setCustomNavbar = createAction("[UI] Set Custom Navbar", props<{ navbar: NavbarState }>());
export const setPartialCustomNavbar = createAction("[UI] Partially Set Custom Navbar", props<{ navbar: NavbarState }>());
export const clearCustomNavbar = createAction("[UI] Clear Custom Navbar");

// notification
export const setUiNotification = createAction("[UI] Set ui notification", props<{ notification: Omit<Notification, "code"> }>());
export const removeSelectedNotification = createAction("[UI] Remove selected notification", props<{ code: string }>());
export const clearUINotification = createAction("[UI] Clear ui notification");
