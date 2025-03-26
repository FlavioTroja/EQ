
export interface Measurement {
  id: string,
  date: string,
  name: string,
  values: MeasurementValue[],
  sourceId: string,
}

export interface MeasurementValue {
  value: string;
  unitMeasure: string;
}


export type PartialMeasurement = Partial<Measurement>;
