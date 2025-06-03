import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as DepartmentsActions from "../actions/departments.actions";
import { catchError, concatMap, exhaustMap, map, of, tap } from "rxjs";
import * as DepartmentActions from "../actions/departments.actions";
import * as UIActions from "../../../../../../core/ui/store/ui.actions";
import * as RouterActions from "../../../../../../core/router/store/router.actions";
import { NOTIFICATION_LISTENER_TYPE } from "../../../../../../models/Notification";
import { DepartmentService } from "../../services/department.service";
import { Store } from "@ngrx/store";
import { toSignal } from "@angular/core/rxjs-interop";
import { selectCustomRouteParam } from "../../../../../../core/router/store/router.selectors";
import { AppState } from "../../../../../../app.config";

@Injectable({
  providedIn: 'root'
})
export class DepartmentsEffects {

  locationId = toSignal(this.store.select(selectCustomRouteParam("locationId")));
  customerId = toSignal(this.store.select(selectCustomRouteParam("customerId")));

  addDepartmentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(DepartmentsActions.addDepartment),
    exhaustMap(({ locationId, department }) => this.departmentService.addDepartment(locationId, department)
      .pipe(
        concatMap((department) => [
          DepartmentsActions.addDepartmentSuccess({ department }),
          RouterActions.go({ path: [`customers/${this.customerId()}/locations/${this.locationId()}/view`] })
        ]),
        catchError((err) => of(DepartmentsActions.addDepartmentFailed(err)))
      ))
  ));

  editDepartmentEffect$ = createEffect(() => this.actions$.pipe(
    ofType(DepartmentsActions.editDepartment),
    exhaustMap(({ locationId, department }) => this.departmentService.editDepartment(department?.id!, this.locationId(), department)
        .pipe(
          concatMap((department) => [
            DepartmentsActions.editDepartmentSuccess({ department }),
            RouterActions.go({ path: [`customers/${this.customerId()}/locations/${this.locationId()}/view`] })
          ]),
          catchError((err) => of(DepartmentsActions.editDepartmentFailed(err)))
        ))
  ));

  deleteLocationEffect$ = createEffect(() => this.actions$.pipe(
      ofType(DepartmentsActions.deleteDepartment),
      exhaustMap(({ locationId, id }) => this.departmentService.deleteDepartment(locationId, id)
        .pipe(
          map((department) => DepartmentsActions.deleteDepartmentSuccess({ department })),
          catchError((err) => of(DepartmentsActions.deleteDepartmentFailed(err)))
        ))
    ));

  manageNotificationDepartmentErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      DepartmentActions.addDepartmentFailed,
      DepartmentActions.deleteDepartmentFailed,
      DepartmentActions.editDepartmentFailed
    ]),
    exhaustMap((err) => [
      UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
    ])
  ));

  constructor(private actions$: Actions,
              private departmentService: DepartmentService,
              private store: Store<AppState>) {}
}