import {ValidationResult, Validator} from "../types";
import * as utils from "../utils";

export class IsString implements Validator {
    constructor(private error: string = "Not a string") {
    }

    validate(value: any): ValidationResult {
        const hasError = !utils.isString(value);
        return { hasError, error: hasError ? this.error : null }
    }
}
