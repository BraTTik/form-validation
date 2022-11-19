export type ValidationResult = { hasError: boolean; error: string | null };

export interface Validator {
    validate(value: any): ValidationResult | Promise<ValidationResult>;
}

export interface Nullable {
    nullable(): this;
}
