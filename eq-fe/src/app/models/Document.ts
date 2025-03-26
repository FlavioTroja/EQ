import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Document {
    id: number;
    name: string;
    status: string;
    client: string;
    machine: string[];
    creationDate: string;
    expirationDate: string;
}

export type PartialReport = Partial<Document>;

export function createReportPayload(report: any): Document {
    const reportDTO = {
        name: report.name,
        status: report.status,
        client: report.client,
        machine: report.machine,
        creationDate: report.creationDate,
        expirationDate: report.expirationDate,
    };
    return <Document>omitBy(reportDTO, overSome([isNil, isNaN]));
}

export interface ReportTable {
    search?: string,
    pageIndex?: number,
    pageSize?: number
}

export interface ReportFilter {
    value?: string,
}
