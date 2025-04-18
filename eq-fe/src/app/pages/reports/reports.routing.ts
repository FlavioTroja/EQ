import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NAVBAR_ACTION } from "../../models/NavBar";
import { getActiveReportChanges } from "./store/selectors/reports.selectors";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/list/reports.component"),
    data: {
      title: {
        default: "Verbali"
      },
      buttons: [
        { label: "Nuovo", iconName: "add", navigate: "/reports/new" },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ]
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/edit/edit-report.component'),
    data: {
      viewOnly: false,
      title: {
        default: "Modifica Verbale",
        other: "Aggiungi Verbale"
      },
      buttons: [
        { label: "Salva", iconName: "edit", action: NAVBAR_ACTION.REPORT_SAVE, selectors: { disabled: getActiveReportChanges } },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/compile/:departmentIndex',
    loadComponent: () => import('./pages/compile/compile-departments.component'),
    data: {
      title: {
        default: "Compila Verbale"
      },
      buttons: [
        // { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.REPORT_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/compile/:departmentIndex/:machineIndex',
    loadComponent: () => import('./pages/compile/compile-machines.component'),
    data: {
      title: {
        default: "Compila Verbale"
      },
      buttons: [
        // { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.REPORT_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/compile/:departmentIndex/:machineIndex/measurements',
    loadComponent: () => import('./pages/compile/compile-measurements.component'),
    data: {
      title: {
        default: "Compila Verbale"
      },
      buttons: [
        // { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.REPORT_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/view',
    loadComponent: () => import('./pages/view/view-report.component'),
    data: {
      title: {
        default: "Visualizza Verbale"
      },
      buttons: [
        // { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.REPORT_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
  // {
  //   path: ':id/view',
  //   loadComponent: () => import('./pages/edit/edit-report.component'),
  //   data: {
  //     viewOnly: true,
  //     title: {
  //       default: "Visualizza fornitore",
  //     },
  //     buttons: [
  //       { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.REPORT_NAVIGATE_ON_MODIFY },
  //       // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
  //       // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
  //     ],
  //     backAction: "/reports",
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class ReportRoutingModule {}
