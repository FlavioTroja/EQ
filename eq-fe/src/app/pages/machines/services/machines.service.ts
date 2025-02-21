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
    return this.http.post<Machine>(`${BASE_URL}/machines/create`, newPayload);
  }

  getMachine(id: number,  params?: DefaultQueryParams) {
    return this.http.get<Machine>(`${BASE_URL}/machines/${id}`, { params: { ...params } });
  }

  editMachine(id: number, payload: PartialMachine) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Machine>(`${BASE_URL}/machines/${id}`, body);
  }

  deleteMachine(id: number) {
    return this.http.delete<Machine>(`${BASE_URL}/machines/${id}`);
  }

  loadMachines(payload: Query<MachineFilter>) {
    return this.http.post<PaginateDatasource<Machine>>(`${BASE_URL}/machines`, payload);
  }

  loadAllMachines(payload: Query<object>) {
    return this.http.post<Machine[]>(`${BASE_URL}/machines/all`, payload);
  }


}
