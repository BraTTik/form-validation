export type ValidationResult = { hasError: boolean; error: string | null };

export interface Validator {
    validate(value: any): ValidationResult;
}

export interface Nullable {
    nullable(): this;
}

export interface StringUnit extends Validator {}

export interface NumberUnit extends Validator {}
