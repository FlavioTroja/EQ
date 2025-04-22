import { MemoizedSelector } from "@ngrx/store";
import { ModalButton } from "./Button";
import { TooltipOpts } from "../../global";

export enum NAVBAR_ACTION {

  HOME = "HOME",

  USERS_CREATE = "USERS_CREATE",
  USERS_EDIT = "USERS_EDIT",
  USERS_DELETE = "USERS_DELETE",

  // Report section
  REPORT_SAVE = "REPORT_SAVE",
  REPORT_COMPILE_DEPARTMENT_FORWARD = "REPORT_COMPILE_DEPARTMENT_FORWARD",
  REPORT_COMPILE_DEPARTMENT_BACKWARD = "REPORT_COMPILE_DEPARTMENT_BACKWARD",
  REPORT_COMPILE_SOURCE_FORWARD = "REPORT_COMPILE_SOURCE_FORWARD",
  REPORT_COMPILE_SOURCE_BACKWARD = "REPORT_COMPILE_SOURCE_BACKWARD",

  // Supplier section
  SUPPLIER_SAVE= "SUPPLIER_SAVE",
  SUPPLIER_NAVIGATE_ON_MODIFY = "SUPPLIER_NAVIGATE_ON_MODIFY",

  // Customer section
  CUSTOMER_SAVE= "CUSTOMER_SAVE",
  CUSTOMER_NAVIGATE_ON_MODIFY = "CUSTOMER_NAVIGATE_ON_MODIFY",

  // Category section
  CATEGORY_SAVE= "CATEGORY_SAVE",
  CATEGORY_DELETE = "CATEGORY_DELETE",

  // Users section
  USER_SAVE = "USER_SAVE",
  USER_NAVIGATE_ON_MODIFY = "USER_NAVIGATE_ON_MODIFY",

}

export interface NavBarButton<T, Q> {
  label: string;
  iconName: string;
  action: string;
  navigate?: string;
  tooltipOpts?: TooltipOpts;
  dialog?: NavBarButtonDialog<T, Q>;
  selectors?: {
    hidden?: MemoizedSelector<T, Q>,
    disabled?: MemoizedSelector<T, Q>,
    isLoading?: MemoizedSelector<T, Q>,
  };
  roleSelector?: string;
}

export interface NavBarButtonDialog<T, Q> {
  title: string;
  content: MemoizedSelector<T, Q>;
  action: NAVBAR_ACTION;
  buttons?: ModalButton<T, Q>[];
}
