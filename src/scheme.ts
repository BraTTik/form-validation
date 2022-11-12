import { Validator } from "./types";

export interface IScheme<T> {
    validate(value: T): { hasError: boolean; errors: Partial<Record<keyof T, string>> };
}

export class Scheme<T> implements IScheme<T> {
    constructor (private scheme: Record<keyof T, Validator>) {
    }

    validate(value: T) {
        return { hasError: false, errors: {} }
    }
}
