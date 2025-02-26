import { Environment } from "./Environment";

export interface Location {
  id: number,
  name: string,
  address: string,
  environments: Environment[]
}
