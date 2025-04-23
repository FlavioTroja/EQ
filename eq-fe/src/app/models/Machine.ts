import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Machine {
    id: string;
    name: string;
    type: MachineType;
    creationDate: string;
    expirationDate: string;
}

export enum MachineType {
    REMOTE_CONTROLLED = "REMOTE_CONTROLLED",
    TELETROCH = "TELETROCH",
}

export const getLabelFromMachineType: { [key: string]: string } = {
    REMOTE_CONTROLLED: "Controllo remoto",
    TELETROCH: "Teletroch",
}

export type PartialMachine = Partial<Machine>;

export function createMachinePayload(machine: any): Machine {
    const machineDTO = {
        name: machine.name,
        type: machine.type,
        creationDate: machine.creationDate,
        expirationDate: machine.expirationDate,
    };
    return <Machine>omitBy(machineDTO, overSome([isNil, isNaN]));
}

export interface MachineTable {
    search?: string,
    pageIndex?: number,
    pageSize?: number
}

export interface MachineFilter {
    value?: string,
}
