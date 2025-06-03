import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { PartialDepartment, Department } from "../../../../../models/Department";
import { DefaultQueryParams } from "../../../../../../global";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  http = inject(HttpClient);

  addDepartment(locationId: string, payload: PartialDepartment) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Department>(`${BASE_URL}/api/registry/locations/${locationId}/departments`, newPayload);
  }

  getDepartment(departmentId: string, locationId: string,  params?: DefaultQueryParams) {
    return this.http.get<Department>(`${BASE_URL}/api/registry/locations/${locationId}/departments/${departmentId}`, { params: { ...params } });
  }

  editDepartment(id: string, locationId: string, payload: PartialDepartment) {
    const body = { ...payload, id: id };
    return this.http.patch<Department>(`${BASE_URL}/api/registry/locations/${locationId}/departments/${id}`, body);
  }

  deleteDepartment(id: string, locationId: string) {
    return this.http.delete<Department>(`${BASE_URL}/api/registry/locations/${locationId}/departments/${id}`);
  }

  loadAllDepartments(locationId: string) {
    return this.http.get<Department[]>(`${BASE_URL}/api/registry/locations/${locationId}/locations/all`);
  }

}
