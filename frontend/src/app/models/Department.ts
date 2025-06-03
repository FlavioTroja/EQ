import { Source } from "./Source";
import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Department {
  id: string,
  name: string,
  locationId: string,
  sources: Source[],
  completedSources: number
}

export type PartialDepartment = Partial<Department>;

export type DepartmentDTO = Department;

export function createDepartmentPayload(department: any): DepartmentDTO {
  const departmentDTO = {
    id: department.id,
    name: department.name,
    locationId: department.locationId,
    completedSources: department.completedSources,
    sources: department.sources?.filter((i: any) => Object.keys(i).length),
  }
  return <DepartmentDTO>omitBy(departmentDTO, overSome([isNil, isNaN]));
}