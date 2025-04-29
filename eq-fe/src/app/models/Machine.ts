import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Machine {
    id: number;
    name: string;
    creationDate: string;
    expirationDate: string;
}

export type PartialMachine = Partial<Machine>;

export function createMachinePayload(machine: any): Machine {
    const machineDTO = {
        name: machine.name,
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
