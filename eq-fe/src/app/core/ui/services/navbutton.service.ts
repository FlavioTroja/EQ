import { inject, Injectable, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.config";
import { NAVBAR_ACTION } from "../../../models/NavBar";
import * as RouterActions from "../../router/store/router.actions";
import * as UserActions from "../../../pages/users/store/actions/users.actions";
import * as SupplierActions from "../../../pages/suppliers/store/actions/suppliers.actions";
import * as CustomerActions from "../../../pages/customers/store/actions/customers.actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../router/store/router.selectors";

@Injectable({
  providedIn: 'root'
})
export class NavbuttonService {
  store: Store<AppState> = inject(Store);
  id = toSignal(this.store.select(selectCustomRouteParam("id")));
  url = signal(document.location.href);

  navbarButtonActions = [
    {
      actionName: NAVBAR_ACTION.SUPPLIER_SAVE,
      callback: () => this.store.dispatch(SupplierActions.editSupplier())
    },
    {
      actionName: NAVBAR_ACTION.SUPPLIER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `suppliers/${this.id()}` ] }))
    },
    {
      actionName: NAVBAR_ACTION.CUSTOMER_SAVE,
      callback: () => this.store.dispatch(CustomerActions.editCustomer())
    },
    {
      actionName: NAVBAR_ACTION.CUSTOMER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `customers/${this.id()}` ] }))
    },
    {
      actionName: NAVBAR_ACTION.USER_SAVE,
      callback: () => this.store.dispatch(UserActions.editUser())
    },
    {
      actionName: NAVBAR_ACTION.USER_NAVIGATE_ON_MODIFY,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `users/${this.id()}` ] }))
    },
    {
      actionName: NAVBAR_ACTION.HOME,
      callback: () => this.store.dispatch(RouterActions.go({ path: [ `/` ] }))
    },
  ];

  dispatchAction(action: string) {
    return this.navbarButtonActions.find(({ actionName }) => actionName === action)?.callback();
  }


}
