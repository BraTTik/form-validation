import { IsMatches } from "./validators";
import { Unit } from "./unit";
import * as utils from "./utils";


class StringUnit extends Unit {
    protected typeError = "Not a string";

    constructor(typeError?: string) {
        super();
        if (typeError) {
            this.typeError = typeError;
        }
    }

    isMatches (test: string | RegExp, error?: string): this {
        this.validators.push(new IsMatches(test, error));

        return this;
    }

    protected typeCheck(value: any): boolean {
        return utils.isString(value);
    }
}


export const string = (typeError?: string) => new StringUnit(typeError);
