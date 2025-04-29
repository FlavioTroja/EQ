import { createAction, props } from "@ngrx/store";
import { PartialCustomer, Customer, LocationOnCustomerSection } from "../../../../models/Customer";
import { HttpError } from "../../../../models/Notification";
import { Query } from "../../../../../global";
import { PaginateDatasource } from "../../../../models/Table";
import { CustomerFilter } from "../../../../models/Customer";

export const addCustomer = createAction("[Customers] Add", props<{ customer: PartialCustomer }>());

export const addCustomerSuccess = createAction("[Customers] Add customer Success", props<{ customer: Customer }>());

export const addCustomerFailed = createAction("[Customers] Add Failed", props<{ error: HttpError }>());

export const getCustomer = createAction("[Customers] Get", props<{ id: string }>());

export const getCustomerSuccess = createAction("[Customers] Get customer Success", props<{ current: Customer }>());

export const getCustomerFailed = createAction("[Customers] Get Failed", props<{ error: HttpError }>());

export const customerActiveChanges = createAction("[Customers] On customer change prop", props<{ changes: PartialCustomer }>());

export const clearCustomerActive = createAction("[Customers] Clear Active changes");

export const editCustomer = createAction("[Customers] Edit");

export const editCustomerSuccess = createAction("[Customers] Edit customer Success", props<{ customer: Customer }>());

export const editCustomerFailed = createAction("[Customers] Edit Failed", props<{ error: HttpError }>());

export const deleteCustomer = createAction("[Customers] Delete", props<{ id: string }>());

export const deleteCustomerSuccess = createAction("[Customers] Delete customer Success", props<{ customer: Customer }>());

export const deleteCustomerFailed = createAction("[Customers] Delete Failed", props<{ error: HttpError }>());

export const loadCustomers = createAction("[Customers] Load", props<{ query: Query<object> }>());

export const loadCustomersSuccess = createAction("[Customers] Load Success", props<{ customers: PaginateDatasource<Customer> }>());

export const loadCustomersFailed = createAction("[Customers] Load Failed", props<{ error: HttpError }>());

export const clearCustomerHttpError = createAction("[Customers] Clear Http Error");

export const editCustomerFilter = createAction("[Customers] Edit customer filter", props<{ filters: Query<CustomerFilter> }>());

export const editCustomerFilterSuccess = createAction("[Customers] Edit customer filter success", props<{ filters: Query<CustomerFilter> }>());

export const clearCustomerFilter = createAction("[Customers] Edit customer filter");

export const addressFormActiveChanges = createAction("[Customers] On address form change prop", props<{ changes: LocationOnCustomerSection }>());

export const clearAddressFormActiveChanges = createAction("[Customers] Clear address form");

export const getPlaceDetail = createAction("[Customers] Get place detail", props<{ placeId: string }>());

export const newClearCustomerFormActiveChanges = createAction("[Customers] Clear customer creation form");
export const newCustomerFormActiveChanges = createAction("[Customers] On customer creation form change prop", props<{ changes: Partial<Customer> }>());
