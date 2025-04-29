import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialVerbal, Document, VerbalFilter } from "../../../models/Document";
import { DefaultQueryParams, Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class VerbalsService {
  http = inject(HttpClient);

  addVerbal(payload: PartialVerbal) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Document>(`${BASE_URL}/api/registry/verbals`, newPayload);
  }

  getVerbal(id: number,  params?: DefaultQueryParams) {
    return this.http.get<Document>(`${BASE_URL}/api/registry/verbals/${id}`, { params: { ...params } });
  }

  editVerbal(id: number, payload: PartialVerbal) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Document>(`${BASE_URL}/api/registry/verbals/${id}`, body);
  }

  deleteVerbal(id: number) {
    return this.http.delete<Document>(`${BASE_URL}/api/registry/verbals/${id}`);
  }

  loadVerbals(payload: Query<VerbalFilter>) {
    return this.http.get<PaginateDatasource<Document>>(`${BASE_URL}/api/registry/verbals`);
  }

  loadAllVerbals(payload: Query<object>) {
    return this.http.post<Document[]>(`${BASE_URL}/api/registry/verbals/all`, payload);
  }


}
