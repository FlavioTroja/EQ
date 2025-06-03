import { createAction, props } from "@ngrx/store";
import { Department, PartialDepartment } from "../../../../../../models/Department";
import { HttpError } from "../../../../../../models/Notification";

export const addDepartment = createAction("[Departments] Add", props<{ locationId: string, department: PartialDepartment }>());
export const addDepartmentSuccess = createAction("[Departments] Add department Success", props<{ department: Department }>());
export const addDepartmentFailed = createAction("[Departments] Add Failed", props<{ error: HttpError }>());

export const editDepartment = createAction("[Departments] Edit", props<{ locationId: string, department: PartialDepartment }>());
export const editDepartmentSuccess = createAction("[Departments] Edit department Success", props<{ department: Department }>());
export const editDepartmentFailed = createAction("[Departments] Edit Failed", props<{ error: HttpError }>());

export const deleteDepartment = createAction("[Departments] Delete", props<{ locationId: string, id: string }>());
export const deleteDepartmentSuccess = createAction("[Departments] Delete department Success", props<{ department: Department }>());
export const deleteDepartmentFailed = createAction("[Departments] Delete Failed", props<{ error: HttpError }>());
