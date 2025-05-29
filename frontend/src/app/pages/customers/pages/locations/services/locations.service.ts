import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { PartialLocation, Location, LocationFilter } from "../../../../../models/Location";
import { DefaultQueryParams, Query } from "../../../../../../global";
import { PaginateDatasource } from "../../../../../models/Table";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  http = inject(HttpClient);

  addLocation(customerId: string, payload: PartialLocation) {
    const newPayload = {
      ...payload,
      id: undefined,
    }
    return this.http.post<Location>(`${BASE_URL}/api/registry/customers/${customerId}/locations`, newPayload);
  }

  getLocation(locationId: string, customerId: string,  params?: DefaultQueryParams) {
    return this.http.get<Location>(`${BASE_URL}/api/registry/customers/${customerId}/locations/${locationId}`, { params: { ...params } });
  }

  editLocation(id: string, customerId: string, payload: PartialLocation) {
    const body = { ...payload, id: id };
    return this.http.patch<Location>(`${BASE_URL}/api/registry/customers/${customerId}/locations/${id}`, body);
  }

  deleteLocation(id: string, customerId: string) {
    return this.http.delete<Location>(`${BASE_URL}/api/registry/customers/${customerId}/locations/${id}`);
  }

  loadLocations(customerId: string, payload: Query<LocationFilter>) {
    return this.http.get<PaginateDatasource<Location>>(`${BASE_URL}/api/registry/customers/${customerId}/locations`);
  }

  loadAllLocations(customerId: string, payload: Query<object>) {
    return this.http.post<Location[]>(`${BASE_URL}/api/registry/customers/${customerId}/locations/all`, payload);
  }


}
