import { Routes } from '@angular/router';
import { AuthGuard } from "./core/auth/services/auth.guard";
import NotFoundComponent from "./components/not-found/not-found.component";
import { provideState } from "@ngrx/store";
import { reducers as supplierManagementReducers } from "./pages/suppliers/store/reducers";
import { reducers as customerManagementReducers } from "./pages/customers/store/reducers";
import { reducers as userManagementReducers } from "./pages/users/store/reducers";
import { provideEffects } from "@ngrx/effects";
import { SuppliersEffects } from "./pages/suppliers/store/effects/suppliers.effects";
import { CustomersEffects } from "./pages/customers/store/effects/customers.effects";
import { UsersEffects } from "./pages/users/store/effects/users.effects";
import { RoleNamesEffects } from "./pages/users/store/effects/roleNames.effects";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import("./pages/landingPage/landingPage.component"),
  },
  {
    path: "home",
    canActivate: [ AuthGuard ],
    providers: [
    ],
    pathMatch: 'full',
    loadComponent: () => import("./pages/home/pages/home.component"),
    data: {
      title: {
        default: "Dashboard"
      },
      buttons: []
    }
  },
  {
    path: "suppliers",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("supplier-manager", supplierManagementReducers),
      provideEffects(SuppliersEffects)
    ],
    loadChildren: () => import("./pages/suppliers/suppliers.routing")
  },
  {
    path: "customers",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("customer-manager", customerManagementReducers),
      provideEffects(CustomersEffects)
    ],
    loadChildren: () => import("./pages/customers/customers.routing")
  },
  {
    path: "users",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("user-manager", userManagementReducers),
      provideEffects([UsersEffects, RoleNamesEffects])
    ],
    loadChildren: () => import("./pages/users/users.routing")
  },
  {
    path: "settings",
    canActivate: [ AuthGuard ],
    loadChildren: () => import("./pages/settings/settings.routing")
  },
  {
    path: "**",
    redirectTo: "404"
  },
  {
    path: "404",
    data: {
      title: {
        default: "",
        other: ""
      },
      buttons: []
    },
    component: NotFoundComponent,
  },
];
