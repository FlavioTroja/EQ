import { createSelector } from "@ngrx/store";
import { selectReportsManager, ReportManagementState } from "../reducers";

export const getReportsPaginate = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.reports
);

export const getCurrentReport = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.current
);

export const getActiveReportChanges = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.changes ?? {}
);

export const getActiveReportLocationChanges = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.changes?.location ?? {}
);

export const getActiveReportLocationsDepartments = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.changes?.location?.departments ?? []
);

export const getActiveReportLocationsDepartmentsLength = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.changes?.location?.departments.length || 0
);

export const getActiveDepartment = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeDepartment
);

export const getBackwardDepartment = (currIndex: number) => createSelector(
  selectReportsManager,
  (state?: ReportManagementState)=> state?.active?.current?.location?.departments[currIndex-1] ?? {}
);

export const getActiveDepartmentSources = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeDepartment?.sources ?? []
);

export const getActiveDepartmentSourcesLength = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeDepartment?.sources?.length
);

export const getActiveSource = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeSource
);

export const getBackwardSource = (currIndex: number) => createSelector(
  selectReportsManager,
  (state?: ReportManagementState)=> (state?.active?.activeDepartment?.sources || [])[currIndex-1] ?? {}
);

export const getActiveSourceMeasurements = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeSource?.irradiationConditions ?? []
);

export const getActiveSourceMeasurementsLength = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.active?.activeSource?.irradiationConditions?.length
);

export const getReportsHttpError = createSelector(
  selectReportsManager,
  (state?: ReportManagementState) => state?.httpError
);
