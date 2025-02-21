import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { MachinesService } from "../../services/machines.service";
import { catchError, concatMap, exhaustMap, map, of } from "rxjs";
import * as MachinesActions from "../actions/machines.actions";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { Machine } from "../../../../models/Machine";
import { getActiveMachineChanges } from "../selectors/machines.selectors";
import * as UIActions from "../../../../core/ui/store/ui.actions";
import { NOTIFICATION_LISTENER_TYPE } from "../../../../models/Notification";


@Injectable({
  providedIn: 'root'
})
export class MachinesEffects  {

  addMachineEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.addMachine),
    exhaustMap(({ machine }) => this.machineService.addMachine(machine)
      .pipe(
        concatMap((machine) => [
          MachinesActions.addMachineSuccess({ machine }),
          RouterActions.go({ path: [`/machines`] })
        ]),
        catchError((err) => of(MachinesActions.addMachineFailed(err)))
      ))
  ));

  getMachineEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.getMachine),
    exhaustMap(({ id, params }) => this.machineService.getMachine(id, params)
      .pipe(
        map((machine) => MachinesActions.getMachineSuccess({ current: machine })),
        catchError((err) => of(MachinesActions.getMachineFailed(err)))
      ))
  ));

  getMachineFailedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.getMachineFailed),
    exhaustMap(() => [
      RouterActions.go({ path: ["/machines"] })
    ])
  ));

  deleteMachineEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.deleteMachine),
    exhaustMap(({ id  }) => this.machineService.deleteMachine(id)
      .pipe(
        map((machine) => MachinesActions.loadMachines({ query: { query: {}, options: { limit: 10, page: 1, populate: "address" } } })),
        catchError((err) => of(MachinesActions.deleteMachineFailed(err)))
      ))
  ));

  loadMachineEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.loadMachines),
    exhaustMap(({ query }) => this.machineService.loadMachines(query)
      .pipe(
        concatMap((machines) => [
          MachinesActions.loadMachinesSuccess({ machines }),
          MachinesActions.clearMachineActive()
        ]),
        catchError((err) => {
          return of(MachinesActions.loadMachinesFailed(err));
        })
      ))
  ));

  editMachineEffect$ = createEffect(() => this.actions$.pipe(
    ofType(MachinesActions.editMachine),
    concatLatestFrom(() => [
      this.store.select(getActiveMachineChanges)
    ]),
    exhaustMap(([_, changes]) => {
      if(isNaN(changes.id!)) {
        return of(MachinesActions.addMachine({ machine: changes as Machine }));
      }
      return this.machineService.editMachine(changes?.id!, changes as Machine)
        .pipe(
          concatMap((machine) => [
            MachinesActions.editMachineSuccess({ machine }),
            RouterActions.go({ path: ["/machines"] })
          ]),
          catchError((err) => of(MachinesActions.editMachineFailed(err)))
        )
    })
  ));

  manageNotificationMachinesErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      MachinesActions.getMachineFailed,
      MachinesActions.addMachineFailed,
      MachinesActions.loadMachinesFailed,
      MachinesActions.deleteMachineFailed,
      MachinesActions.editMachineFailed
    ]),
    exhaustMap((err) => [
      UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
    ])
  ));

  constructor(private actions$: Actions,
              private machineService: MachinesService,
              private store: Store) {}
}
