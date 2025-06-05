// import { Injectable } from "@angular/core";
// import { Actions, createEffect, ofType } from "@ngrx/effects";
// import * as SourcesActions from "../actions/sources.actions";
// import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
// import * as SourceActions from "../actions/sources.actions";
// import * as UIActions from "../../../../../../../../core/ui/store/ui.actions";
// import * as RouterActions from "../../../../../../../../core/router/store/router.actions";
// import { NOTIFICATION_LISTENER_TYPE } from "../../../../../../../../models/Notification";
// import { SourceService } from "../../services/source.service";
// import { Store } from "@ngrx/store";
// import { toSignal } from "@angular/core/rxjs-interop";
// import { selectCustomRouteParam } from "../../../../../../../../core/router/store/router.selectors";
// import { AppState } from "../../../../../../../../app.config";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class SourcesEffects {
//
//   locationId = toSignal(this.store.select(selectCustomRouteParam("locationId")));
//   customerId = toSignal(this.store.select(selectCustomRouteParam("customerId")));
//
//   addSourceEffect$ = createEffect(() => this.actions$.pipe(
//     ofType(SourcesActions.addSource),
//     exhaustMap(({ locationId, source }) => this.sourceService.addSource(locationId, source)
//       .pipe(
//         concatMap((source) => [
//           SourcesActions.addSourceSuccess({ source }),
//           RouterActions.go({ path: [`customers/${this.customerId()}/locations/${this.locationId()}/view`] })
//         ]),
//         catchError((err) => of(SourcesActions.addSourceFailed(err)))
//       ))
//   ));
//
//   editSourceEffect$ = createEffect(() => this.actions$.pipe(
//     ofType(SourcesActions.editSource),
//     exhaustMap(({ locationId, source }) => this.sourceService.editSource(source?.id!, this.locationId(), source)
//         .pipe(
//           concatMap((source) => [
//             SourcesActions.editSourceSuccess({ source }),
//             RouterActions.go({ path: [`customers/${this.customerId()}/locations/${this.locationId()}/view`] })
//           ]),
//           catchError((err) => of(SourcesActions.editSourceFailed(err)))
//         ))
//   ));
//
//   deleteLocationEffect$ = createEffect(() => this.actions$.pipe(
//       ofType(SourcesActions.deleteSource),
//       exhaustMap(({ locationId, id }) => this.sourceService.deleteSource(locationId, id)
//         .pipe(
//           map((source) => SourcesActions.deleteSourceSuccess({ source })),
//           catchError((err) => of(SourcesActions.deleteSourceFailed(err)))
//         ))
//     ));
//
//   manageNotificationSourceErrorEffect$ = createEffect(() => this.actions$.pipe(
//     ofType(...[
//       SourceActions.addSourceFailed,
//       SourceActions.deleteSourceFailed,
//       SourceActions.editSourceFailed
//     ]),
//     exhaustMap((err) => [
//       UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
//     ])
//   ));
//
//   constructor(private actions$: Actions,
//               private sourceService: SourceService,
//               private store: Store<AppState>) {}
// }