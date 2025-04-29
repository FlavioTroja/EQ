import { Source } from "./Source";

export interface Department {
  id: number,
  name: string,
  locationId: string,
  sources: Source[]
}

export type PartialDepartment = Partial<Department>;
