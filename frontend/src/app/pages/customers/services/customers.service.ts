import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { PartialCustomer, Customer, CustomerFilter } from "../../../models/Customer";
import { Query } from "../../../../global";
import { PaginateDatasource } from "../../../models/Table";
import { Location, LocationFilter, PartialLocation } from "../../../models/Location";

const BASE_URL = environment.BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  http = inject(HttpClient);

  addCustomer(payload: PartialCustomer) {
    const newPayload = {
      ...payload,
      id: undefined,
      locations: payload.locations?.map(p => ({ ...p, id: undefined })),
    }
    return this.http.post<Customer>(`${BASE_URL}/api/registry/customers`, newPayload);
  }

  getCustomer(id: string) {
    return this.http.get<Customer>(`${BASE_URL}/api/registry/customers/${id}`, { params: { populate: "" } });
  }

  editCustomer(id: string, payload: PartialCustomer) {
    const body = { ...payload, id: undefined };
    return this.http.patch<Customer>(`${BASE_URL}/api/registry/customers/${id}`, body);
  }

  deleteCustomer(id: string) {
    return this.http.delete<Customer>(`${BASE_URL}/api/registry/customers/${id}`);
  }

  loadCustomers(payload: Query<CustomerFilter>) {
    return this.http.get<PaginateDatasource<Customer>>(`${BASE_URL}/api/registry/customers`);
  }

  loadAllCustomers(payload: Query<CustomerFilter>) {
    return this.http.get<Customer[]>(`${BASE_URL}/api/registry/customers/all`);
  }

  getLocation(location: PartialLocation) {
    return this.http.get<Location>(`${BASE_URL}/api/registry/customers/${location.customerId}/locations/${location.id}`, { params: {  } });
  }

  loadCustomerLocations(payload: Query<LocationFilter>) {
    console.log("called load locations")
    return this.http.get<PaginateDatasource<Location>>(`${BASE_URL}/api/registry/customers/${payload.query?.customerId}/locations`);
  }

}
