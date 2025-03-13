import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { VerbalsService } from "../../services/verbals.service";
import { catchError, concatMap, exhaustMap, map, of } from "rxjs";
import * as VerbalsActions from "../actions/verbals.actions";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { Document } from "../../../../models/Document";
import { getActiveVerbalChanges } from "../selectors/verbals.selectors";
import * as UIActions from "../../../../core/ui/store/ui.actions";
import { NOTIFICATION_LISTENER_TYPE } from "../../../../models/Notification";


@Injectable({
  providedIn: 'root'
})
export class VerbalsEffects  {

  addVerbalEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.addVerbal),
    exhaustMap(({ verbal }) => this.verbalService.addVerbal(verbal)
      .pipe(
        concatMap((verbal) => [
          VerbalsActions.addVerbalSuccess({ verbal }),
          RouterActions.go({ path: [`/verbals`] })
        ]),
        catchError((err) => of(VerbalsActions.addVerbalFailed(err)))
      ))
  ));

  getVerbalEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.getVerbal),
    exhaustMap(({ id, params }) => this.verbalService.getVerbal(id, params)
      .pipe(
        map((verbal) => VerbalsActions.getVerbalSuccess({ current: verbal })),
        catchError((err) => of(VerbalsActions.getVerbalFailed(err)))
      ))
  ));

  getVerbalFailedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.getVerbalFailed),
    exhaustMap(() => [
      RouterActions.go({ path: ["/verbals"] })
    ])
  ));

  deleteVerbalEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.deleteVerbal),
    exhaustMap(({ id  }) => this.verbalService.deleteVerbal(id)
      .pipe(
        map((verbal) => VerbalsActions.loadVerbals({ query: { query: {}, options: { limit: 10, page: 1, populate: "address" } } })),
        catchError((err) => of(VerbalsActions.deleteVerbalFailed(err)))
      ))
  ));

  loadVerbalEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.loadVerbals),
    exhaustMap(({ query }) => this.verbalService.loadVerbals(query)
      .pipe(
        concatMap((verbals) => [
          VerbalsActions.loadVerbalsSuccess({ verbals }),
          VerbalsActions.clearVerbalActive()
        ]),
        catchError((err) => {
          return of(VerbalsActions.loadVerbalsFailed(err));
        })
      ))
  ));

  editVerbalEffect$ = createEffect(() => this.actions$.pipe(
    ofType(VerbalsActions.editVerbal),
    concatLatestFrom(() => [
      this.store.select(getActiveVerbalChanges)
    ]),
    exhaustMap(([_, changes]) => {
      if(isNaN(changes.id!)) {
        return of(VerbalsActions.addVerbal({ verbal: changes as Document }));
      }
      return this.verbalService.editVerbal(changes?.id!, changes as Document)
        .pipe(
          concatMap((verbal) => [
            VerbalsActions.editVerbalSuccess({ verbal }),
            RouterActions.go({ path: ["/verbals"] })
          ]),
          catchError((err) => of(VerbalsActions.editVerbalFailed(err)))
        )
    })
  ));

  manageNotificationVerbalsErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      VerbalsActions.getVerbalFailed,
      VerbalsActions.addVerbalFailed,
      VerbalsActions.loadVerbalsFailed,
      VerbalsActions.deleteVerbalFailed,
      VerbalsActions.editVerbalFailed
    ]),
    exhaustMap((err) => [
      UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
    ])
  ));

  constructor(private actions$: Actions,
              private verbalService: VerbalsService,
              private store: Store) {}
}
