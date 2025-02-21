import { Routes } from '@angular/router';
import { AuthGuard } from "./core/auth/services/auth.guard";
import NotFoundComponent from "./components/not-found/not-found.component";
import { provideState } from "@ngrx/store";
import { reducers as customerManagementReducers } from "./pages/customers/store/reducers";
import { reducers as userManagementReducers } from "./pages/users/store/reducers";
import { reducers as machineManagementReducers } from "./pages/machines/store/reducers";
import { reducers as verbalManagementReducers } from "./pages/verbals/store/reducers";
import { provideEffects } from "@ngrx/effects";
import { CustomersEffects } from "./pages/customers/store/effects/customers.effects";
import { UsersEffects } from "./pages/users/store/effects/users.effects";
import { RoleNamesEffects } from "./pages/users/store/effects/roleNames.effects";
import { MachinesEffects } from "./pages/machines/store/effects/machines.effects";
import { VerbalsEffects } from "./pages/verbals/store/effects/verbals.effects";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import("./pages/landingPage/landingPage.component"),
  },
  {
    path: "auth/login",
    pathMatch: "full",
    loadComponent: () => import("./pages/auth/login/login.component"),
  },
  {
    path: "home",
    // canActivate: [ AuthGuard ],
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
    path: "machines",
    // canActivate: [ AuthGuard ],
    providers: [
      provideState("machine-manager", machineManagementReducers),
      provideEffects(MachinesEffects)
    ],
    loadChildren: () => import("./pages/machines/machines.routing")
  },
  {
    path: "verbals",
    // canActivate: [ AuthGuard ],
    providers: [
      provideState("verbal-manager", verbalManagementReducers),
      provideEffects(VerbalsEffects)
    ],
    loadChildren: () => import("./pages/verbals/verbals.routing")
  },
  {
    path: "customers",
    // canActivate: [ AuthGuard ],
    providers: [
      provideState("customer-manager", customerManagementReducers),
      provideEffects(CustomersEffects)
    ],
    loadChildren: () => import("./pages/customers/customers.routing")
  },
  {
    path: "users",
    // canActivate: [ AuthGuard ],
    providers: [
      provideState("user-manager", userManagementReducers),
      provideEffects([UsersEffects, RoleNamesEffects])
    ],
    loadChildren: () => import("./pages/users/users.routing")
  },
  {
    path: "settings",
    // canActivate: [ AuthGuard ],
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
