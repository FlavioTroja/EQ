import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { LocationsService } from "../../services/locations.service";
import { catchError, concatMap, exhaustMap, map, of } from "rxjs";
import * as LocationsActions from "../actions/locations.actions";
import * as RouterActions from "../../../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import * as UIActions from "../../../../../../core/ui/store/ui.actions";
import { NOTIFICATION_LISTENER_TYPE } from "../../../../../../models/Notification";
import { getActiveLocationChanges } from "../selectors/locations.selectors";
import { PartialLocation } from "../../../../../../models/Location";


@Injectable({
  providedIn: 'root'
})
export class LocationsEffects {

  addLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LocationsActions.addLocation),
    exhaustMap(({ customerId, location }) => this.locationService.addLocation(customerId, location)
      .pipe(
        concatMap((location) => [
          LocationsActions.addLocationSuccess({ location }),
          RouterActions.go({ path: [`customers/${customerId}/view`] })
        ]),
        catchError((err) => of(LocationsActions.addLocationFailed(err)))
      ))
  ));

  getLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LocationsActions.getLocation),
    exhaustMap(({ locationId, customerId, params }) => this.locationService.getLocation(locationId, customerId, params)
      .pipe(
        map((location) => LocationsActions.getLocationSuccess({ current: location })),
        catchError((err) => of(LocationsActions.getLocationFailed(err)))
      ))
  ));

  // deleteLocationEffect$ = createEffect(() => this.actions$.pipe(
  //   ofType(LocationsActions.deleteLocation),
  //   exhaustMap(({ id  }) => this.locationService.deleteLocation(id)
  //     .pipe(
  //       map((location) => LocationsActions.loadLocations({ query: { query: {}, options: { limit: 10, page: 1, populate: "address" } } })),
  //       catchError((err) => of(LocationsActions.deleteLocationFailed(err)))
  //     ))
  // ));
  //
  // loadLocationEffect$ = createEffect(() => this.actions$.pipe(
  //   ofType(LocationsActions.loadLocations),
  //   exhaustMap(({ query }) => this.locationService.loadLocations(query)
  //     .pipe(
  //       concatMap((locations) => [
  //         LocationsActions.loadLocationsSuccess({ locations }),
  //         LocationsActions.clearLocationActive()
  //       ]),
  //       catchError((err) => {
  //         return of(LocationsActions.loadLocationsFailed(err));
  //       })
  //     ))
  // ));

  editLocationEffect$ = createEffect(() => this.actions$.pipe(
    ofType(LocationsActions.editLocation),
    concatLatestFrom(() => [
      this.store.select(getActiveLocationChanges)
    ]),
    exhaustMap(([_, changes]) => {
      if(changes.id! === "new") {
        return of(LocationsActions.addLocation({ customerId: changes?.customerId!, location: changes as PartialLocation }));
      }
      return this.locationService.editLocation(changes?.id!, changes?.customerId!, changes as PartialLocation)
        .pipe(
          concatMap((location) => [
            LocationsActions.editLocationSuccess({ location }),
            RouterActions.go({ path: [`customers/${changes?.customerId!}/view`] })
          ]),
          catchError((err) => of(LocationsActions.editLocationFailed(err)))
        )
    })
  ));

  manageNotificationLocationsErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      LocationsActions.getLocationFailed,
      LocationsActions.addLocationFailed,
      LocationsActions.loadLocationsFailed,
      LocationsActions.deleteLocationFailed,
      LocationsActions.editLocationFailed
    ]),
    exhaustMap((err) => [
      UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
    ])
  ));

  constructor(private actions$: Actions,
              private locationService: LocationsService,
              private store: Store) {}
}
