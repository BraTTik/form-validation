import {Unit} from "./unit";
import {Max, Min} from "./validators";
import * as utils from "./utils";

class NumberUnit extends Unit {
    protected typeError = "Not a number";

    constructor(typeError?: string) {
        super();
        if (typeError) {
            this.typeError = typeError;
        }
    }

    max(max: number, error?: string): this {
        this.validators.push(new Max(max, error));
        return this
    }

    min(min: number, error?: string): this {
        this.validators.push(new Min(min, error))
        return this;
    }

    protected typeCheck(value: any): boolean {
        return utils.isNumber(value);
    }
}

export const number = (typeError?: string) => new NumberUnit(typeError);
