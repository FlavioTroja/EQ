import { Machine } from "./Machine";

export interface Environment {
  id: number,
  name: string,
  machines: Machine[]
}
