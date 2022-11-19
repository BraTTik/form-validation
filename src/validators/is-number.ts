import {ValidationResult, Validator} from "../types";
import * as utils from "../utils";

export class IsNumber implements Validator {
    constructor(private error = "Not a number") {
    }

    validate(value: any): ValidationResult {
        const hasError = !utils.isNumber(value);

        return { hasError, error: hasError ? this.error : null}
    }
}
