import { ValidationResult, Validator} from "../types";
import * as utils from "../utils";

export class IsRequired implements Validator {
    constructor(private error: string = "Required") {
    }

    validate(value: any): ValidationResult {
        const hasError = !utils.isFilledValue(value);
        return { hasError, error: hasError ? this.error : null }
    }

}
