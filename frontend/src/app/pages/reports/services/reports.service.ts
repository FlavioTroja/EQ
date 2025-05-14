import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialReport, Report, ReportFilter } from "../../../models/Report";
import { DefaultQueryParams, Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  http = inject(HttpClient);

  addReport(payload: PartialReport) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Report>(`${BASE_URL}/api/registry/reports`, newPayload);
  }

  getReport(id: string,  params?: DefaultQueryParams) {
    return this.http.get<Report>(`${BASE_URL}/api/registry/reports/${id}`, { params: { ...params } });
  }

  editReport(id: string, payload: PartialReport) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Report>(`${BASE_URL}/api/registry/reports/${id}`, body);
  }

  deleteReport(id: string) {
    return this.http.delete<Report>(`${BASE_URL}/api/registry/reports/${id}`);
  }

  loadReports(payload: Query<ReportFilter>) {
    return this.http.get<PaginateDatasource<Report>>(`${BASE_URL}/api/registry/reports`);
  }

  loadAllReports(payload: Query<object>) {
    return this.http.post<Report[]>(`${BASE_URL}/api/registry/reports/all`, payload);
  }


}
