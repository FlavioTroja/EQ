import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { ReportsService } from "../../services/reports.service";
import { catchError, concatMap, exhaustMap, map, of } from "rxjs";
import * as ReportsActions from "../actions/reports.actions";
import * as RouterActions from "../../../../core/router/store/router.actions";
import { Store } from "@ngrx/store";
import { Document } from "../../../../models/Document";
import { getActiveReportChanges } from "../selectors/reports.selectors";
import * as UIActions from "../../../../core/ui/store/ui.actions";
import { NOTIFICATION_LISTENER_TYPE } from "../../../../models/Notification";


@Injectable({
  providedIn: 'root'
})
export class ReportsEffects  {

  addReportEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.addReport),
    exhaustMap(({ report }) => this.reportService.addReport(report)
      .pipe(
        concatMap((report) => [
          ReportsActions.addReportSuccess({ report }),
          RouterActions.go({ path: [`/reports`] })
        ]),
        catchError((err) => of(ReportsActions.addReportFailed(err)))
      ))
  ));

  getReportEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.getReport),
    exhaustMap(({ id, params }) => this.reportService.getReport(id, params)
      .pipe(
        map((report) => ReportsActions.getReportSuccess({ current: report })),
        catchError((err) => of(ReportsActions.getReportFailed(err)))
      ))
  ));

  getReportFailedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.getReportFailed),
    exhaustMap(() => [
      RouterActions.go({ path: ["/reports"] })
    ])
  ));

  deleteReportEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.deleteReport),
    exhaustMap(({ id  }) => this.reportService.deleteReport(id)
      .pipe(
        map((report) => ReportsActions.loadReports({ query: { query: {}, options: { limit: 10, page: 1, populate: "address" } } })),
        catchError((err) => of(ReportsActions.deleteReportFailed(err)))
      ))
  ));

  loadReportEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.loadReports),
    exhaustMap(({ query }) => this.reportService.loadReports(query)
      .pipe(
        concatMap((reports) => [
          ReportsActions.loadReportsSuccess({ reports }),
          ReportsActions.clearReportActive()
        ]),
        catchError((err) => {
          return of(ReportsActions.loadReportsFailed(err));
        })
      ))
  ));

  editReportEffect$ = createEffect(() => this.actions$.pipe(
    ofType(ReportsActions.editReport),
    concatLatestFrom(() => [
      this.store.select(getActiveReportChanges)
    ]),
    exhaustMap(([_, changes]) => {
      if(isNaN(changes.id!)) {
        return of(ReportsActions.addReport({ report: changes as Document }));
      }
      return this.reportService.editReport(changes?.id!, changes as Document)
        .pipe(
          concatMap((report) => [
            ReportsActions.editReportSuccess({ report }),
            RouterActions.go({ path: ["/reports"] })
          ]),
          catchError((err) => of(ReportsActions.editReportFailed(err)))
        )
    })
  ));

  manageNotificationReportsErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(...[
      ReportsActions.getReportFailed,
      ReportsActions.addReportFailed,
      ReportsActions.loadReportsFailed,
      ReportsActions.deleteReportFailed,
      ReportsActions.editReportFailed
    ]),
    exhaustMap((err) => [
      UIActions.setUiNotification({ notification: { type: NOTIFICATION_LISTENER_TYPE.ERROR, message: err.error.reason?.message || "" } })
    ])
  ));

  constructor(private actions$: Actions,
              private reportService: ReportsService,
              private store: Store) {}
}
