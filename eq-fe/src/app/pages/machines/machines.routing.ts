import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NAVBAR_ACTION } from "../../models/NavBar";
import { getActiveMachineChanges } from "./store/selectors/machines.selectors";

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/list/machines.component"),
    data: {
      title: {
        default: "Macchinari"
      },
      buttons: [
        { label: "Nuovo", iconName: "add", navigate: "/machines/new" },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ]
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/edit/edit-machine.component'),
    data: {
      viewOnly: false,
      title: {
        default: "Modifica macchinario",
        other: "Aggiungi macchinario"
      },
      buttons: [
        { label: "Salva", iconName: "edit", action: NAVBAR_ACTION.MACHINE_SAVE, selectors: { disabled: getActiveMachineChanges } },
        // { label: "", iconName: "search", action: NAVBAR_ACTION.USERS_EDIT },
        // { label: "", iconName: "home", action: NAVBAR_ACTION.USERS_DELETE }
      ],
      backAction: "-",
    }
  },
  {
    path: ':id/view',
    loadComponent: () => import('./pages/view/view-machine.component'),
    data: {
      title: {
        default: "Visualizza Macchinario"
      },
      buttons: [
        { label: "Modifica", iconName: "edit", action: NAVBAR_ACTION.MACHINE_NAVIGATE_ON_MODIFY },
      ],
      backAction: "-",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class MachineRoutingModule {}
