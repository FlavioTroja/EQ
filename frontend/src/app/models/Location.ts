import { Department } from "./Department";

export interface Location {
  id: string,
  customerId: string,
  name: string,
  address: string,
  city: string,
  province: string,
  departments: Department[],
  completedDepartments: number
}

export type PartialLocation = Partial<Location>;

export interface LocationFilter {
  customerId: string;
  value?: string,
}