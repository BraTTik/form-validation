import {ValidationResult, Validator} from "../types";
import * as utils from "../utils";

export class IsStringOrNull implements Validator {
    constructor(private error: string = "Not a string") {
    }

    validate(value: any): ValidationResult {
        const hasError = !utils.isNotNullable(value) || !utils.isString(value);
        return { hasError, error: hasError ? this.error : null }
    }

}
