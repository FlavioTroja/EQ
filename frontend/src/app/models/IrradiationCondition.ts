import { Measurement } from "./Measurement";

export interface IrradiationCondition {
  id: string,
  name: string,
  setUpMeasure: string,
  parameters: KeyValue[],
  sourceId: string,
  measurements: Measurement[]
}

export interface KeyValue {
  key: string,
  value?: number
}