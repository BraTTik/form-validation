import {ValidationResult, Validator} from "../types";

export class Min implements Validator {
    constructor(private min: number, private error: string = "The number exceeds the minimum allowed value") {
    }

    validate(value: any): ValidationResult {
        const hasError = value < this.min

        return { hasError, error: hasError ? this.error : null }
    }
}
