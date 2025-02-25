import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NAVBAR_ACTION } from "../../models/NavBar";
import { getActiveVerbalChanges } from "./store/selectors/verbals.selectors";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/list/verbals.component"),
    data: {
      title: {
        default: "Verbali"
      },
      buttons: [
        { label: "Nuovo", iconName: "add", navigate: "/verbals/new" },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ]
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/edit/edit-verbal.component'),
    data: {
      viewOnly: false,
      title: {
        default: "Modifica verbale",
        other: "Aggiungi verbale"
      },
      buttons: [
        // { label: "Salva", iconName: "edit", action: NAVBAR_ACTION.VERBAL_SAVE, selectors: { disabled: getActiveVerbalChanges } },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/view',
    loadComponent: () => import('./pages/view/view-verbal.component'),
    data: {
      title: {
        default: "Visualizza Verbale"
      },
      buttons: [
        // { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.VERBAL_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
  // {
  //   path: ':id/view',
  //   loadComponent: () => import('./pages/edit/edit-verbal.component'),
  //   data: {
  //     viewOnly: true,
  //     title: {
  //       default: "Visualizza fornitore",
  //     },
  //     buttons: [
  //       { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.VERBAL_NAVIGATE_ON_MODIFY },
  //       // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
  //       // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
  //     ],
  //     backAction: "/verbals",
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class VerbalRoutingModule {}
