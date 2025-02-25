import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Verbal {
    id: number;
    name: string;
    status: string;
    client: string;
    machine: string[];
    creationDate: string;
    expirationDate: string;
}

export type PartialVerbal = Partial<Verbal>;

export function createVerbalPayload(verbal: any): Verbal {
    const verbalDTO = {
        name: verbal.name,
        status: verbal.status,
        client: verbal.client,
        machine: verbal.machine,
        creationDate: verbal.creationDate,
        expirationDate: verbal.expirationDate,
    };
    return <Verbal>omitBy(verbalDTO, overSome([isNil, isNaN]));
}

export interface VerbalTable {
    search?: string,
    pageIndex?: number,
    pageSize?: number
}

export interface VerbalFilter {
    value?: string,
}
