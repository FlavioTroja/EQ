import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialMachine, Machine, MachineFilter } from "../../../models/Machine";
import { DefaultQueryParams, Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  http = inject(HttpClient);

  addMachine(payload: PartialMachine) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Machine>(`${BASE_URL}/api/registry/machines`, newPayload);
  }

  getMachine(id: string,  params?: DefaultQueryParams) {
    return this.http.get<Machine>(`${BASE_URL}/api/registry/machines/${id}`, { params: { ...params } });
  }

  editMachine(id: string, payload: PartialMachine) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Machine>(`${BASE_URL}/api/registry/machines/${id}`, body);
  }

  deleteMachine(id: string) {
    return this.http.delete<Machine>(`${BASE_URL}/api/registry/machines/${id}`);
  }

  loadMachines(payload: Query<MachineFilter>) {
    return this.http.get<PaginateDatasource<Machine>>(`${BASE_URL}/api/registry/machines`, { params: { q: payload.query?.value || "", ...payload.options } });
  }

  loadAllMachines(payload: Query<object>) {
    return this.http.post<Machine[]>(`${BASE_URL}/api/registry/machines/all`, payload);
  }


}
