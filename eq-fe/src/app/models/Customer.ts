import { isNaN, isNil, omitBy, overSome } from "lodash-es";
import { Section } from "../../global";
import { Location } from "./Location";

export interface Customer {
  id: string,
  name: string,
  fiscalCode: string,
  vatNumber: string,
  pec: string,
  sdi: string,
  paymentMethod: string[],
  email: string,
  phone: number,
  note?: number,
  locations: Location[]
}

export type PartialCustomer = Partial<Customer>;

export function createCustomerPayload(customer: any): CustomerDTO {
  const customerDTO = {
    id: customer.id,
    name: customer.name,
    fiscalCode: customer.fiscalCode,
    vatNumber: customer.vatNumber,
    sdi: customer.sdi,
    type: customer.type,
    email: customer.email,
    pec: customer.pec,
    phone: customer.phone,
    note: customer.note,
    locations: customer.locations?.filter((i: any) => Object.keys(i).length),
  }
  return <CustomerDTO>omitBy(customerDTO, overSome([isNil, isNaN]));
}

export interface CustomerTable {
  search?: string,
  typeValues?: string,
  pageIndex?: number,
  pageSize?: number
}

export type CustomerDTO = Customer

export type LocationOnCustomerSection = Partial<Location> & Section;

export interface CustomerFilter {
  value?: string,
}

export interface DatePeriod {
  from: string,
  to: string
}
