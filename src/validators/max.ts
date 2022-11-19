import { ValidationResult, Validator } from "../types";

export class Max implements Validator {
    constructor(private max: number, private error: string = "The number exceeds the maximum allowed") {
    }

    validate(value: any): ValidationResult {
        const hasError = value > this.max;
        return { hasError, error: hasError ? this.error : null };
    }
}
