import { Unit } from "./unit";

type ConditionScheme<T> = { condition: Condition<T>, scheme: Partial<Record<keyof T, Unit>>}
type SchemeValidationResult<T> = { hasError: boolean; errors: Partial<Record<keyof T, string>> }

export type Condition<T extends Record<string, any>> = boolean | ((values: T) => boolean);

export interface IScheme<T extends Record<string, any>> {
    validate(value: T): SchemeValidationResult<T>;
    if(schemes: ConditionScheme<T>[]): this;
}


export class Scheme<T extends Record<string, any>> implements IScheme<T> {
    private conditions: ConditionScheme<T>[] = [];

    constructor (private scheme: Partial<Record<keyof T, Unit>>) {
    }

    public readonly validate = (values: T) => {
        this.checkValueType(values);
        const baseValidation = this.baseValidation(values);

        return this.conditionValidation(values, baseValidation);
    }

    public readonly if = (schemes: ConditionScheme<T>[]): this => {
        this.conditions = schemes;
        return this;
    }

    private checkValueType = (value: any) => {
        if (typeof value === "object" && value !== null) {
            return true;
        } else {
            throw new Error(`Objects only are allowed got ${typeof value} instead`);
        }
    }

    private baseValidation = (values: T) => {
        let isError = false;
        const errors: Partial<Record<keyof T, string>> = {};

        const schemeKeys = Object.keys(this.scheme) as (keyof T)[];

        for (const key of schemeKeys) {
            const value = values[key];
            const validator = this.scheme[key];

            if (validator) {
                const { hasError, error } = validator.validate(value);

                if (hasError) {
                    isError = true;
                    errors[key] = error;
                }
            }
        }

        return { hasError: isError, errors }
    }

    private conditionValidation = (values: T, baseValidationResult: SchemeValidationResult<T>) => {
        for (const { condition, scheme } of this.conditions) {
            const isPass: boolean = typeof condition === "function" ? condition(values) : condition;

            if (isPass) {
                const s = new Scheme(scheme);
                const result = s.validate(values);

                if (result.hasError) {
                    baseValidationResult.hasError = true;
                    Object.entries(result.errors).forEach(([key, error]) => {
                        if (error && !baseValidationResult.errors[key]) {
                            baseValidationResult.errors[key as keyof T] = error
                        }
                    })
                }
            }
        }

        return baseValidationResult;
    }
}
