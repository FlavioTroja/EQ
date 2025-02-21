import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialVerbal, Verbal, VerbalFilter } from "../../../models/Verbal";
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
    return this.http.post<Verbal>(`${BASE_URL}/verbals/create`, newPayload);
  }

  getVerbal(id: number,  params?: DefaultQueryParams) {
    return this.http.get<Verbal>(`${BASE_URL}/verbals/${id}`, { params: { ...params } });
  }

  editVerbal(id: number, payload: PartialVerbal) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Verbal>(`${BASE_URL}/verbals/${id}`, body);
  }

  deleteVerbal(id: number) {
    return this.http.delete<Verbal>(`${BASE_URL}/verbals/${id}`);
  }

  loadVerbals(payload: Query<VerbalFilter>) {
    return this.http.post<PaginateDatasource<Verbal>>(`${BASE_URL}/verbals`, payload);
  }

  loadAllVerbals(payload: Query<object>) {
    return this.http.post<Verbal[]>(`${BASE_URL}/verbals/all`, payload);
  }


}
