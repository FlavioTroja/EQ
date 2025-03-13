import { Machine } from "./Machine";
import { Department } from "./Department";
import { Measurement } from "./Measurement";

export interface Source {
  id: number,
  name: string,
  sn: string,
  expirationDate: string | Date,
  departmentId: string,
  department: Department,
  machineId: number,
  machine: Machine,
  measurements: Measurement[]
}

export type PartialSource = Partial<Source>;
