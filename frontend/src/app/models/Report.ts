import { isNaN, isNil, omitBy, overSome } from "lodash-es";
import { Customer } from "./Customer";
import { Location } from "./Location";

export interface Report {
    id: string;
    customer: Customer;
    location: Location;
    creationDate: Date | string;
    readDate: Date | string;
    expirationDate: Date | string;
    //notes
    warningSignage: string;
    safetyLights: string;
    ppe: string; //Personal Protective Equipment
    safetyDevices: string;
    dosimeters: string;
    radiationRules: string;
    prevReportNotes: string;
    actionsRequired: string;
    recommendations: string;
    conclusion: string;
}
export type PartialReport = Partial<Report>;

export function createReportPayload(report: any): Report {
    const reportDTO = {
        id: report.id,
        customer: report.customer,
        location: report.location,
        creationDate: report.creationDate ? new Date(report.creationDate).toISOString() : undefined,
        readDate: report.readDate ? new Date(report.readDate).toISOString() : undefined,
        expirationDate: report.expirationDate ? new Date(report.expirationDate).toISOString() : undefined,
        // Notes
        warningSignage: report.warningSignage,
        safetyLights: report.safetyLights,
        ppe: report.ppe,
        safetyDevices: report.safetyDevices,
        dosimeters: report.dosimeters,
        radiationRules: report.radiationRules,
        prevReportNotes: report.prevReportNotes,
        actionsRequired: report.actionsRequired,
        recommendations: report.recommendations,
        conclusion: report.conclusion,
    };
    return <Report>omitBy(reportDTO, overSome([isNil, isNaN]));
}

export interface ReportTable {
    search?: string,
    pageIndex?: number,
    pageSize?: number
}

export interface ReportFilter {
    value?: string,
}
