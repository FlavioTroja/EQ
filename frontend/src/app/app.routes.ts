import { Routes } from '@angular/router';
import { AuthGuard } from "./core/auth/services/auth.guard";
import NotFoundComponent from "./components/not-found/not-found.component";
import { provideState } from "@ngrx/store";
import { reducers as customerManagementReducers } from "./pages/customers/store/reducers";
import { reducers as locationManagementReducers } from "./pages/customers/pages/locations/store/reducers";
import { reducers as userManagementReducers } from "./pages/users/store/reducers";
import { reducers as machineManagementReducers } from "./pages/machines/store/reducers";
import { reducers as reportManagementReducers } from "./pages/reports/store/reducers";
import { provideEffects } from "@ngrx/effects";
import { CustomersEffects } from "./pages/customers/store/effects/customers.effects";
import { UsersEffects } from "./pages/users/store/effects/users.effects";
import { MachinesEffects } from "./pages/machines/store/effects/machines.effects";
import { ReportsEffects } from "./pages/reports/store/effects/reports.effects";
import { LocationsEffects } from "./pages/customers/pages/locations/store/effects/locations.effects";

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
    path: "auth/register",
    pathMatch: "full",
    loadComponent: () => import("./pages/auth/register/register.component"),
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
    path: "machines",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("machine-manager", machineManagementReducers),
      provideEffects(MachinesEffects)
    ],
    loadChildren: () => import("./pages/machines/machines.routing")
  },
  {
    path: "reports",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("report-manager", reportManagementReducers),
      provideEffects(ReportsEffects)
    ],
    loadChildren: () => import("./pages/reports/reports.routing")
  },
  {
    path: "customers",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("customer-manager", customerManagementReducers),
      provideState("location-manager", locationManagementReducers),
      provideEffects([CustomersEffects, LocationsEffects])
    ],
    loadChildren: () => import("./pages/customers/customers.routing")
  },
  {
    path: "users",
    canActivate: [ AuthGuard ],
    providers: [
      provideState("user-manager", userManagementReducers),
      provideEffects(UsersEffects)
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
