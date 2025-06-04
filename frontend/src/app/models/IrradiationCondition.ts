import { Measurement } from "./Measurement";

export interface IrradiationCondition {
  id: string,
  setUpMeasure: string,
  key: string,
  value : number,
  sourceId: string,
  measurements: Measurement[]
}