import { createSelector } from "@ngrx/store";
import { selectReportsManager, ReportManagementState } from "../reducers";

export const getReportsPaginate = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.reports
)

export const getCurrentReport = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.current
)

export const getActiveReportChanges = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.changes ?? {}
)

export const getReportsHttpError = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.httpError
)
