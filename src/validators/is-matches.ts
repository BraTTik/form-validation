import { ValidationResult, Validator} from "../types";
import * as utils from "../utils";

export class IsMatches implements Validator {
    constructor(private test: string |RegExp, private error: string = "Wrong Value Format") {
    }

    validate(value: any): ValidationResult {
        if (!utils.isString(value)) return { hasError: true, error: this.error };

        const hasError = !utils.isMatches(value, this.test);

        return { hasError, error: hasError ? this.error : null };
    }
}
