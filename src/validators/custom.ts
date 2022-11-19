import { ValidationResult, Validator} from "../types";

export class Custom implements Validator {
    constructor(private validator: (value: any) => ValidationResult | Promise<ValidationResult>) {
    }

    validate(value: any): ValidationResult | Promise<ValidationResult> {
        return this.validator(value);
    }
}
