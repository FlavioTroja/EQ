import { Department } from "./Department";
import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Location {
  id: string,
  customerId: string,
  name: string,
  address: string,
  city: string,
  zipcode: string,
  province: string,
  departments: Department[],
  completedDepartments: number
}

export type PartialLocation = Partial<Location>;

export interface LocationFilter {
  customerId: string;
  value?: string,
}

export type LocationDTO = Location;

export function createLocationPayload(location: any): LocationDTO {
  const locationDTO = {
    id: location.id,
    name: location.name,
    customerId: location.customerId,
    address: location.address,
    city: location.city,
    zipcode: location.zipcode,
    province: location.province,
    completedDepartments: location.completedDepartments,
    departments: location.departments?.filter((i: any) => Object.keys(i).length),
  }
  return <LocationDTO>omitBy(locationDTO, overSome([isNil, isNaN]));
}
