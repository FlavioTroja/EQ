import { inject, Injectable, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.config";
import { NAVBAR_ACTION } from "../../../models/NavBar";
import * as RouterActions from "../../router/store/router.actions";
import * as UserActions from "../../../pages/users/store/actions/users.actions";
import * as SupplierActions from "../../../pages/suppliers/store/actions/suppliers.actions";
import * as CustomerActions from "../../../pages/customers/store/actions/customers.actions";
import * as ReportActions from "../../../pages/reports/store/actions/reports.actions";
import * as MachineActions from "../../../pages/machines/store/actions/machines.actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../router/store/router.selectors";
import {
  getActiveDepartmentSourcesLength,
  getActiveReportLocationsDepartmentsLength
} from "../../../pages/reports/store/selectors/reports.selectors";

@Injectable({
  providedIn: 'root'
})
export class NavbuttonService {
  store: Store<AppState> = inject(Store);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  url = signal(document.location.href);
  departmentIndex = toSignal(this.store.select(selectCustomRouteParam("departmentIndex")));
  departmentLength = toSignal(this.store.select(getActiveReportLocationsDepartmentsLength));
  sourceIndex = toSignal(this.store.select(selectCustomRouteParam("sourceIndex")));
  sourceLength = toSignal(this.store.select(getActiveDepartmentSourcesLength));

  navbarButtonActions = [
    // REPORT SECTION
    {
      actionName: NAVBAR_ACTION.REPORT_SAVE,
      callback: () => this.store.dispatch(ReportActions.editReport())
    },
    {
      actionName: NAVBAR_ACTION.REPORT_COMPILE_DEPARTMENT_FORWARD,
      callback: () => (+this.departmentIndex()+1) < this.departmentLength()!
        ? this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}/compile/${ +this.departmentIndex()+1 }`] }))
        : this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}`] }))
    },
    {
      actionName: NAVBAR_ACTION.REPORT_COMPILE_DEPARTMENT_BACKWARD,
      callback: () => this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}/compile/${ +this.departmentIndex()-1 }`] }))
    },
    {
      actionName: NAVBAR_ACTION.REPORT_COMPILE_SOURCE_FORWARD,
      callback: () => (+this.sourceIndex()+1) < this.sourceLength()!
        ? this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}/compile/${this.departmentIndex()}/${ +this.sourceIndex()+1 }`] }))
        : this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}/compile/${ this.departmentIndex() }`] }))
    },
    {
      actionName: NAVBAR_ACTION.REPORT_COMPILE_SOURCE_BACKWARD,
      callback: () => this.store.dispatch(RouterActions.go({ path: [`reports/${this.id()}/compile/${this.departmentIndex()}/${ +this.sourceIndex()-1 }`] }))
    },
    // MACHINE SECTION
    {
      actionName: NAVBAR_ACTION.MACHINE_SAVE,
      callback: () => this.store.dispatch(MachineActions.editMachine())
    },
    {
      actionName: NAVBAR_ACTION.MACHINE_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `machines/${this.id()}` ] }))
    },
    // CUSTOMER SECTION
    {
      actionName: NAVBAR_ACTION.CUSTOMER_SAVE,
      callback: () => this.store.dispatch(CustomerActions.editCustomer())
    },
    {
      actionName: NAVBAR_ACTION.CUSTOMER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `customers/${this.id()}` ] }))
    },
    // USER SECTION
    {
      actionName: NAVBAR_ACTION.USER_SAVE,
      callback: () => this.store.dispatch(UserActions.editUser())
    },
    {
      actionName: NAVBAR_ACTION.USER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `users/${this.id()}` ] }))
    },
    //SUPPLIER SECTION
    {
      actionName: NAVBAR_ACTION.SUPPLIER_SAVE,
      callback: () => this.store.dispatch(SupplierActions.editSupplier())
    },
    {
      actionName: NAVBAR_ACTION.SUPPLIER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `suppliers/${this.id()}` ] }))
    },
    // HOME
    {
      actionName: NAVBAR_ACTION.HOME,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `/` ] }))
    },
  ];

  dispatchAction(action: string) {
    return this.navbarButtonActions.find(({ actionName }) => actionName === action)?.callback();
  }


}
