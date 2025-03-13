import { isNaN, isNil, omitBy, overSome } from "lodash-es";

export interface Document {
    id: number;
    name: string;
    status: string;
    client: string;
    machine: string[];
    creationDate: string;
    expirationDate: string;
}

export type PartialVerbal = Partial<Document>;

export function createVerbalPayload(verbal: any): Document {
    const verbalDTO = {
        name: verbal.name,
        status: verbal.status,
        client: verbal.client,
        machine: verbal.machine,
        creationDate: verbal.creationDate,
        expirationDate: verbal.expirationDate,
    };
    return <Document>omitBy(verbalDTO, overSome([isNil, isNaN]));
}

export interface VerbalTable {
    search?: string,
    pageIndex?: number,
    pageSize?: number
}

export interface VerbalFilter {
    value?: string,
}
