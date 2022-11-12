import { Nullable, Validator } from "./types";
import {IsString, IsRequired, IsMatches} from "./validators";
import * as utils from "./utils";


class StringUnit implements Validator, Nullable {
    private validators: Validator[] = [];
    private isNullable = false;

    constructor() {
        this.validators.push(new IsString());
    }

    validate(value: any) {
        let isError = false;
        let error = null;
        const isOptional = this.isNullable && !utils.isFilledValue(value);

        for (let validator of this.validators) {
            if (isError || isOptional) break;
            const { hasError, error: text } = validator.validate(value);
            isError = hasError;
            error = text;
        }

        return { hasError: isError, error };
    }

    nullable(): this {
        this.isNullable = true;
        return this;
    }

    isRequired (error?: string): this {
        this.validators.push(new IsRequired(error))
        return this;
    }

    isMatches (test: string | RegExp, error?: string): this {
        this.validators.push(new IsMatches(test, error));

        return this;
    }
}


export const string = () => new StringUnit();
