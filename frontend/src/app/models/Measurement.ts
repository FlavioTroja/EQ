
export interface Measurement {
  id: string,
  date: string,
  name: string,
  values: MeasurementValue[],
  sourceId: string,
}

export interface MeasurementValue {
  value: string;
  unitMeasure: unitMeasure;
}

export enum unitMeasure {
  microGrayExp = "microGrayExp",
  microGrayScan = "microGrayScan",
  microGrayHour = "microGrayHour",
  microSievertHour = "microSieverHour",
  miniSievertAnnual = "miniSieverAnnual",
}

export const unitMeasureLabel: { [key: string]: string } = {
  "microGrayExp": "μGy/exp",
  "microGrayScan": "μGy/scansione",
  "microGrayHour": "μGy/h",
  "microSieverHour": "μSv/h",
  "miniSieverAnnual": "mSv/anno"
}

export type PartialMeasurement = Partial<Measurement>;
