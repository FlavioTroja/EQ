import { Source } from "./Source";

export interface Department {
  id: string,
  name: string,
  locationId: string,
  sources: Source[],
  completedSources: number
}

export type PartialDepartment = Partial<Department>;
