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
  paymentMethod: PaymentMethod,
  email: string,
  phone: number,
  note?: number,
  locations: Location[]
}

export enum PaymentMethod {
  CASH = "CASH",
  BANK_CHECK = "BANK_CHECK",
  BANCK_DRAFT = "BANCK_DRAFT",
  BANK_TRANSFER = "BANK_TRANSFER" ,
  BANK_STATEMENT = "BANK_STATEMENT",
  CREDIT_CARD = "CREDIT_CARD",
  RIBA_30 = "RIBA_30",
  RIBA_60 = "RIBA_60",
  RIBA_90 = "RIBA_90",
  RIBA_30_60 = "RIBA_30_60",
  RIBA_30_60_90 = "RIBA_30_60_90"
}
// "CASH""BANK_CHECK""BANCK_DRAFT""BANK_TRANSFER""BANK_STATEMENT""CREDIT_CARD""RIBA_30""RIBA_60""RIBA_90""RIBA_30_60""RIBA_30_60_90"

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
