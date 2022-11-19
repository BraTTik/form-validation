import { Nullable, ValidationResult, Validator } from "./types";
import { Custom, IsRequired } from "./validators";
import * as utils from "./utils";

interface IUnit {
    validate: (value: any) => Promise<ValidationResult>;
}

export abstract class Unit implements IUnit, Nullable {
    protected validators: Validator[] = [];
    protected typeError = "Not a type";
    private isNullable = false;
    private isOptional = false;

    public readonly validate = async (value: any) => {
        let { hasError: isError, error } = this.validateType(value);
        const isOptional = this.isOptional && !utils.isFilledValue(value);

        for await (let validator of this.validators) {
            if (isError || isOptional) break;
            const { hasError, error: text } = await validator.validate(value);
            isError = hasError;
            error = text;
        }

        return { hasError: isError, error };
    }

    isRequired (error?: string): this {
        this.validators.push(new IsRequired(error))
        return this;
    }

    nullable(): this {
        this.isNullable = true;
        return this;
    }

    optional(): this {
        this.isOptional = true;
        return this;
    }

    custom (callback: (value: any) => (ValidationResult | Promise<ValidationResult>)): this {
        const customValidator = new Custom(callback);
        this.validators.push(customValidator);
        return this;
    }

    protected validateType (value: any): ValidationResult {
        if(this.isNullable && utils.isNull(value)) {
            return { hasError: false, error: null }
        }

        const hasError = !this.typeCheck(value);

        return { hasError, error: hasError ? this.typeError : null };
    }

    protected abstract typeCheck(value: any): boolean;
}
