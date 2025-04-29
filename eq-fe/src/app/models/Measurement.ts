
export interface Measurement {
  id: string,
  date: string,
  key: string,
  value: string,
  sourceId: string,
}

export type PartialMeasurement = Partial<Measurement>;
