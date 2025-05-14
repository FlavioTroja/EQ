import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialLocation, Location, LocationFilter } from "../../../models/Location";
import { DefaultQueryParams, Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  http = inject(HttpClient);

  addLocation(payload: PartialLocation) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Location>(`${BASE_URL}/api/registry/locations`, newPayload);
  }

  getLocation(id: string,  params?: DefaultQueryParams) {
    return this.http.get<Location>(`${BASE_URL}/api/registry/locations/${id}`, { params: { ...params } });
  }

  editLocation(id: string, payload: PartialLocation) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Location>(`${BASE_URL}/api/registry/locations/${id}`, body);
  }

  deleteLocation(id: string) {
    return this.http.delete<Location>(`${BASE_URL}/api/registry/locations/${id}`);
  }

  loadLocations(payload: Query<LocationFilter>) {
    return this.http.get<PaginateDatasource<Location>>(`${BASE_URL}/api/registry/locations`);
  }

  loadAllLocations(payload: Query<object>) {
    return this.http.post<Location[]>(`${BASE_URL}/api/registry/locations/all`, payload);
  }


}
