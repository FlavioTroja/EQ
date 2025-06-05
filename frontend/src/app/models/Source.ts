import { Machine } from "./Machine";
import { Department } from "./Department";
import { isNaN, isNil, omitBy, overSome } from "lodash-es";
import { IrradiationCondition } from "./IrradiationCondition";

export interface Source {
  id: string,
  sn: string,
  phantom: string,
  load: number,
  expirationDate: string | Date,
  departmentId: string,
  department: Department,
  machineId: number,
  machine: Machine,
  irradiationConditions: IrradiationCondition[],
  completedMeasurements: number
}

export type PartialSource = Partial<Source>;

export type SourceDTO = Source;

export function createSourcePayload(source: any): SourceDTO {
  const sourceDTO = {
    id: source.id,
    name: source.name,
    customerId: source.customerId,
    address: source.address,
    city: source.city,
    zipcode: source.zipcode,
    province: source.province,
    completedDepartments: source.completedDepartments,
    departments: source.departments?.filter((i: any) => Object.keys(i).length),
  }
  return <SourceDTO>omitBy(sourceDTO, overSome([isNil, isNaN]));
}